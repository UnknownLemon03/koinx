import mongoose from "mongoose";

const cryptoSchema = new mongoose.Schema({
    usd:{ type: Number, required: true },
    usd_market_cap:{ type: Number, required: true },
    usd_24h_change:{ type: Number, required: true },
    name: { type: String, required: true}
});
// indexing for faster queries
cryptoSchema.index({ name: 1 });

const CryptoDB = mongoose.model("Crypto", cryptoSchema);
export default CryptoDB;