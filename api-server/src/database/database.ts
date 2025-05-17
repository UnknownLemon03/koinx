import mongoose from 'mongoose';
import CryptoDB from '../models/Crypto';
import { CoinData } from '../utils/types';

export const connectDB = async (DataBaseUrl:string): Promise<void> => {
  try {
    await mongoose.connect(DataBaseUrl);
    console.log('db connected successfully.');
  } catch (error) {
    console.error('db connection error:', error);
  }
};


export async function cryptoSaveDB(data: CoinData[]) {
    try {
        await CryptoDB.insertMany(data);
    } catch (e) {
        console.error("Error saving to DB:", e);
    }
}



export default connectDB;
