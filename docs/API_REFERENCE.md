# EasyShop API Reference

All endpoints return JSON responses and use standard HTTP response codes.

## Products API
- `GET /api/products`: Retrieve paginated list of catalog products.
- `GET /api/products/:id`: Get product details by ID.
- `POST /api/products`: Create a new product (Admin only).

## Cart & Checkout API
- `GET /api/cart`: Fetch authenticated user's current shopping cart.
- `POST /api/cart`: Add or update items in cart.
- `DELETE /api/cart/:itemId`: Remove specific item from cart.

## Health API
- `GET /api/health`: Application health check (returns `{ status: "ok", timestamp: ... }`).
