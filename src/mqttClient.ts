import mqtt from 'mqtt';

const client = mqtt.connect('wss://test.mosquitto.org:8081/mqtt');

export const subscribeToTopic = (
  topic: string,
  callback: (message: string) => void
) => {
  console.log('Attempting to connect to MQTT broker.');
  client.on('connect', () => {
    console.log(`Connected to MQTT broker. Subscribing to ${topic}`);
    client.subscribe(topic);
  });

  client.on('message', (receivedTopic, message) => {
    if (receivedTopic === topic) {
      console.log(`Received message from ${topic}`);
      callback(message.toString());
    }
  });
};

export const publishToTopic = (topic: string, message: string) => {
  client.publish(topic, message);
};

export default client;
