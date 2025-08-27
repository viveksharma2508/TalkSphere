// scripts/check-db.js
require('dotenv').config();
const connect = require('./db');

(async () => {
  try {
    const c = await connect(process.env.MONGODB_URL);
    console.log('[OK] Connected to', c.db?.databaseName || c.name);
    process.exit(0);
  } catch (e) {
    console.error('[FAIL]', e.message);
    process.exit(1);
  }
})();
