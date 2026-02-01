const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'teravolta-41afd.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Test user emails
const testUsers = [
    { email: 'aal35v@outlook.com', name: 'Alberto Alvarado', phone: '+507 6123-4567' },
    { email: 'aal30v@outlook.com', name: 'Ana López', phone: '+507 6234-5678' },
    { email: 'martines.aquiles.64@outlook.com', name: 'Aquiles Martínez', phone: '+507 6345-6789' },
    { email: 'juan.mckclain@hotmail.com', name: 'Juan McClain', phone: '+507 6456-7890' },
    { email: 'gian.varela.5533@gmail.com', name: 'Gian Varela', phone: '+507 6567-8901' },
    { email: 'aal20v@fsu.edu', name: 'Alejandro Alvarado', phone: '+507 6678-9012' }
];

// Services array
const services = ['Consulting', 'Energy Efficiency', 'Advocacy'];

// Test files directory (one level up from Development folder)
const testFilesDir = path.join(__dirname, '..', '..', 'user test files');

// Helper function to upload file to Firebase Storage
async function uploadFile(filePath, userId, docType) {
    const fileName = path.basename(filePath);
    const destination = `test-data/${userId}/${docType}/${fileName}`;

    await bucket.upload(filePath, {
        destination: destination,
        metadata: {
            contentType: getContentType(fileName)
        }
    });

    const file = bucket.file(destination);
    await file.makePublic();

    return `https://storage.googleapis.com/${bucket.name}/${destination}`;
}

function getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes = {
        '.pdf': 'application/pdf',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png'
    };
    return contentTypes[ext] || 'application/octet-stream';
}

// Get random item from array
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Get random date within last 90 days
function getRandomDate(daysBack = 90) {
    const now = new Date();
    const past = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
    return new Date(randomTime);
}

async function populateTestData() {
    console.log('🚀 Starting test data population...\n');

    // Get all test files
    const testFiles = fs.readdirSync(testFilesDir);
    console.log(`📁 Found ${testFiles.length} test files\n`);

    for (let i = 0; i < testUsers.length; i++) {
        const user = testUsers[i];
        const service = services[i % services.length];

        console.log(`\n👤 Processing user ${i + 1}/${testUsers.length}: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Service: ${service}`);

        try {
            // 1. Create user in 'users' collection
            const userId = user.email.replace(/[@.]/g, '_');
            await db.collection('users').doc(userId).set({
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: 'customer',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('   ✅ User created');

            // 2. Create inquiry
            const inquiryDate = getRandomDate(60);
            const inquiryRef = await db.collection('inquiries').add({
                fullName: user.name,
                email: user.email,
                phone: user.phone,
                service: service,
                message: `Inquiry from ${user.name} about ${service} services.`,
                status: 'completed',
                createdAt: admin.firestore.Timestamp.fromDate(inquiryDate),
                isNew: false
            });
            console.log(`   ✅ Inquiry created (ID: ${inquiryRef.id})`);

            // 3. Create quote
            const quoteDate = new Date(inquiryDate.getTime() + (2 * 24 * 60 * 60 * 1000));
            const amount = Math.floor(Math.random() * 15000) + 5000;
            const quoteRef = await db.collection('quotes').add({
                fullName: user.name,
                email: user.email,
                phone: user.phone,
                service: service,
                status: i % 3 === 0 ? 'approved' : (i % 3 === 1 ? 'paid' : 'pending_review'),
                amount: amount,
                description: `Quote for ${service} project`,
                createdAt: admin.firestore.Timestamp.fromDate(quoteDate),
                documents: []
            });
            console.log(`   ✅ Quote created (ID: ${quoteRef.id}, Amount: $${amount})`);

            // 4. Upload documents to quote
            const filesToUpload = testFiles.slice(0, 2); // Upload 2 files per quote
            for (const fileName of filesToUpload) {
                const filePath = path.join(testFilesDir, fileName);
                const fileUrl = await uploadFile(filePath, userId, 'quotes');

                await db.collection('quotes').doc(quoteRef.id).update({
                    documents: admin.firestore.FieldValue.arrayUnion({
                        name: fileName,
                        url: fileUrl,
                        type: getContentType(fileName),
                        uploadedAt: new Date(),
                        uploadedBy: 'admin@teravolta.com'
                    })
                });
            }
            console.log(`   ✅ ${filesToUpload.length} documents uploaded to quote`);

            // 5. Create active project (only for paid quotes)
            if (i % 3 === 1) {
                const projectDate = new Date(quoteDate.getTime() + (5 * 24 * 60 * 60 * 1000));
                const progress = Math.floor(Math.random() * 80) + 20;
                const projectRef = await db.collection('activeProjects').add({
                    projectName: `${service} Implementation for ${user.name}`,
                    clientId: userId,
                    clientName: user.name,
                    service: service,
                    status: 'active',
                    progress: progress,
                    amount: amount,
                    startDate: admin.firestore.Timestamp.fromDate(projectDate),
                    estimatedEndDate: admin.firestore.Timestamp.fromDate(new Date(projectDate.getTime() + (60 * 24 * 60 * 60 * 1000))),
                    assignedTo: ['admin@teravolta.com'],
                    description: `${service} project for ${user.name}`,
                    timeline: [],  // Initialize timeline array
                    createdAt: admin.firestore.Timestamp.fromDate(projectDate)
                });
                console.log(`   ✅ Active project created (ID: ${projectRef.id}, Progress: ${progress}%)`);

                // Add project updates
                const updatesCount = Math.floor(Math.random() * 3) + 2;
                for (let j = 0; j < updatesCount; j++) {
                    const updateDate = new Date(projectDate.getTime() + (j * 7 * 24 * 60 * 60 * 1000));
                    await db.collection('activeProjects').doc(projectRef.id).collection('updates').add({
                        note: `Progress update #${j + 1}: Work is progressing well. ${progress + (j * 10)}% completed.`,
                        createdBy: 'admin@teravolta.com',
                        createdAt: admin.firestore.Timestamp.fromDate(updateDate)
                    });
                }
                console.log(`   ✅ ${updatesCount} project updates added`);
            }

            // 6. Create completed portfolio project (one user)
            if (i === 2) {
                await db.collection('portfolioProjects').add({
                    title: `${service} Success Story - ${user.name}`,
                    service: service,
                    client: user.name,
                    description: 'A comprehensive energy solution implementation.',
                    challenge: 'High energy costs and inefficient systems.',
                    solution: 'Implemented solar panels and smart energy management.',
                    result: '45% reduction in energy costs and improved sustainability.',
                    images: [],
                    featured: true,
                    published: true,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    completedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log('   ✅ Portfolio project created (FEATURED)');
            }

        } catch (error) {
            console.error(`   ❌ Error for ${user.name}:`, error.message);
        }
    }

    console.log('\n\n✨ Test data population completed!\n');
    console.log('Summary:');
    console.log(`- ${testUsers.length} users created`);
    console.log(`- ${testUsers.length} inquiries created`);
    console.log(`- ${testUsers.length} quotes created`);
    console.log(`- ~${Math.floor(testUsers.length / 3) * 2} active projects created`);
    console.log(`- 1 portfolio project created`);
    console.log(`- ${testUsers.length * 2} documents uploaded`);
}

// Run the script
populateTestData()
    .then(() => {
        console.log('\n✅ Script completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
