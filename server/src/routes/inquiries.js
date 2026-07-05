const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const db = require('../db/database');

const router = express.Router();

// POST /api/inquiries — public
router.post(
  '/',
  [
    body('customer_name').trim().notEmpty().withMessage('Customer name is required'),
    body('phone').optional().trim(),
    body('email').optional().trim(),
    body('product_interest').optional().trim(),
    body('message').optional().trim(),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { customer_name, phone = '', email = '', product_interest = '', message = '' } = req.body;

      const result = db.prepare(`
        INSERT INTO inquiries (customer_name, phone, email, product_interest, message)
        VALUES (?, ?, ?, ?, ?)
      `).run(customer_name, phone, email, product_interest, message);

      const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(result.lastInsertRowid);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error('Create inquiry error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// GET /api/inquiries — protected
router.get('/', auth, (req, res) => {
  try {
    const { search, status } = req.query;
    let sql = 'SELECT * FROM inquiries WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (customer_name LIKE ? OR phone LIKE ? OR email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    sql += ' ORDER BY created_at DESC';

    const inquiries = db.prepare(sql).all(...params);
    res.json(inquiries);
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/inquiries/:id — protected
router.put('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['new', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({ error: "Status must be one of: 'new', 'contacted', 'closed'." });
    }

    const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id);

    res.json(updated);
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/inquiries/:id — protected
router.delete('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found.' });
    }

    db.prepare('DELETE FROM inquiries WHERE id = ?').run(id);
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
