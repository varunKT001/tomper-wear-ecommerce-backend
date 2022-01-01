// load env-vars
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const paymentRouter = require('./routes/payment');

app.use(express.json());
app.use(cors());

app.use('/payment', paymentRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log('Server running');
});
