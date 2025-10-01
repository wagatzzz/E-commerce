# E-Commerce Platform

A modern, full-stack e-commerce application built with the MERN stack featuring secure payment processing, role-based authentication, and enterprise-level architecture.


### Key Achievements
- Zero-dependency authentication system with JWT
- Pesapal payment integration for secure transactions
- Role-based access control with admin/user permissions
- Responsive design with Tailwind CSS
- RESTful API architecture following industry best practices
- Comprehensive error handling and input validation
- MongoDB Atlas cloud database integration



## Technology Stack
- Express JS
- React JS
- Tailwind CSS
- MongoDB
- Pesapal Intergration

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wagatzzz/E-commerce.git
   cd E-commerce
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Seed the database
   npm run seed
   
   # Start development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
PESAPAL_CONSUMER_KEY=your_pesapal_consumer_key
PESAPAL_CONSUMER_SECRET=your_pesapal_consumer_secret
PESAPAL_ENVIRONMENT=sandbox # or live
```


## API Documentation

### Authentication Endpoints
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
```

### Product Management
```http
GET    /api/products       # Get all products
GET    /api/products/:id   # Get product by ID
POST   /api/products       # Create product (Admin)
PATCH  /api/products/:id   # Update product (Admin)
DELETE /api/products/:id   # Delete product (Admin)
```

### Cart Operations
```http
POST   /api/cart           # Add item to cart
GET    /api/cart           # Get user's cart
DELETE /api/cart/:id       # Remove item from cart
DELETE /api/cart           # Clear cart
```

### Order Processing
```http
POST   /api/orders         # Create new order
GET    /api/orders         # Get user's orders
GET    /api/orders/:id     # Get order details
```

### Payment Integration
```http
POST   /api/payment/initiate    # Initiate payment
POST   /api/payment/callback    # Payment callback
GET    /api/payment/status/:id  # Check payment status
```
