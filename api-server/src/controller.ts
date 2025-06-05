import { Router } from "express";
import { FetchCryptoStats } from "./utils/util";
import CryptoDB from "./models/Crypto";
import { getCatch, setCatch } from "./utils/redis";

export const CrytpRoute = Router();

CrytpRoute.get("/hello", (req, res) => {
    res.send("Hello world");
});


//get status
CrytpRoute.get("/stats",async (req,res)=>{
    const { coin } =  req.query;
    console.log(coin)  
    if (!coin || typeof coin !== "string") {
        res.json({ error: "Missing or invalid 'coin' query parameter" });
        return
    }
    const dataReq = await FetchCryptoStats([coin as string])      
    console.log(dataReq)  
    res.json({data:dataReq})
    return
})

CrytpRoute.get("/deviation", async (req, res) => {
    try {
        const { coin } = req.query;

        if (!coin || typeof coin !== "string") {
            res.status(400).json({ error: "Missing or invalid 'coin' query parameter" });
            return
        }
        const catchData = await getCatch(`dev_${coin.toLowerCase()}`);
        if (catchData) {
            // If data is cached, return it
            res.json({ deviation: catchData });
            return;
        }
        // Fetch last 100 entries for the given coin
        const records = await CryptoDB.find({ name: coin.toLowerCase() })
                                      .sort({ _id: -1 })
                                      .limit(100);
        console.log(records)
        if (records.length == 0) {
            const x2 = await CryptoDB.find({})
            console.log(x2)
            res.status(404).json({ error: "No records found for the given coin" });
            return
        }


        // cal stdDev
        const prices = records.map(r => r.usd);
        const mean = prices.reduce((sum, val) => sum + val, 0) / prices.length;
        const variance = prices.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / prices.length;
        const stdDev = Math.sqrt(variance);
        await setCatch(`dev_${coin.toLowerCase()}`, stdDev.toString(), 15*60*60); // Cache for until next iteraion
        res.json({ deviation: parseFloat(stdDev.toFixed(2)) });
    } catch (error) {
        console.error("Error in /stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
