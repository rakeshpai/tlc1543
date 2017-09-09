// Based on code here: https://github.com/MoonMaker/RaspberryPi/blob/master/ARPI600_C-samples/src/AD_TLC1543/tlc1543.c
// Other reading: http://www.pibits.net/code/using-the-tlc1543-with-a-raspberry-pi.php
//                https://translate.google.co.in/translate?hl=en&sl=it&u=http://www.itisravenna.gov.it/corso/labsitel/provelab/spi_arduino/&prev=search

const range = limit => [...Array(limit).keys()];

module.exports = (wpi, { clockPin = 22, dataPin = 16, addressPin = 18, csPin = 29 } = {}) => {
  wpi.pinMode(dataPin, wpi.INPUT);
  wpi.pullUpDnControl(dataPin, wpi.PUD_UP);

  [clockPin, addressPin, csPin].forEach(pin => wpi.pinMode(pin, wpi.OUTPUT));

  wpi.digitalWrite(csPin, wpi.HIGH);

  const startComms = () => {
    wpi.digitalWrite(clockPin, wpi.LOW);
    wpi.digitalWrite(csPin, wpi.HIGH);
    wpi.delayMicroseconds(2);
    wpi.digitalWrite(csPin, wpi.LOW);
    wpi.delayMicroseconds(2);
  }


  // Return a function that reads the ADC value
  return channel => {
    let ch = channel << 4;
    let msb = lsb = 0;

    // Start communication
    startComms();

    // Send address
    range(4).forEach(i => {
      let chan = ch;
      chan >>= 7;
      wpi.digitalWrite(addressPin, (chan & 0x01) ? wpi.HIGH : wpi.LOW);
      wpi.delayMicroseconds(2);
      wpi.digitalWrite(clockPin, wpi.HIGH);
      wpi.digitalWrite(clockPin, wpi.LOW);
      ch = ch << 1;
    });

    // Blanks, to complete the btye
    range(6).forEach(i => {
      [wpi.HIGH, wpi.LOW].forEach(state => wpi.digitalWrite(clockPin, state));
    });

    // End send
    wpi.digitalWrite(csPin, wpi.HIGH);

    // processing time
    wpi.delayMicroseconds(20);

    // Start read
    startComms();

    // Read MSB
    range(2).forEach(i => {
      wpi.digitalWrite(clockPin, wpi.HIGH);
      msb <<= 1;
      if(wpi.digitalRead(dataPin)) msb |= 0x1;
      wpi.digitalWrite(clockPin, wpi.LOW);
      wpi.delayMicroseconds(1);
    });

    // Read LSB
    range(8).forEach(i => {
      wpi.digitalWrite(clockPin, wpi.HIGH);
      lsb <<= 1;
      if(wpi.digitalRead(dataPin)) lsb |= 0x1;
      wpi.digitalWrite(clockPin, wpi.LOW);
      wpi.delayMicroseconds(1);
    });

    wpi.digitalWrite(csPin, wpi.HIGH);

    // Combine MSB & LSB
    let value = msb;
    value <<= 8;
    value |= lsb;

    return value;
  }
}
