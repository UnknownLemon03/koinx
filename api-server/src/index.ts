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
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
    return
});
//@ts-ignore
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err?.message });
    return
});

connectDB(process.env.DATABASE_URL as string);


// whenever there is trigger even store date in database 
const ConsumerActionHandler:EachMessageHandler = async ({ topic, partition, message }) => {
      const data = await FetchCryptoStats(['bitcoin','ethereum','matic-network'])
      await cryptoSaveDB(data)
}

startKafkaConsumer(ConsumerActionHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});