/**
 * Sync Firestore Users to Firebase Authentication
 * 
 * This script creates Firebase Authentication accounts for users that exist
 * in Firestore but don't have auth accounts yet.
 * 
 * Usage: node sync-users-to-auth.js
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Find the service account JSON file (looking for any file that looks like a service account)
const devDir = path.join(__dirname, '..');
const files = fs.readdirSync(devDir);

// Look for service account file - common patterns
const serviceAccountFile = files.find(f =>
    f.includes('firebase-adminsdk') ||
    f.includes('teravolta-41afd') ||
    (f.length === 36 && !f.includes('.')) // UUID format without extension
);

if (!serviceAccountFile) {
    console.error('\n❌ Firebase service account file not found!');
    console.error('Please download it from Firebase Console and place it in the Development folder.\n');
    process.exit(1);
}

const serviceAccountPath = path.join(devDir, serviceAccountFile);
console.log(`📄 Using service account: ${serviceAccountFile}\n`);

// Read and parse JSON file (handles files without .json extension)
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'teravolta-41afd.firebasestorage.app'
});

const db = admin.firestore();
const auth = admin.auth();

async function syncUsersToAuth() {
    console.log('\n🔄 Starting user sync to Firebase Authentication...\n');

    try {
        // Get all users from Firestore
        const usersSnapshot = await db.collection('users').get();
        console.log(`Found ${usersSnapshot.size} users in Firestore\n`);

        let created = 0;
        let alreadyExists = 0;
        let errors = 0;

        for (const userDoc of usersSnapshot.docs) {
            const user = userDoc.data();
            const userId = userDoc.id;
            const email = user.email;
            const displayName = user.name || user.displayName || '';

            if (!email) {
                console.log(`⚠️  Skipping user ${userId} - no email address`);
                continue;
            }

            try {
                // Check if auth user already exists
                try {
                    await auth.getUserByEmail(email);
                    console.log(`✓ ${email} - Auth account already exists`);
                    alreadyExists++;
                    continue;
                } catch (error) {
                    if (error.code !== 'auth/user-not-found') {
                        throw error;
                    }
                }

                // Create auth user with default password
                const authUser = await auth.createUser({
                    uid: userId,
                    email: email,
                    emailVerified: false,
                    password: 'test123', // Default password for test users
                    displayName: displayName,
                    disabled: false
                });

                console.log(`✅ Created auth account for: ${email} (${displayName})`);
                console.log(`   Password: test123`);
                created++;

            } catch (error) {
                if (error.code === 'auth/uid-already-exists') {
                    // UID exists but with different email - update it
                    try {
                        await auth.updateUser(userId, {
                            email: email,
                            displayName: displayName
                        });
                        console.log(`✅ Updated auth account for: ${email}`);
                        created++;
                    } catch (updateError) {
                        console.error(`❌ Error updating ${email}:`, updateError.message);
                        errors++;
                    }
                } else {
                    console.error(`❌ Error creating auth for ${email}:`, error.message);
                    errors++;
                }
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('✨ Sync Complete!\n');
        console.log(`Summary:`);
        console.log(`  - Created: ${created} auth accounts`);
        console.log(`  - Already existed: ${alreadyExists} accounts`);
        console.log(`  - Errors: ${errors}`);
        console.log(`  - Total users: ${usersSnapshot.size}`);
        console.log('\n📝 Default password for all test users: test123');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    }
}

// Run the script
syncUsersToAuth()
    .then(() => {
        console.log('✅ Script completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
