# 🛒 E-Commerce Backend API

A fully functional **Node.js + Express + MongoDB** backend for an E-Commerce platform, supporting user management, product catalog, orders, reviews, authentication, and admin operations.

---

## 🚀 Features

- ✅ User Registration & Login with JWT Auth
- 🔐 Role-based access control (Admin/User)
- 📦 Product Management (CRUD)
- 📁 Category & Slug System
- 🛒 Cart Functionality
- 📦 Order Management & Status Updates
- ✍️ Product Reviews (Add/Edit/Delete)
- ❤️ Product Likes
- 📊 Admin Dashboard APIs (Stats)
- 🛡️ Secure API (Rate-limiting, Sanitization, JWT)

---

## 🧑‍💻 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (Access/Refresh Token)
- **Security:** express-rate-limit, mongo-sanitize, helmet
- **Cloud Storage:** Cloudinary (Image Uploads)
- **Testing/Docs:** Postman / Swagger (optional)

---
## ⚙️ Setup Instructions

### 1. Clone Repo
```bash
git clone https://github.com/Archan-07/E_Commerce_Backend.git
cd ecommerce-backend
```
---
### 2. Install Dependencies
```bash
npm install
```
---
### 3. Setup .env
- Create a .env file:
- PORT=5000
- MONGODB_URI=your_mongodb_connection
- ACCESS_TOKEN_SECRET=your_access_secret
- REFRESH_TOKEN_SECRET=your_refresh_secret
- ACCESS_TOKEN_EXPIRY=15m
- REFRESH_TOKEN_EXPIRY=7d
- CLOUDINARY_CLOUD_NAME=your_cloud_name
- CLOUDINARY_API_KEY=your_api_key
- CLOUDINARY_API_SECRET=your_api_secret

---

## 🛠️ Core Modules
### 🧍 Users
- Register/Login (with password hashing)
- Role-based access (user, admin)
- Token refresh
- Logout

### 🛒 Products
- Add, update, delete products (admin only)
- Filter, search, paginate products
- Product image upload to Cloudinary

### 📂 Categories
- Create/update/delete categories
- Auto-slug generation

### ❤️ Reviews
- Add/update/delete reviews
- Show reviews on product detail

### 🛒 Cart
- Add/remove/update products in cart
- Fetch user cart

### 📦 Orders
- Place orders from cart
- View user/admin orders
- Update payment/shipment status

### 🔒 Security & Middleware
- ✅ JWT Authentication
- 🚫 Rate-limiting (brute force protection)
- 🧼 Input sanitization (mongo-sanitize)
- ✅ Validation (express-validator)
- 🛡 Helmet headers

