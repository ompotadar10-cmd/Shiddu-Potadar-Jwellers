const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const db = require('../db/database');

const router = express.Router();

// ── Multer Configuration ────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ── Helper: get product with images ─────────────────────────────
function getProductWithImages(productId) {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId);
  if (!product) return null;
  const images = db.prepare('SELECT * FROM product_images WHERE product_id = ?').all(productId);
  return { ...product, images };
}

// ── GET /api/products ───────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const {
      category,
      search,
      sort = 'newest',
      featured,
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    let whereClauses = [];
    let params = [];

    if (category) {
      whereClauses.push('p.category = ?');
      params.push(category);
    }

    if (search) {
      whereClauses.push('(p.name LIKE ? OR p.description LIKE ?)');
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    if (featured === 'true') {
      whereClauses.push('p.featured = 1');
    }

    const whereSQL = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    let orderSQL;
    switch (sort) {
      case 'oldest':
        orderSQL = 'ORDER BY p.created_at ASC';
        break;
      case 'name':
        orderSQL = 'ORDER BY p.name ASC';
        break;
      case 'newest':
      default:
        orderSQL = 'ORDER BY p.created_at DESC';
        break;
    }

    // Count total
    const countSQL = `SELECT COUNT(*) AS total FROM products p ${whereSQL}`;
    const { total } = db.prepare(countSQL).get(...params);

    // Fetch products
    const productsSQL = `SELECT p.* FROM products p ${whereSQL} ${orderSQL} LIMIT ? OFFSET ?`;
    const products = db.prepare(productsSQL).all(...params, limitNum, offset);

    // Attach images to each product
    const getImages = db.prepare('SELECT * FROM product_images WHERE product_id = ?');
    const productsWithImages = products.map((product) => ({
      ...product,
      images: getImages.all(product.id),
    }));

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      products: productsWithImages,
      total,
      page: pageNum,
      totalPages,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── GET /api/products/:id ───────────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const product = getProductWithImages(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── POST /api/products — protected, multipart ──────────────────
router.post('/', auth, upload.array('images', 10), (req, res) => {
  try {
    const { name, category, description = '', weight = '', purity = '', price, show_price = 0, show_purity = 1, availability = 'in_stock', featured = 0 } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required.' });
    }

    const priceVal = price !== undefined && price !== '' && price !== null ? parseFloat(price) : null;
    const showPriceVal = parseInt(show_price, 10) || 0;
    const showPurityVal = show_purity !== undefined ? parseInt(show_purity, 10) : 1;
    const featuredVal = parseInt(featured, 10) || 0;

    const result = db.prepare(`
      INSERT INTO products (name, category, description, weight, purity, price, show_price, show_purity, availability, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, category, description, weight, purity, priceVal, showPriceVal, showPurityVal, availability, featuredVal);

    const productId = result.lastInsertRowid;

    // Insert images
    if (req.files && req.files.length > 0) {
      const insertImage = db.prepare('INSERT INTO product_images (product_id, image_url) VALUES (?, ?)');
      const insertImages = db.transaction((files) => {
        for (const file of files) {
          insertImage.run(productId, `/uploads/${file.filename}`);
        }
      });
      insertImages(req.files);
    }

    const product = getProductWithImages(productId);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── PUT /api/products/:id — protected, multipart ───────────────
router.put('/:id', auth, upload.array('images', 10), (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const {
      name,
      category,
      description,
      weight,
      purity,
      price,
      show_price,
      show_purity,
      availability,
      featured,
    } = req.body;

    const updatedName = name !== undefined ? name : existing.name;
    const updatedCategory = category !== undefined ? category : existing.category;
    const updatedDescription = description !== undefined ? description : existing.description;
    const updatedWeight = weight !== undefined ? weight : existing.weight;
    const updatedPurity = purity !== undefined ? purity : existing.purity;
    const updatedPrice = price !== undefined ? (price !== '' && price !== null ? parseFloat(price) : null) : existing.price;
    const updatedShowPrice = show_price !== undefined ? parseInt(show_price, 10) || 0 : existing.show_price;
    const updatedShowPurity = show_purity !== undefined ? parseInt(show_purity, 10) || 0 : existing.show_purity;
    const updatedAvailability = availability !== undefined ? availability : existing.availability;
    const updatedFeatured = featured !== undefined ? parseInt(featured, 10) || 0 : existing.featured;

    db.prepare(`
      UPDATE products
      SET name = ?, category = ?, description = ?, weight = ?, purity = ?, price = ?, show_price = ?, show_purity = ?, availability = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(updatedName, updatedCategory, updatedDescription, updatedWeight, updatedPurity, updatedPrice, updatedShowPrice, updatedShowPurity, updatedAvailability, updatedFeatured, id);

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const insertImage = db.prepare('INSERT INTO product_images (product_id, image_url) VALUES (?, ?)');
      const insertImages = db.transaction((files) => {
        for (const file of files) {
          insertImage.run(id, `/uploads/${file.filename}`);
        }
      });
      insertImages(req.files);
    }

    const product = getProductWithImages(id);
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── DELETE /api/products/:id — protected ────────────────────────
router.delete('/:id', auth, (req, res) => {
  try {
    const { id } = req.params;

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Delete image files from filesystem
    const images = db.prepare('SELECT * FROM product_images WHERE product_id = ?').all(id);
    for (const img of images) {
      const filePath = path.join(__dirname, '../../', img.image_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete product (cascade deletes image records)
    db.prepare('DELETE FROM products WHERE id = ?').run(id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── DELETE /api/products/:id/images/:imageId — protected ────────
router.delete('/:id/images/:imageId', auth, (req, res) => {
  try {
    const { id, imageId } = req.params;

    const image = db.prepare('SELECT * FROM product_images WHERE id = ? AND product_id = ?').get(imageId, id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found.' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../', image.image_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete record
    db.prepare('DELETE FROM product_images WHERE id = ?').run(imageId);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ── GET /api/stats — protected ─────────────────────────────────
router.get('/stats/overview', auth, (req, res) => {
  try {
    const totalProducts = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
    const totalCategories = db.prepare('SELECT COUNT(*) AS count FROM categories').get().count;
    const totalInquiries = db.prepare('SELECT COUNT(*) AS count FROM inquiries').get().count;
    const newInquiries = db.prepare("SELECT COUNT(*) AS count FROM inquiries WHERE status = 'new'").get().count;
    const featuredProducts = db.prepare('SELECT COUNT(*) AS count FROM products WHERE featured = 1').get().count;

    const recentProducts = db.prepare('SELECT * FROM products ORDER BY created_at DESC LIMIT 5').all();
    const getImages = db.prepare('SELECT * FROM product_images WHERE product_id = ?');
    const recentWithImages = recentProducts.map((p) => ({
      ...p,
      images: getImages.all(p.id),
    }));

    res.json({
      totalProducts,
      totalCategories,
      totalInquiries,
      newInquiries,
      featuredProducts,
      recentProducts: recentWithImages,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
