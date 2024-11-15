import mqtt from 'mqtt';

const client = mqtt.connect('wss://broker.hivemq.com:8000/mqtt');

export const subscribeToTopic = (
  topic: string,
  callback: (message: string) => void
) => {
  client.on('connect', () => {
    console.log(`Connected to MQTT broker. Subscribing to ${topic}`);
    client.subscribe(topic);
  });

  client.on('message', (receivedTopic, message) => {
    if (receivedTopic === topic) {
      callback(message.toString());
    }
  });
};

export const publishToTopic = (topic: string, message: string) => {
  client.publish(topic, message);
};

export default client;
