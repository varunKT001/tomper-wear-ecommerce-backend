// load env-vars
require('dotenv').config();

// requiring dependencies
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// initialize express
const app = express();

// requiring routers
const paymentRouter = require('./routes/paymentRouter');
const productRouter = require('./routes/productRouter');
const adminRouter = require('./routes/adminRouter');
const orderRouter = require('./routes/orderRouter');

// requiring middlewares
const errorMiddleware = require('./middleware/Error');

// require db configs
const connectToDb = require('./config/db');

// uncaught exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server shutting down due to uncaught exception`);
  process.exit(1);
});

// connect to db
connectToDb();

// using middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// using routers
app.use('/api/payment', paymentRouter);
app.use('/api/products', productRouter);
app.use('/api/admin', adminRouter);
app.use('/api/orders', orderRouter);

// using other middlewares
app.use(errorMiddleware);

// starting server
const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Server running');
});

// unhandled promise rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server shutting down due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
