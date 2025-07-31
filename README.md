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


## 🧪 API Endpoints

Most endpoints require authentication using a JWT (JSON Web Token) in the request header. Endpoints marked with 🔐 Protected require a valid access token. Endpoints marked with 👑 Admin Protected require the user to have an admin role.

### 👤 User & Authentication Endpoints (`/api/v1/auth` and `/api/v1/users`)
* `POST /api/v1/auth/register` - Register a new user.
* `POST /api/v1/auth/login` - User login.
* `POST /api/v1/auth/logout` - User logout. 🔐 Protected
* `POST /api/v1/auth/refreshToken` - Refresh access token.
* `POST /api/v1/users/changePassword` - Change current user's password. 🔐 Protected
* `GET /api/v1/users/getCurrentUser` - Get current user details. 🔐 Protected
* `PUT /api/v1/users/updateProfile` - Update current user's profile details. 🔐 Protected

### 📦 Product Endpoints (`/api/v1/products`)
* `POST /api/v1/products/createProduct` - Create a new product. 🔐 Protected, 👑 Admin Protected, ⬆️ File Upload (image)
* `GET /api/v1/products/getProductById/:productId` - Get product details by ID.
* `PUT /api/v1/products/updateProduct/:productId` - Update product details by ID. 🔐 Protected, 👑 Admin Protected
* `DELETE /api/v1/products/deleteProduct/:productId` - Delete a product by ID. 🔐 Protected, 👑 Admin Protected
* `GET /api/v1/products/getAllProducts` - Get all products.

### 🏷️ Category Endpoints (`/api/v1/categories`)
* `POST /api/v1/categories/createCategory` - Create a new category. 🔐 Protected, 👑 Admin Protected
* `GET /api/v1/categories/getAllCategories` - Get all categories. 🔐 Protected
* `PUT /api/v1/categories/updateCategory/:categoryId` - Update category details by ID. 🔐 Protected, 👑 Admin Protected
* `DELETE /api/v1/categories/deleteCategory/:categoryId` - Delete a category by ID. 🔐 Protected, 👑 Admin Protected

### 🛒 Cart Endpoints (`/api/v1/cart`)
* `POST /api/v1/cart/addToCart` - Add a product to the current user's cart. 🔐 Protected
* `GET /api/v1/cart/getCart` - Get the current user's cart. 🔐 Protected
* `DELETE /api/v1/cart/removeFromCart/:productId` - Remove a product from the current user's cart. 🔐 Protected
* `DELETE /api/v1/cart/clear` - Clear the current user's cart. 🔐 Protected

### 🛍️ Order Endpoints (`/api/v1/orders`)
* `POST /api/v1/orders/placeOrder` - Place a new order. 🔐 Protected
* `GET /api/v1/orders/getOrders` - Get all orders for the current user. 🔐 Protected
* `GET /api/v1/orders/getAllOrders` - Get all orders (for admin). 🔐 Protected, 👑 Admin Protected
* `PUT /api/v1/orders/updateOrderStatus/:orderId` - Update the status of an order by ID. 🔐 Protected, 👑 Admin Protected

### ⭐ Review Endpoints (`/api/v1/reviews`)
* `POST /api/v1/reviews/addOrUpdateReview/:productId` - Add or update a review for a product. 🔐 Protected
* `GET /api/v1/reviews/getProductReview/:productId` - Get all reviews for a specific product. 🔐 Protected
* `DELETE /api/v1/reviews/deleteReview/:reviewId` - Delete a review by ID. 🔐 Protected
