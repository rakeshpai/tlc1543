TLC1543
===
This npm module helps you read the ADC values of a TLC1543 chip via a Raspberry Pi.

This was created to read data from the ADC on-board the [AlphaBot](http://www.waveshare.com/wiki/AlphaBot).

Installation:
```
npm install tlc1543
```

Usage:

```javascript
const wpi = require('wiring-pi');
const tlc1543 = require('tlc1543');

wpi.wiringPiSetupPhys();

const adcRead = tlc1543(wpi);

[...Array(11).keys()].map(channel => {
  console.log('Channel', channel, 'value:', adcRead(channel));
});

// On the AlphaBot, channel 10 on the TLC1543 is connected via a 1:1 voltage divider to the Vbatt
console.log('Battery level:', ((adcRead(10) * 5 * 2 /1024) + 0.4  /* diode drop */).toFixed(2), 'volts');
```

Uses the pinout of the AlphaBot by default when `wiringPiSetupPhys` is used. Can be re-configured as arguments to the `tlc1543` function.

License: MIT
