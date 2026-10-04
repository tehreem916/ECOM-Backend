# MERN E-Commerce Backend

A REST API backend for an e-commerce application built with Node.js, Express, MongoDB, and Mongoose. The implementation follows the backend portion of the referenced MERN e-commerce tutorial and stops before the tutorial begins the Order API at approximately 4:08:27.

## Current scope

This project currently includes:

- Product listing and product details
- Product search by keyword
- Product filtering and pagination
- Protected product administration endpoints
- User registration and login
- JWT authentication stored in HTTP-only cookies
- Password hashing with bcrypt
- Current-user profile access
- Password update and password recovery flows
- User profile updates
- Admin user management
- Centralized asynchronous and application error handling

The following tutorial sections are intentionally not included:

- Order APIs
- Payment processing
- React frontend
- Redux state management
- Shopping cart and checkout
- Product reviews
- Admin dashboard UI
- Deployment configuration

## Technology stack

- **Runtime:** Node.js
- **Web framework:** Express
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password security:** bcrypt
- **Email:** Nodemailer
- **Development server:** Nodemon

## Prerequisites

Install the following before running the project:

- Node.js 18 or newer
- npm
- A MongoDB deployment, such as MongoDB Atlas
- SMTP credentials for password recovery emails

## Installation

Clone or copy the project, then install the dependencies from the project root:

```bash
npm install
```

## Environment configuration

Create or update:

```text
backend/Config/config.env
```

Example configuration:

```env
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

SMPT_HOST=smtp.example.com
SMPT_PORT=587
SMPT_SERVICE=
SMPT_MAIL=your-email@example.com
SMPT_PASSWORD=your-email-password
```

### Configuration notes

- Do not commit real database passwords, JWT secrets, or SMTP credentials.
- The environment file is loaded by `backend/server.js`.
- `MONGO_URI` must be a complete, valid MongoDB connection string.
- Password recovery requires valid SMTP configuration.
- The current registration API expects an avatar object containing `public_id` and `url`.

## Running the project

Start the development server with automatic restart:

```bash
npm run dev
```

Start the server normally:

```bash
npm start
```

When the server starts successfully, the console should contain messages similar to:

```text
Server is running on port 4000
MongoDB connected successfully
```

The API is available at:

```text
http://localhost:4000/api/v1
```

## API reference

### Products

| Method | Endpoint | Authentication | Description |
|---|---|---:|---|
| `GET` | `/products` | No | List products |
| `GET` | `/product/:id` | No | Get a product by ID |
| `GET` | `/admin/products` | Admin | List all products |
| `POST` | `/admin/product/new` | Admin | Create a product |
| `PUT` | `/admin/product/:id` | Admin | Update a product |
| `DELETE` | `/admin/product/:id` | Admin | Delete a product |

#### Product list query parameters

Product listing supports:

```text
GET /api/v1/products?keyword=phone
GET /api/v1/products?price[lte]=50000
GET /api/v1/products?ratings[gte]=4
GET /api/v1/products?page=2
```

The default page size is eight products.

### Authentication and users

| Method | Endpoint | Authentication | Description |
|---|---|---:|---|
| `POST` | `/register` | No | Register a user |
| `POST` | `/login` | No | Authenticate a user |
| `GET` | `/logout` | No | Clear the authentication cookie |
| `GET` | `/me` | User | Get the authenticated user |
| `PUT` | `/me/update` | User | Update profile details |
| `PUT` | `/password/update` | User | Change the current password |
| `POST` | `/password/forgot` | No | Request a password reset |
| `PUT` | `/password/reset/:token` | No | Set a new password |
| `GET` | `/admin/users` | Admin | List all users |
| `GET` | `/admin/user/:id` | Admin | Get one user |
| `PUT` | `/admin/user/:id` | Admin | Update a user's role |
| `DELETE` | `/admin/user/:id` | Admin | Delete a user |

#### Registration example

```http
POST /api/v1/register
Content-Type: application/json
```

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "avatar": {
    "public_id": "test-avatar",
    "url": "https://example.com/avatar.png"
  }
}
```

#### Login example

```http
POST /api/v1/login
Content-Type: application/json
```

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

On successful login, the API sets an HTTP-only `token` cookie. API clients must preserve cookies when calling protected endpoints.

## Project structure

```text
.
├── backend
│   ├── Config
│   │   ├── config.env
│   │   └── database.js
│   ├── controllers
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware
│   │   ├── auth.js
│   │   ├── catchAsyncErrors.js
│   │   └── error.js
│   ├── models
│   │   ├── productModel.js
│   │   ├── productSchema.js
│   │   └── userModel.js
│   ├── routes
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── utils
│   │   ├── apifeatures.js
│   │   ├── catchAsyncErrors.js
│   │   ├── errorhander.js
│   │   ├── jwtToken.js
│   │   └── sendEmail.js
│   ├── app.js
│   └── server.js
├── package.json
└── README.md
```

## Error responses

Errors use a consistent JSON response shape:

```json
{
  "success": false,
  "message": "A description of the error"
}
```

Common status codes include:

- `200` — Successful request
- `201` — Resource created
- `400` — Invalid input or validation failure
- `401` — Authentication required or invalid credentials
- `403` — Authenticated user lacks permission
- `404` — Resource not found
- `500` — Unexpected server error

## Verifying the installation

After starting the server, test the public product endpoint:

```text
http://localhost:4000/api/v1/products
```

A successful response has HTTP status `200` and includes:

```json
{
  "success": true,
  "products": [],
  "productsCount": 0,
  "resultPerPage": 8,
  "filteredProductsCount": 0
}
```

Test the authentication middleware without logging in:

```text
http://localhost:4000/api/v1/me
```

This should return HTTP status `401` with a message indicating that login is required.

## Security considerations

- Keep environment files out of source control.
- Use a strong, randomly generated `JWT_SECRET`.
- Use HTTPS in production so authentication cookies cannot be intercepted.
- Use a dedicated SMTP credential with only the permissions required for email delivery.
- Restrict MongoDB network access to trusted IP addresses or private networks.
- Review dependency advisories before deploying publicly.


