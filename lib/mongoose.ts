import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  mongoose.set('strictQuery', true)

  if(!process.env.MONGODB_URL) return console.error('MONGODB_URL is not defined');

  if(isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL)
    isConnected = true;
    console.log('=> new database connection');
  } catch (error) {
    console.error('Error connecting to database: ', error);
  }
}