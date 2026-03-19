# Product API

A production-ready public REST API for managing 10,000+ product records, built with Node.js, Express.js, and MongoDB.

## Features

- Full CRUD operations for products
- Pagination (default 50 per page, max 100)
- Full-text search by name
- Filter by category and price range
- Sorting by price (asc/desc) and date (newest/oldest)
- MongoDB indexes for high-performance queries
- CORS enabled (public access)
- Input validation and structured error responses

## Project Structure

```
product-api/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   └── productController.js # Request handlers
├── models/
│   └── Product.js          # Mongoose schema & indexes
├── routes/
│   └── productRoutes.js    # Express routes
├── scripts/
│   └── seed.js             # Seed 10,000 fake products
├── .env.example            # Environment variable template
├── .gitignore
├── package.json
├── postman_collection.json # Postman collection
├── README.md
└── server.js               # Entry point
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Setup Instructions

### 1. Clone and install

```bash
git clone <repository-url>
cd product-api
npm install
```

### 2. Configure environment variables

Copy the example env file and update values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/productdb
```

For MongoDB Atlas, use your connection string:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/productdb?retryWrites=true&w=majority
```

### 3. Run locally

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`.

### 4. Seed the database (optional)

Insert 10,000 fake product records:

```bash
npm run seed
```

## API Endpoints

### Base URL
```
http://localhost:5000
```

---

### GET `/api/products`

Get all products with pagination, filtering, and sorting.

**Query Parameters:**

| Parameter  | Type   | Default | Description                                       |
|------------|--------|---------|---------------------------------------------------|
| page       | number | 1       | Page number                                       |
| limit      | number | 50      | Items per page (max 100)                         |
| search     | string | -       | Full-text search by product name                 |
| category   | string | -       | Filter by category (case-insensitive)            |
| minPrice   | number | -       | Minimum price filter                              |
| maxPrice   | number | -       | Maximum price filter                              |
| sort       | string | newest  | Sort order: `price_asc`, `price_desc`, `newest`, `oldest` |

**Example requests:**

```bash
# Get first page with 10 products
GET /api/products?page=1&limit=10

# Search for headphones
GET /api/products?search=headphones

# Filter by category
GET /api/products?category=Electronics

# Filter by price range, sorted by price ascending
GET /api/products?minPrice=10&maxPrice=100&sort=price_asc

# Combined: search + category + sort
GET /api/products?search=speaker&category=Electronics&sort=price_desc&limit=20
```

**Example response:**

```json
{
  "success": true,
  "total": 10000,
  "page": 1,
  "pages": 200,
  "limit": 50,
  "data": [
    {
      "_id": "665abc123def456789012345",
      "name": "Premium Headphones 1",
      "description": "High quality premium headphones - product #1.",
      "price": 49.99,
      "category": "Electronics",
      "stock": 120,
      "createdAt": "2024-06-01T12:00:00.000Z",
      "updatedAt": "2024-06-01T12:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/products/:id`

Get a single product by its ID.

```bash
GET /api/products/665abc123def456789012345
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "665abc123def456789012345",
    "name": "Premium Headphones 1",
    "price": 49.99,
    "category": "Electronics",
    "stock": 120,
    "createdAt": "2024-06-01T12:00:00.000Z",
    "updatedAt": "2024-06-01T12:00:00.000Z"
  }
}
```

**Response (404):**

```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### POST `/api/products`

Create a new product.

**Required fields:** `name`, `price`

```bash
POST /api/products
Content-Type: application/json

{
  "name": "Smart Wireless Speaker",
  "description": "Crystal clear audio with 360-degree sound",
  "price": 79.99,
  "category": "Electronics",
  "stock": 50
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "_id": "665abc123def456789012345",
    "name": "Smart Wireless Speaker",
    "price": 79.99,
    "category": "Electronics",
    "stock": 50,
    "createdAt": "2024-06-01T12:00:00.000Z",
    "updatedAt": "2024-06-01T12:00:00.000Z"
  }
}
```

---

### PUT `/api/products/:id`

Update an existing product. Only include fields you want to change.

```bash
PUT /api/products/665abc123def456789012345
Content-Type: application/json

{
  "price": 89.99,
  "stock": 75
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "665abc123def456789012345",
    "name": "Smart Wireless Speaker",
    "price": 89.99,
    "stock": 75,
    "updatedAt": "2024-06-01T13:00:00.000Z"
  }
}
```

---

### DELETE `/api/products/:id`

Delete a product by ID.

```bash
DELETE /api/products/665abc123def456789012345
```

**Response (200):**

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Error Responses

| Status | Meaning                          |
|--------|----------------------------------|
| 200    | Success                          |
| 201    | Resource created                 |
| 400    | Bad request / validation error   |
| 404    | Resource not found               |
| 500    | Internal server error            |

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## How to Import into Postman

1. Open **Postman**
2. Click **Import** (top left)
3. Select `postman_collection.json` from this repository
4. The collection **"Product API"** will appear in your collections list
5. Set the `base_url` variable to your API URL (default: `http://localhost:5000`)
6. Start making requests!

---

## Deployment

### Deploy on Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables in the Render dashboard:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `PORT` — leave blank (Render sets this automatically)
6. Click **Deploy**

### Deploy on Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) and create a new project
3. Click **Deploy from GitHub repo**
4. Add environment variables in Railway settings:
   - `MONGO_URI` — your MongoDB Atlas connection string
5. Railway auto-detects Node.js and runs `npm start`

### MongoDB Atlas (Cloud Database)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Whitelist `0.0.0.0/0` (allow all IPs) in Network Access
3. Create a database user
4. Get your connection string and set it as `MONGO_URI`

---

## Performance Notes

- MongoDB indexes on `name` (text), `category`, `price`, and `createdAt` ensure fast queries on 10,000+ records
- `.lean()` is used on read queries to return plain JS objects (faster than Mongoose documents)
- `Promise.all` is used to run data fetch and count queries in parallel
- Batch inserts of 500 records at a time in the seed script