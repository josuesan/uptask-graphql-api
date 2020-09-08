const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Database connected!')
  } catch (error) {
    console.log('could not connect to database');
    console.log(error);
    process.exit(1);
  }

}

module.exports = connectDatabase;