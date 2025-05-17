import axios from "axios";
import { CoinData } from "./utils/types";
import dotenv from 'dotenv';
import { startKafkaConsumer } from "./utils/kafka";
import { EachMessageHandler } from "kafkajs";
import connectDB, { cryptoSaveDB } from "./database/database";
import { FetchCryptoStats } from "./utils/util";
import CryptoDB from "./models/Crypto";
import express from "express"
import { CrytpRoute } from "./controller";
dotenv.config();

const app = express()


app.use(CrytpRoute)



connectDB(process.env.DATABASE_URL as string);


// whenever there is trigger even store date in database 
const ConsumerActionHandler:EachMessageHandler = async ({ topic, partition, message }) => {
      const data = await FetchCryptoStats(['bitcoin','ethereum','matic-network'])
      await cryptoSaveDB(data)
}

startKafkaConsumer(ConsumerActionHandler);


app.listen(3000)