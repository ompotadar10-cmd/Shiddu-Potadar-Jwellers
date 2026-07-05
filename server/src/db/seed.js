const bcrypt = require('bcryptjs');
const db = require('./database');

function seed() {
  console.log('🌱 Seeding database...\n');

  // ── 1. Admin User ──────────────────────────────────────────────
  const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  if (!existingUser) {
    const passwordHash = bcrypt.hashSync('Admin@123', 10);
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', passwordHash, 'admin');
    console.log('✅ Admin user created (admin / Admin@123)');
  } else {
    console.log('⏭️  Admin user already exists, skipping.');
  }

  // ── 2. Categories ─────────────────────────────────────────────
  const categories = [
    { name: 'Gold Chains', description: 'Elegant gold chains crafted for everyday sophistication and timeless style.' },
    { name: 'Gold Rings', description: 'Stunning gold rings perfect for engagements, weddings, and special occasions.' },
    { name: 'Gold Necklaces', description: 'Exquisite gold necklaces featuring traditional and contemporary designs.' },
    { name: 'Gold Bangles', description: 'Beautiful gold bangles that celebrate the rich traditions of Indian craftsmanship.' },
    { name: 'Gold Earrings', description: 'Graceful gold earrings ranging from classic studs to ornate jhumkas.' },
    { name: 'Bridal Jewelry', description: 'Magnificent bridal jewelry sets designed to make every bride shine on her special day.' },
    { name: 'Silver Jewelry', description: 'Premium silver jewelry combining modern aesthetics with traditional artistry.' },
    { name: 'New Arrivals', description: 'Our latest jewelry additions featuring fresh designs and trending styles.' },
  ];

  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)');
  const insertCategoryMany = db.transaction((items) => {
    for (const item of items) {
      insertCategory.run(item.name, item.description);
    }
  });
  insertCategoryMany(categories);
  console.log('✅ 8 categories seeded');

  // ── 3. Products ───────────────────────────────────────────────
  const products = [
    {
      name: 'Classic Gold Chain',
      category: 'Gold Chains',
      description: 'A timeless 22K gold chain with interlocking links, designed for daily wear and special occasions alike. Its smooth finish and balanced weight make it a versatile addition to any jewelry collection. Handcrafted by skilled artisans in the finest Indian goldsmithing tradition.',
      weight: '25g',
      purity: '22K',
      featured: 1,
    },
    {
      name: "Men's Gold Chain",
      category: 'Gold Chains',
      description: 'A bold and masculine 22K gold chain with a robust link pattern, perfect for the modern gentleman. This chain combines traditional craftsmanship with contemporary design sensibilities. Ideal for both formal events and everyday sophistication.',
      weight: '30g',
      purity: '22K',
      featured: 0,
    },
    {
      name: 'Gold Engagement Ring',
      category: 'Gold Rings',
      description: 'An exquisite 22K gold engagement ring featuring intricate filigree work and a polished band. Symbolizing eternal love and commitment, this ring is crafted to perfection. A beautiful blend of Indian tradition and modern elegance.',
      weight: '8g',
      purity: '22K',
      featured: 1,
    },
    {
      name: 'Gold Statement Ring',
      category: 'Gold Rings',
      description: 'A striking 22K gold statement ring with an elaborate design inspired by temple architecture. Perfect for festivals, weddings, and grand celebrations. This masterpiece showcases the pinnacle of Indian jewelry artistry.',
      weight: '12g',
      purity: '22K',
      featured: 0,
    },
    {
      name: 'Temple Gold Necklace',
      category: 'Gold Necklaces',
      description: 'A magnificent 22K gold temple necklace adorned with traditional motifs of deities and sacred symbols. This statement piece is a testament to centuries-old South Indian goldsmithing heritage. Perfect for weddings, pujas, and auspicious occasions.',
      weight: '45g',
      purity: '22K',
      featured: 1,
    },
    {
      name: 'Gold Choker Necklace',
      category: 'Gold Necklaces',
      description: 'A stunning 22K gold choker necklace with a contemporary design that sits elegantly on the neckline. Featuring delicate floral patterns and a lustrous finish, it complements both traditional sarees and modern outfits. A true symbol of refined taste.',
      weight: '35g',
      purity: '22K',
      featured: 0,
    },
    {
      name: 'Traditional Gold Bangles Set',
      category: 'Gold Bangles',
      description: 'A set of exquisite 22K gold bangles featuring traditional Indian designs with fine engraving and beadwork. Each bangle is meticulously crafted to create a harmonious set perfect for weddings and festivals. The rich texture and warm glow make them a cherished heirloom.',
      weight: '30g (per bangle)',
      purity: '22K',
      featured: 1,
    },
    {
      name: 'Gold Kada Bangle',
      category: 'Gold Bangles',
      description: 'A robust 22K gold kada bangle with a broad design featuring geometric patterns and polished edges. This substantial piece exudes strength and elegance, ideal for both men and women. A timeless accessory rooted in Indian jewelry tradition.',
      weight: '40g',
      purity: '22K',
      featured: 0,
    },
    {
      name: 'Gold Jhumka Earrings',
      category: 'Gold Earrings',
      description: 'Graceful 22K gold jhumka earrings with intricate bell-shaped drops and delicate gold bead accents. These iconic Indian earrings sway beautifully with movement, adding charm to any outfit. Perfect for traditional celebrations and festive occasions.',
      weight: '12g',
      purity: '22K',
      featured: 1,
    },
    {
      name: 'Gold Stud Earrings',
      category: 'Gold Earrings',
      description: 'Elegant 22K gold stud earrings featuring a classic dome design with a high-polish finish. These versatile studs are perfect for everyday wear, offering understated luxury and comfort. A timeless choice that complements both Indian and Western attire.',
      weight: '4g',
      purity: '22K',
      featured: 0,
    },
    {
      name: 'Bridal Necklace Set',
      category: 'Bridal Jewelry',
      description: 'A breathtaking 22K gold bridal necklace set with layers of ornate pendant work, traditional kundan settings, and matching earrings. Designed to make every bride the center of attention on her special day. This heirloom-quality set represents the finest in Indian bridal jewelry.',
      weight: '80g',
      purity: '22K',
      featured: 1,
    },
    {
      name: 'Bridal Gold Bangles Set',
      category: 'Bridal Jewelry',
      description: 'A lavish set of 22K gold bridal bangles featuring intricate meenakari work and traditional motifs. This comprehensive set is designed to adorn the bride with unmatched splendor and grace. Each bangle is a work of art, carrying forward generations of craftsmanship.',
      weight: '100g',
      purity: '22K',
      featured: 0,
    },
    {
      name: 'Silver Anklet Payal',
      category: 'Silver Jewelry',
      description: 'A beautiful pair of 925 sterling silver anklets featuring traditional ghungroo charms that create a melodious sound with every step. These payals combine authentic Indian design with premium silver craftsmanship. Perfect for weddings, festivals, and daily wear.',
      weight: '50g',
      purity: '925 Silver',
      featured: 1,
    },
    {
      name: 'Silver Toe Ring Set',
      category: 'Silver Jewelry',
      description: 'A charming set of 925 sterling silver toe rings with intricate patterns inspired by traditional Indian motifs. These adjustable rings offer comfort and elegance for everyday wear. A beautiful symbol of married bliss in Indian culture.',
      weight: '10g',
      purity: '925 Silver',
      featured: 0,
    },
    {
      name: 'Gold Mangalsutra',
      category: 'New Arrivals',
      description: 'A sacred 22K gold mangalsutra featuring a stunning pendant with black bead chain, symbolizing the eternal bond of marriage. This contemporary design honors tradition while embracing modern aesthetics. Lightweight and comfortable for everyday wear.',
      weight: '15g',
      purity: '22K',
      featured: 1,
    },
    {
      name: 'Gold Pendant Chain',
      category: 'New Arrivals',
      description: 'An elegant 22K gold pendant chain with a beautifully crafted floral pendant that catches the light with every movement. This versatile piece transitions seamlessly from daytime elegance to evening glamour. A perfect gift for someone special.',
      weight: '10g',
      purity: '22K',
      featured: 0,
    },
  ];

  const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products (name, category, description, weight, purity, price, show_price, availability, featured)
    VALUES (?, ?, ?, ?, ?, NULL, 0, 'in_stock', ?)
  `);
  const insertProductMany = db.transaction((items) => {
    for (const item of items) {
      insertProduct.run(item.name, item.category, item.description, item.weight, item.purity, item.featured);
    }
  });
  insertProductMany(products);
  console.log('✅ 16 products seeded');

  // ── 4. Settings ───────────────────────────────────────────────
  const settings = {
    shop_name: 'Siddu Potadar',
    tagline: 'Exquisite Gold & Silver Jewelry Since Generations',
    phone: '+91 89710 12999',
    email: 'info@siddupotadar.com',
    address: 'Belgaum Rd, Gajabarwadi, Hukkeri, Karnataka 591309, India',
    google_maps_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3831.0!2d74.6!3d16.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDEyJzAwLjAiTiA3NMKwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1',
    whatsapp_number: '918971012999',
    business_hours: 'Monday to Saturday, 10:00 AM - 8:00 PM',
    about_text: `Siddu Potadar is a name synonymous with trust, purity, and exquisite craftsmanship in the world of gold and silver jewelry. Established generations ago in the heart of Hukkeri, Karnataka, our family-run jewelry house has been adorning families across the region with handcrafted masterpieces that celebrate India's rich heritage of ornamental art.

Every piece at Siddu Potadar is a labor of love, meticulously designed and crafted by skilled artisans who have inherited centuries-old techniques passed down through generations. From intricate temple jewelry and bridal sets to everyday gold chains and modern designs, our collection spans the full spectrum of Indian jewelry artistry, ensuring there is something for every occasion and every taste.

Our commitment to quality is unwavering — we use only the finest 22-karat gold and 925 sterling silver, with every item hallmarked and certified for purity. At Siddu Potadar, we believe that jewelry is more than adornment; it is an expression of love, tradition, and personal style. We invite you to experience the Siddu Potadar difference and discover jewelry that will be treasured for generations to come.`,
    hero_title: 'Timeless Elegance in Gold',
    hero_subtitle: 'Discover handcrafted gold and silver jewelry that celebrates tradition and modern design.',
    facebook_url: '',
    instagram_url: '',
    youtube_url: '',
  };

  const upsertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  const upsertSettingMany = db.transaction((obj) => {
    for (const [key, value] of Object.entries(obj)) {
      upsertSetting.run(key, value);
    }
  });
  upsertSettingMany(settings);
  console.log('✅ Settings seeded');

  console.log('\n🎉 Database seeded successfully!');
}

seed();
