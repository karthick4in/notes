const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: ['192.168.0.107:9092'], // Update with your Kafka broker(s) address
});

const consumer = kafka.consumer({ groupId: 'my-group' });

const consumeMessages = async () => {
  await consumer.connect();

  await consumer.subscribe({ topic: 'mytopic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value}`);
    },
  });
};

consumeMessages().catch(console.error);
