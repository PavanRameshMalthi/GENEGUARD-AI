import { User } from '../models/User.js';
import { ENV } from '../config/env.js';

/**
 * Synchronizes and enforces administrator security rules:
 * 1. Ensures ONLY the configured ADMIN_EMAIL has role: 'admin'.
 * 2. Demotes any other account with role: 'admin' back to role: 'user'.
 * 3. Promotes the existing account matching ADMIN_EMAIL to role: 'admin' if it exists.
 */
export const syncAdminSecurity = async (): Promise<void> => {
  try {
    const adminEmail = ENV.ADMIN_EMAIL.toLowerCase().trim();

    // 1. Demote any rogue or unauthorized accounts that hold 'admin' role
    const demoteResult = await User.updateMany(
      { role: 'admin', email: { $ne: adminEmail } },
      { $set: { role: 'user' } }
    );

    if (demoteResult.modifiedCount > 0) {
      console.log(`🔒 [Security Audit] Demoted ${demoteResult.modifiedCount} unauthorized account(s) to 'user'.`);
    }

    // 2. Ensure existing account matching ADMIN_EMAIL is assigned 'admin' role
    const adminUser = await User.findOne({ email: adminEmail });
    if (adminUser) {
      if (adminUser.role !== 'admin') {
        adminUser.role = 'admin';
        await adminUser.save();
        console.log(`👑 [Security Audit] Enforced 'admin' role for designated administrator: ${adminEmail}`);
      } else {
        console.log(`👑 [Security Audit] Confirmed designated administrator: ${adminEmail}`);
      }
    } else {
      console.log(`ℹ️ [Security Audit] Designated administrator (${adminEmail}) has not yet registered. Role 'admin' will be assigned upon registration.`);
    }
  } catch (error: any) {
    console.error(`❌ [Security Audit] Admin synchronization failed: ${error.message}`);
  }
};
