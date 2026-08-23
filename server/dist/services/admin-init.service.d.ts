/**
 * Synchronizes and enforces administrator security rules:
 * 1. Ensures ONLY the configured ADMIN_EMAIL has role: 'admin'.
 * 2. Demotes any other account with role: 'admin' back to role: 'user'.
 * 3. Promotes the existing account matching ADMIN_EMAIL to role: 'admin' if it exists.
 */
export declare const syncAdminSecurity: () => Promise<void>;
