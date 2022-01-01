const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (shipping_fee, total_amount) => {
  return shipping_fee + total_amount;
};

const paymentController = async (req, res) => {
  const { cart, shipping_fee, total_amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(shipping_fee, total_amount),
      currency: 'usd',
      description: 'Paying for shopping',
      shipping: {
        name: 'Varun Tiwari',
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        },
      },
    });
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = paymentController;
