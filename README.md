# TradeXon / Ecommerce Frontend

A modern **Next.js** frontend for a multi-vendor ecommerce marketplace.

## Overview

This project is a marketplace-style ecommerce frontend with:
- a homepage featuring a hero carousel and product sections
- product listing and product detail experiences
- cart, login, signup, profile, and order pages
- seller-focused pages and admin UI sections
- global data loading for auth, categories, banners, exchange rates, and cart state

## Tech Stack

- **Next.js**
- **React**
- **Redux Toolkit**
- **Tailwind CSS**
- **React Toastify**
- **React Slick**
- **Framer Motion**
- **Axios**
- **React Hook Form**
- **React PDF Renderer**

## Features

- Responsive homepage with:
  - hero carousel
  - featured products
  - trending products
  - best sellers
  - new arrivals
- Redux-based app state management
- Authentication loading and user bootstrap
- Category and banner loading on app start
- Currency exchange-rate loading
- Cart hydration from local storage
- Product cards, grids, descriptions, and pagination
- Seller and admin navigation/footer components
- Invoice template support
- Toast notifications

## Project Structure

```text
app/
  admin/
  cart/
  categories/
  contact/
  login/
  order/
  privacy-policy/
  products/
  profile/
  search/
  seller-details/[id]/
  seller-policy/
  seller/
  signup/
  terms-and-conditions/
components/
hooks/
lib/
public/
store/
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone https://github.com/muhammad-aman-dev/Ecommerce-Frontend.git
cd Ecommerce-Frontend
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Variables

The app uses environment-based URLs in several places. Create a `.env.local` file and add the variables required by your backend and frontend deployment.

Example:

```bash
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

## Notes

- The branding in the app metadata uses **TradeXon**.
- The repository also includes a deployed site reference in GitHub’s About section.
- If you are connecting this frontend to a backend API, make sure the backend endpoints match the routes used by the Redux slices and homepage data loader.

## License

No license file was found in the repository. Add one if you want to define usage terms.
