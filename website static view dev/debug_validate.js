
const { validatePhoneNumberLength } = require('libphonenumber-js');

const country = 'PA';
const validNumber = '+50761234567'; // 12 chars
const tooLongNumber = '+507612345678'; // 13 chars
const wayTooLong = '+50761234567890'; // 15 chars

console.log(`Valid (${validNumber}): ${validatePhoneNumberLength(validNumber, country)}`);
console.log(`Too Long (${tooLongNumber}): ${validatePhoneNumberLength(tooLongNumber, country)}`);
console.log(`Way Too Long (${wayTooLong}): ${validatePhoneNumberLength(wayTooLong, country)}`);
