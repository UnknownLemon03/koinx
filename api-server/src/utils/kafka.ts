import { EachMessageHandler, Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'crypto-signal',
  brokers: ['localhost:9092']  
});


const consumer = kafka.consumer({ groupId: 'crypto-group' });


// kafaka consumer which take action as input which run whenever there is crypto-price even
export const startKafkaConsumer = async (Action:EachMessageHandler) => {
  try {
    await consumer.connect();
    console.log('Kafka consumer connected');

    await consumer.subscribe({ topic: 'crypto-prices', fromBeginning: true });

    await consumer.run({
      eachMessage: Action
    });
  } catch (err) {
    console.error('Error in Kafka consumer:', err);
  }
};

