const express = require('express');
const auth = require('../middleware/auth');
const db = require('../db/database');

const router = express.Router();

// GET /api/settings — public
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/settings — protected
router.put('/', auth, (req, res) => {
  try {
    const updates = req.body;

    if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Request body must be a non-empty object of key-value pairs.' });
    }

    const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    const upsertMany = db.transaction((obj) => {
      for (const [key, value] of Object.entries(obj)) {
        upsert.run(key, String(value));
      }
    });
    upsertMany(updates);

    // Return the full settings object
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
