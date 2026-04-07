const bcrypt = require('bcryptjs');

// Pre-hashed passwords using bcryptjs (salt rounds = 10)
// cashier123, manager123, admin123
const users = [
  {
    id: '1',
    name: 'Cashier User',
    email: 'cashier@pos.com',
    // bcrypt hash of 'cashier123'
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'Cashier',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cashier',
    createdAt: '2024-02-15T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@pos.com',
    // bcrypt hash of 'manager123'
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'Manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manager',
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@pos.com',
    // bcrypt hash of 'admin123'
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

/**
 * Seed correct bcrypt hashes on startup so plain passwords work correctly.
 * Using sync here intentionally — runs once at boot, not in a request.
 */
const SALT_ROUNDS = 10;
const plainPasswords = {
  'cashier@pos.com': 'cashier123',
  'manager@pos.com': 'manager123',
  'admin@pos.com':   'admin123',
};

// Re-hash with the actual passwords at runtime so they are always correct
users.forEach((user) => {
  user.passwordHash = bcrypt.hashSync(plainPasswords[user.email], SALT_ROUNDS);
});

module.exports = { users };
