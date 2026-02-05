
const { getExampleNumber } = require('libphonenumber-js');
const examples = require('libphonenumber-js/examples.mobile.json');

const country = 'PA';
const example = getExampleNumber(country, examples);

if (example) {
    const formatted = example.format('E.164');
    console.log(`Country: ${country}`);
    console.log(`Example: ${formatted}`);
    console.log(`Length: ${formatted.length}`);
    console.log(`National Number: ${example.nationalNumber}`);
} else {
    console.log('No example found');
}
