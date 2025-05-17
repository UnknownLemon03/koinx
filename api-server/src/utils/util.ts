import axios from "axios";
import { CoinData } from "./types";


// function to fetch data
export async function FetchCryptoStats(name:string[]) {
    let data:CoinData[] = []
    try {
        const url = 'https://api.coingecko.com/api/v3/simple/price';
        const params = {
        // ids: 'bitcoin,ethereum,matic-network',
        ids:  name.map(e=>e.trim()).join(','),
        vs_currencies: 'usd',
        include_market_cap: 'true',
        include_24hr_change: 'true',
        };

        const response = await axios.get(url, { params });

        data = Object.values(response.data as {string:CoinData}) 
    } catch (error) {
        if(error instanceof Error)
            console.error('Failed to fetch crypto stats:', error.message);

    }
    return data
}

