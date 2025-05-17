import {Kafka} from "kafkajs"
import dotenv from "dotenv"
dotenv.config();

const kafka = new Kafka({
  clientId: 'crypto-producer',
  brokers: [process.env.KAFKA_BROKER as string]  
})


const kafkaProducer = kafka.producer();


async function produceEvent(){
  await kafkaProducer.connect();
  try{
    setInterval(async ()=>{
      await kafkaProducer.send({
      topic: 'crypto-prices',
      messages: [{ key: 'Trigger', value: 'Update DB' }],
    })
    console.log("Event Publish")
    },60*60*15)
  }catch(e){
    console.log(e)
  }
}

produceEvent()