import axios from "axios";
import { CoinData } from "./utils/types";
import dotenv from 'dotenv';
import { ConsumerKafka, startKafkaConsumer } from "./utils/kafka";
import { EachMessageHandler } from "kafkajs";
import connectDB, { cryptoSaveDB } from "./database/database";
import { FetchCryptoStats } from "./utils/util";
import CryptoDB from "./models/Crypto";
import express, { NextFunction, Request, Response } from "express"
import { CrytpRoute } from "./controller";
import { ConnectRedis, deleteCatch } from "./utils/redis";
dotenv.config();

const app = express()


app.use(CrytpRoute)

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
    return
});

app.use((err:Request, req:Request, res:Response, next:NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err instanceof Error ?  err.message : "Unknown error" });
    return
});



// whenever there is trigger this function get executed , and stores data in database and clear c
const ConsumerActionHandler:EachMessageHandler = async ({ topic, partition, message }) => {
  try {
    const coin = ['bitcoin', 'ethereum', 'matic-network']
    const data = await FetchCryptoStats(coin);
    console.log('Fetched data:', data);
    await cryptoSaveDB(data);
    
    
    // remove cache for each coin deviation once database is updated
    await Promise.all(
      coin.map(e=>deleteCatch(`dev_${e.toLowerCase()}`))
    )

    // Commit offset manually after successful processing
    await ConsumerKafka.commitOffsets([
      {
        topic,
        partition,
        offset: (parseInt(message.offset, 10) + 1).toString(),
      },
    ]);
  } catch (err) {
    console.error('Error in ConsumerActionHandler:', err);
    // Do not commit on failure — Kafka will retry this message
  }
};


connectDB(process.env.DATABASE_URL as string);
ConnectRedis()
startKafkaConsumer(ConsumerActionHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});