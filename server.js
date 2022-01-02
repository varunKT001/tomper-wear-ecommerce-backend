// load env-vars
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// requiring routers
const paymentRouter = require('./routes/paymentRouter');
const productRouter = require('./routes/productRouter');

// require db configs
const connectToDb = require('./config/db');

// connect to db
connectToDb();

// using middlewares
app.use(express.json());
app.use(cors());

// using routers
app.use('/api/payment', paymentRouter);
app.use('/api/products', productRouter);

// starting server
app.listen(process.env.PORT || 5000, () => {
  console.log('Server running');
});
