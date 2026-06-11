# Amazon Replica — SDE Intern Fullstack Assignment

This is a high-fidelity e-commerce web application designed to replicate the Amazon India shopping experience. It features a full-stack architecture with a Next.js frontend, a Node.js/Express backend, and a PostgreSQL database.

## 🚀 Live Demo
- **Frontend**: [https://ecommerce-frontend-e4ir.onrender.com/](https://ecommerce-frontend-e4ir.onrender.com/)
- **Backend API**: [https://ecommerce-backend-42ur.onrender.com/](https://ecommerce-backend-42ur.onrender.com/)

 ## For Using all features like wishlistyou have to login :
 - **Passwoord**: username: ujjwal@example.com
                  password : password123

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Lucide React (Icons), Axios.
- **Backend**: Node.js, Express.js, Sequelize (ORM).
- **Database**: PostgreSQL (hosted on Railway).
- **Deployment**: Vercel (Frontend), Railway (Backend & DB).

---

## ✨ Core Features

### 1. Product Listing & Search
- **Amazon-style Layout**: Grid layout with high-quality product images, ratings, and INR pricing.
- **Smart Search**: Find products instantly using the search bar (supports partial names and descriptions).
- **Category Filtering**: Navigate through categories like Electronics, Books, Fashion, etc., via the sub-navbar.

### 2. Product Detail Page
- **High-res Carousel**: View multiple images for every product.
- **Dynamic Stock**: Real-time availability status and "Buy Now" flow.
- **Micro-interactions**: Amazon-style hover effects and smooth transitions.

### 3. Shopping Cart Management
- **Full CRUD**: Add, update quantities, and remove items seamlessly.
- **Price Calculation**: Automatic subtotal and total calculations reflecting real-time prices.
- **Guest Support**: Cart persistence for guest users using temporary tokens.

### 4. Checkout & Order History
- **Shipping Simulation**: Standard Amazon-style checkout form with address input.
- **Order Placement**: One-click order creation with unique Order IDs.
- **Order History**: View past orders with product images, timestamps, and order totals.

---

## 🗄️ Database Schema (PostgreSQL)

The database consists of 7 interconnected tables to handle complex e-commerce logic:
- **`Users`**: Stores user profiles and credentials.
- **`Products`**: Core catalog data (price, stock, images).
- **`Categories`**: Nested category structure for easier navigation.
- **`Carts` / `Cart_Items`**: Manages the persistent shopping basket.
- **`Orders` / `Order_Items`**: Records finalized transactions and product snapshots at the time of purchase.
- **`Wishlists`**: Saves products for future consideration.

---

## 🚀 Setup & Installation

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/iamujjwal69/e-commerce-platform.git
cd e-commerce-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file with your DATABASE_URL
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Update NEXT_PUBLIC_API_URL in .env to your backend URL
npm run dev
```

---

## 💡 Key Implementation Decisions
- **Standardized API**: All endpoints follow a RESTful pattern.
- **Robustness**: Implemented fallback mapping for order items to handle Sequelize pluralization glitches.
- **Performance**: Used Next.js `Suspense` for better loading states and responsive images.
- **Default User**: As per requirements, a default user ("Ujjwal Sharma") is simulated for a smoother evaluation experience, though a full Auth system is present.

---

### 📝 Note on AI Usage
AI tools were used to accelerate the development of complex UI patterns and to debug database association issues. Every line of code has been audited for security and cleanliness to meet production standards.

**Submission for SDE Intern Assignment**
Developed by **Ujjwal Sharma**
