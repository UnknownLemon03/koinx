import { EachMessageHandler, Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'crypto-signal',
  brokers: [process.env.KAFKA_BROKER as string]  
});


export const ConsumerKafka = kafka.consumer({ groupId: 'crypto-group' });

async function checkingTopicExist(topic: string) {
  // Check if the topic is valid
    const admin = kafka.admin();
    const topics = await admin.listTopics();

    if (!topics.includes(topic)) {
      console.log('Topic "crypto-prices" does not exist. Creating it...');
      await admin.createTopics({
        topics: [{ topic, numPartitions: 1, replicationFactor: 1 }],
      });
      console.log('Topic "crypto-prices" created.');
    }
    
    while(true){
      const topics = await admin.listTopics();
      if (topics.includes(topic)) {
        console.log(`Topic "${topic}" is now available.`);
        break;
      }
      console.log(`Waiting for topic "${topic}" to be available...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
    }
    await admin.disconnect();
} 


// kafaka consumer which take action as input which run whenever there is crypto-price even
export const startKafkaConsumer = async (Action:EachMessageHandler) => {
  try {
    await checkingTopicExist('crypto-prices');  
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

