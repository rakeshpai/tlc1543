const wpi = require('wiring-pi');
const tlc1543 = require('./');

wpi.wiringPiSetupPhys();

const adcRead = tlc1543(wpi);

console.time('read-11-values');
[...Array(11).keys()].map(channel => console.log('Channel', channel, 'value:', adcRead(channel)));
console.timeEnd('read-11-values');

console.log('Battery level:', ((adcRead(10) * 10 /1024) + 0.4  /* diode drop */).toFixed(2), 'volts');
