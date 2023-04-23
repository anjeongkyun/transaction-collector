import mongoose from 'mongoose';

const connect = async () => {
  await mongoose.connect(process.env.DB_URL as string);
};

const close = async () => {
  await mongoose.connection.close();
};

const clear = async () => {
  await mongoose.connection.dropDatabase();
};

export { connect, close, clear };
