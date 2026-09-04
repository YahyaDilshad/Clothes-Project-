/**
 * Run with: npm run seed
 * Creates a default Admin account (if none exists) and seeds the
 * Permission collection with the default role permission sets.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Permission = require('../models/Permission');
const { DEFAULT_PERMISSIONS } = require('../config/roles');

const run = async () => {
  await connectDB();

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

  const existingAdmin = await User.findOne({ role: 'Admin' });
  if (!existingAdmin) {
    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'Admin',
    });
    console.log(`Admin user created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log('An Admin user already exists, skipping admin creation.');
  }

  for (const roleName of Object.keys(DEFAULT_PERMISSIONS)) {
    await Permission.findOneAndUpdate(
      { roleName },
      { roleName, permissions: DEFAULT_PERMISSIONS[roleName] },
      { upsert: true }
    );
  }
  console.log('Default role permissions seeded.');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
