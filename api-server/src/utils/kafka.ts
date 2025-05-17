import { EachMessageHandler, Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'crypto-signal',
  brokers: [process.env.KAFKA_BROKER as string]  
});


export const ConsumerKafka = kafka.consumer({ groupId: 'crypto-group' });


// kafaka consumer which take action as input which run whenever there is crypto-price even
export const startKafkaConsumer = async (Action:EachMessageHandler) => {
  try {
    await ConsumerKafka.connect();
    console.log('Kafka consumer connected');

    await ConsumerKafka.subscribe({ topic: 'crypto-prices', fromBeginning: true });

    await ConsumerKafka.run({
      eachMessage: Action
    });
  } catch (err) {
    console.error('Error in Kafka consumer:', err);
  }
};

