# Sync Users to Authentication Script

## Purpose

This script creates Firebase Authentication accounts for users that exist in Firestore but don't have corresponding auth accounts yet.

## When to Use

- After running `populate-test-data.js` (which only creates Firestore users)
- When you need to enable login for test customer accounts
- After manually adding users to Firestore

## Usage

```bash
cd scripts
node sync-users-to-auth.js
```

## What It Does

1. Reads all users from the `users` Firestore collection
2. Checks if each user has a Firebase Authentication account
3. Creates auth accounts for users that don't have one
4. Uses the Firestore document ID as the auth UID (keeps them in sync)
5. Sets a default password: `test123`

## Output

The script will display:
- ✅ Created accounts
- ✓ Already existing accounts
- ❌ Any errors encountered
- Summary statistics

## Default Credentials

All test users will have the password: **test123**

## Test User Emails

After running this script, you can login with:
- aal35v@outlook.com
- aal30v@outlook.com
- martines.aquiles.64@outlook.com
- juan.mckclain@hotmail.com
- gian.varela.5533@gmail.com
- aal20v@fsu.edu

All with password: `test123`

## Important Notes

- ⚠️ This is for **test/development purposes only**
- ⚠️ All users get the same simple password
- ⚠️ In production, users should set their own passwords
- ✅ UIDs are matched between Firestore and Auth for consistency

## Troubleshooting

**Error: "Service account not found"**
- Make sure the Firebase service account JSON file exists in the Development folder

**Error: "auth/uid-already-exists"**
- The script will attempt to update the existing auth account

**Error: "auth/email-already-exists"**
- Another auth account with that email exists - manual intervention needed
