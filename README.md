# Siddu Potadar — Premium Gold & Silver Jewelry Store

A full-stack e-commerce website for **Siddu Potadar**, a trusted gold and silver jewelry shop in Hukkeri, Karnataka, India.

![Gold Jewelry](https://img.shields.io/badge/Industry-Gold%20%26%20Silver%20Jewelry-D4AF37?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite)

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, TypeScript, Tailwind CSS  |
| Animations | Framer Motion                       |
| Backend    | Node.js, Express.js                 |
| Database   | SQLite (better-sqlite3)             |
| Auth       | JWT + bcrypt                        |
| Uploads    | Multer (local filesystem)           |

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Seed the database with sample data
npm run seed

# Install frontend dependencies
cd ../client
npm install
```

### 2. Run Development Servers

Open **two terminals**:

**Terminal 1 — Backend (port 3000):**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend (port 5173):**
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Admin Panel

Navigate to [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

**Default Admin Credentials:**
- Username: `admin`
- Password: `Admin@123`

## Project Structure

```
shop/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin panel pages
│   │   │   └── ...          # Public pages
│   │   ├── context/         # React contexts (Auth, Notifications)
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript interfaces
│   │   ├── layouts/         # Layout wrappers
│   │   └── hooks/           # Custom hooks
│   └── ...
├── server/                  # Express Backend
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Auth, error handling
│   │   └── db/              # Database setup & seed
│   ├── uploads/             # Product image storage
│   └── data/                # SQLite database file
└── README.md
```

## Features

### Public Website
- 🏠 **Home** — Luxury hero banner, featured products, trust section
- 🛍️ **Products** — Filterable product grid with categories and search
- 📦 **Product Detail** — Image gallery, specs, WhatsApp inquiry
- 📖 **About** — Shop history and quality commitment
- 📞 **Contact** — Contact form, Google Maps, business info
- 🖼️ **Gallery** — Jewelry showcase with lightbox
- ✉️ **Inquiry** — Customer inquiry form

### Admin Panel
- 📊 **Dashboard** — Stats overview and quick actions
- 📦 **Products** — Full CRUD with multi-image upload
- 📁 **Categories** — Category management
- 📬 **Inquiries** — Customer inquiry management with status tracking
- ⚙️ **Settings** — Shop info, contact, social links, hero content

### Extras
- 💬 WhatsApp floating button
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔒 JWT authentication
- 🎨 Premium gold luxury design
- ⚡ Fast loading with Vite
- 🔍 SEO optimized

## API Endpoints

| Method | Endpoint                          | Auth | Description              |
|--------|-----------------------------------|------|--------------------------|
| POST   | `/api/auth/login`                 | No   | Admin login              |
| GET    | `/api/auth/verify`                | Yes  | Verify JWT token         |
| GET    | `/api/products`                   | No   | List products            |
| GET    | `/api/products/:id`               | No   | Get product detail       |
| POST   | `/api/products`                   | Yes  | Create product           |
| PUT    | `/api/products/:id`               | Yes  | Update product           |
| DELETE | `/api/products/:id`               | Yes  | Delete product           |
| DELETE | `/api/products/:id/images/:imgId` | Yes  | Delete product image     |
| GET    | `/api/categories`                 | No   | List categories          |
| POST   | `/api/categories`                 | Yes  | Create category          |
| PUT    | `/api/categories/:id`             | Yes  | Update category          |
| DELETE | `/api/categories/:id`             | Yes  | Delete category          |
| POST   | `/api/inquiries`                  | No   | Submit inquiry           |
| GET    | `/api/inquiries`                  | Yes  | List inquiries           |
| PUT    | `/api/inquiries/:id`              | Yes  | Update inquiry status    |
| DELETE | `/api/inquiries/:id`              | Yes  | Delete inquiry           |
| GET    | `/api/settings`                   | No   | Get shop settings        |
| PUT    | `/api/settings`                   | Yes  | Update shop settings     |
| GET    | `/api/stats`                      | Yes  | Dashboard statistics     |

## Production Deployment

### Build Frontend
```bash
cd client
npm run build
```

The build output will be in `client/dist/`. The Express server automatically serves this in production.

### Run Production Server
```bash
cd server
NODE_ENV=production npm start
```

The app will be available on port 3000 (or the `PORT` environment variable).

### Environment Variables

| Variable     | Default                          | Description          |
|-------------|----------------------------------|----------------------|
| `PORT`      | `3000`                           | Server port          |
| `JWT_SECRET`| `siddu-potadar-jwt-secret-2024`  | JWT signing secret   |

> ⚠️ **Important:** Change the `JWT_SECRET` in production!

## Business Information

- **Shop Name:** Siddu Potadar
- **Address:** Belgaum Rd, Gajabarwadi, Hukkeri, Karnataka 591309, India
- **Phone:** +91 89710 12999
- **Hours:** Monday to Saturday, 10:00 AM - 8:00 PM
- **Google Rating:** 4.5/5 ⭐

## License

Private — All rights reserved. Built for Siddu Potadar Jewelry Store.
