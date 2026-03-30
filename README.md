# Audix MERN E-Commerce

Full-stack headphone e-commerce app using React (Vite), Node.js/Express, MongoDB/Mongoose, and Tailwind CSS.

## Folder Structure

- `client/` React frontend
- `server/` Node/Express backend
- `images/` source image assets provided by user

Important runtime image path usage in frontend: `/images/...` from `client/public/images`.

## Backend Setup (Step 1)

1. Go to `server`:
   - `cd server`
2. Copy environment file:
   - `copy .env.example .env`
3. Start backend:
   - `npm run dev`

### Backend API

Products:

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

Reviews:

- `GET /api/reviews/:productId`
- `POST /api/reviews/:productId`

### Seed Sample Products

Run:

- `npm run seed`

This inserts 3 sample products referencing:

- `/images/product1.png`
- `/images/product2.png`
- `/images/product3.png`

## Frontend Setup (Step 2)

1. Go to `client`:
   - `cd client`
2. Copy env file:
   - `copy .env.example .env`
3. Start frontend:
   - `npm run dev`

Frontend runs on Vite default `http://localhost:5173`.

## Connect Frontend + Backend (Step 3)

- Keep backend running on port `5000`.
- Keep frontend running on port `5173`.
- In `client/.env`, set:
  - `VITE_API_URL=http://localhost:5000/api`

## Admin Access

- Username: `admin`
- Password: `admin123`

## Features Implemented

Customer side:

- Home hero section using `/images/hero.png`
- Featured products section
- Product listing grid with stock badges
- Product detail page with add-to-cart, wishlist, and reviews form/list
- Cart page with quantity controls (+/-), remove, total price
- Wishlist page with add/remove support

Admin side:

- Hardcoded admin login
- Product create form (name, price, description, image path, stock)
- Product list
- Product edit/update
- Product delete

Business logic:

- Add to cart disabled when stock is zero
- Out-of-stock badge shown
- Cart quantity capped by available stock
