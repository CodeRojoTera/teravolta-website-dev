const https = require('http');

const data = JSON.stringify({
    to: 'aal35v@outlook.com',
    fullName: 'Test User',
    projectName: 'Test Project Verification',
    invoiceUrl: 'https://example.com/invoice.pdf',
    projectId: 'test_project_123',
    language: 'es'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/send-invoice',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
