const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-producer',
  brokers: ['192.168.0.107:9092'], // Update with your Kafka broker(s) address
});

const producer = kafka.producer();

const produceMessage = async () => {
  await producer.connect();
  let i =1; 
  while(i++)
  await producer.send({
    topic: 'mytopic',
    messages: [
      { value: 'Hello Kafka from Node.js Producer!' +i},
 
    ],
  });

  await producer.disconnect();
};

produceMessage().catch(console.error);
