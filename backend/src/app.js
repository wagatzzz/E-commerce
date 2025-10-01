const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');

const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Ecommerce API running'));

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payment', paymentRoutes);

// error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
