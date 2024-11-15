import mqtt from 'mqtt';

const client = mqtt.connect('wss://test.mosquitto.org:8081/mqtt');

export const subscribeToTopic = (
  topic: string,
  callback: (message: string) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('Attempting to connect to MQTT broker.');

    client.on('connect', () => {
      console.log(`Connected to MQTT broker. Subscribing to ${topic}`);
      client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
          reject(`Failed to subscribe to ${topic}: ${err.message}`);
        } else {
          resolve();
        }
      });
    });

    client.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        console.log(`Received message from ${topic}`);
        callback(message.toString());
      }
    });

    client.on('error', (err) => {
      console.error('MQTT client error:', err);
      reject(`MQTT client error: ${err.message}`);
    });
  });
};

export const publishToTopic = (topic: string, message: string) => {
  client.publish(topic, message);
};

export default client;
