const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const db = require('../db/database');

const router = express.Router();

// GET /api/categories — public
router.get('/', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM products p WHERE p.category = c.name) AS product_count
      FROM categories c
      ORDER BY c.name ASC
    `).all();

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/categories — protected
router.post(
  '/',
  auth,
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
      }

      const { name, description = '' } = req.body;

      const existing = db.prepare('SELECT id FROM categories WHERE name = ?').get(name);
      if (existing) {
        return res.status(409).json({ error: 'Category already exists.' });
      }

      const result = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)').run(name, description);
      const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

      res.status(201).json(category);
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// PUT /api/categories/:id — protected
router.put('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    const updatedName = name !== undefined ? name : category.name;
    const updatedDescription = description !== undefined ? description : category.description;

    // If renaming, also update products that reference the old category name
    if (name && name !== category.name) {
      db.prepare('UPDATE products SET category = ? WHERE category = ?').run(name, category.name);
    }

    db.prepare('UPDATE categories SET name = ?, description = ? WHERE id = ?').run(updatedName, updatedDescription, id);
    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    res.json(updated);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/categories/:id — protected
router.delete('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
