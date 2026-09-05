const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/capstone';

async function fixUsersAndIndexes() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for index fix...');

    const usersCol = mongoose.connection.db.collection('users');
    const allUsers = await usersCol.find({}).toArray();

    console.log(`Found ${allUsers.length} total users in DB.`);

    for (const u of allUsers) {
      const updates = {};
      if (!u.username) {
        if (u.email) {
          updates.username = u.email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') + '_' + Math.floor(100 + Math.random() * 900);
        } else if (u.name) {
          updates.username = u.name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.floor(100 + Math.random() * 900);
        } else {
          updates.username = 'user_' + Math.floor(1000 + Math.random() * 9000);
        }
      }
      if (u.role === 'citizen') {
        updates.role = 'user';
      }
      if (u.email === null) {
        // unset null email so sparse index works
        await usersCol.updateOne({ _id: u._id }, { $unset: { email: "" } });
      }
      if (u.googleId === null) {
        await usersCol.updateOne({ _id: u._id }, { $unset: { googleId: "" } });
      }

      if (Object.keys(updates).length > 0) {
        await usersCol.updateOne({ _id: u._id }, { $set: updates });
        console.log(`Updated user ${u._id}:`, updates);
      }
    }

    // Drop indexes except _id_
    try {
      await usersCol.dropIndexes();
      console.log('Dropped all old indexes from users collection.');
    } catch (e) {
      console.log('Note on dropping indexes:', e.message);
    }

    // Re-sync Mongoose indexes
    await User.syncIndexes();
    console.log('✅ Recreated proper Mongoose indexes on User collection.');

    const newIndexes = await usersCol.indexes();
    console.log('Current indexes:', JSON.stringify(newIndexes, null, 2));

    console.log('✅ Fix completed successfully!');
  } catch (err) {
    console.error('❌ Error fixing users & indexes:', err);
  } finally {
    await mongoose.disconnect();
  }
}

fixUsersAndIndexes();
