# 🚀 TradeXon Ecommerce Frontend

Welcome to the **TradeXon Marketplace Frontend** 🛒 — a modern, responsive, and scalable ecommerce UI built with Next.js.

---

## 🌐 Overview

This project is a **multi-vendor ecommerce frontend** featuring:

✨ Dynamic homepage with product sections  
🛍️ Product browsing & detail pages  
🛒 Cart & checkout experience  
👤 User authentication (login/signup/profile)  
🏪 Seller & admin dashboards  
📦 Order tracking & management UI  
📊 Global app state management (Redux)

---

## 🧰 Tech Stack

- ⚡ Next.js (App Router)
- ⚛️ React.js
- 🧠 Redux Toolkit
- 🎨 Tailwind CSS
- 🔔 React Toastify
- 🎞️ React Slick (carousels)
- 🎬 Framer Motion (animations)
- 🌐 Axios (API calls)
- 📋 React Hook Form
- 📄 React PDF Renderer (invoice generation)

---

## ✨ Features

### 🏠 Homepage
- 🎠 Hero carousel/banner slider
- 🔥 Featured products
- 📈 Trending products
- ⭐ Best sellers
- 🆕 New arrivals

### 🛍️ Products
- Product listing page
- Product detail page
- Pagination & filtering
- Search functionality

### 🛒 Cart System
- Add/remove products
- Persistent cart (local storage)
- Redux-powered cart state

### 👤 Authentication
- Login / Signup pages
- Profile management
- Auth state hydration on app load

### 🏪 Seller & Admin
- Seller dashboard UI
- Admin panel pages
- Seller-specific product & order views

### 📦 Orders
- Order history page
- Order tracking UI

### ⚙️ Global System
- Category loading on app start
- Banner loading system
- Currency exchange rate support
- Centralized Redux store

### 🧾 Extras
- Invoice generation (PDF support)
- Toast notifications
- Responsive UI (mobile-first)

---

## 📁 Project Structure

```text
app/
  🛡️ admin/
  🛒 cart/
  📂 categories/
  📞 contact/
  🔑 login/
  📦 order/
  🔐 profile/
  🔍 search/
  🏪 seller/
  🏪 seller-details/[id]/
  📝 signup/
  📜 terms-and-conditions/
  📜 privacy-policy/

components/   → Reusable UI components
hooks/        → Custom React hooks
lib/          → Helpers & API utilities
public/       → Static assets
store/        → Redux slices & store
```

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

---

### ⚙️ Installation

```bash
git clone https://github.com/muhammad-aman-dev/Ecommerce-Frontend.git
cd Ecommerce-Frontend
npm install
```

---

### ▶️ Run Development Server

```bash
npm run dev
```

Open:

👉 http://localhost:3000

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build production app
npm run start    # Start production server
npm run lint     # Run lint checks
```

---

## 🔐 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

---

## 🧠 Notes

- 🏷️ Project branding is **TradeXon**
- 🔗 Backend API must match Redux API calls
- ⚙️ Global data (categories, banners, rates) loads on app startup
- 🛒 Cart state persists using local storage

---

## 📌 Future Improvements

- 🔔 Push notifications
- 💬 Live chat support
- 🌍 Multi-language support
- 📊 Analytics dashboard

---

## 📜 License

⚠️ No license file found. Consider adding one for open-source usage.

---

## 💡 Author

Built with ❤️ by **Muhammad Aman**

---

⭐ If you like this project, give it a star on GitHub!

