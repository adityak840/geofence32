import mqtt from 'mqtt';

const clientId = "mqttx_efcf0fd2";
const username = "test";
const password = "test";

const client = mqtt.connect('wss://e11c695c.ala.eu-central-1.emqxsl.com:8084/mqtt',{
  clientId,
  username,
  password,
});

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
  client.publish(topic, message, {
    qos: 1,
  });
};

export default client;
