
const { getExampleNumber } = require('libphonenumber-js');
const examples = require('libphonenumber-js/examples.mobile.json');

const country = 'PA';
const example = getExampleNumber(country, examples);

if (example) {
    const formattedExample = example.format('E.164');
    const maxLength = formattedExample.length;

    console.log(`Max Length for PA: ${maxLength} (Example: ${formattedExample})`);

    const input1 = '+50761234567'; // 12 chars
    const input2 = '+507612345678'; // 13 chars

    if (input1.length > maxLength) {
        console.log(`Input 1 (${input1}): BLOCKED`);
    } else {
        console.log(`Input 1 (${input1}): ALLOWED`);
    }

    if (input2.length > maxLength) {
        console.log(`Input 2 (${input2}): BLOCKED`);
    } else {
        console.log(`Input 2 (${input2}): ALLOWED`);
    }
} else {
    console.log('No example found');
}
