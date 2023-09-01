require('dotenv').config();
const monthNames = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const Airtable = require('airtable');
const apiKey = process.env.API_KEY;  // Fetch the API key from environment variables
const baseId = 'appW8YUaabzGoy0Vq';
const base = new Airtable({ apiKey }).base(baseId);
const table = 'Table 1';

// Fetch data from Airtable and concatenate records
let allRecords = [];

base(table).select({}).eachPage((records, fetchNextPage) => {
    allRecords = allRecords.concat(records);
    fetchNextPage();
}, (err) => {
    if (err) {
        console.error(err);
        return;
    }
});