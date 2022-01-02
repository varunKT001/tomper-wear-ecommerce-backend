const mongoose = require('mongoose');

const connectToDb = () => {
  mongoose.connect(
    process.env.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log('Database connected');
    },
    (error) => {
      console.log(error);
    }
  );
};

module.exports = connectToDb;
