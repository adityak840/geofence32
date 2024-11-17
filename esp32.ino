#include <WiFi.h>
#include <PubSubClient.h>
#include <TinyGPS++.h>
#include <math.h>
#include <ArduinoJson.h>

// Wi-Fi credentials
const char *ssid = "Stargate";
const char *password = "woza4593";

// MQTT Broker details
const char *mqtt_server = "test.mosquitto.org";
const int mqtt_port = 1883;
const char *location_topic = "geofenceproject/ESP32Client/location";
const char *alert_topic = "geofenceproject/ESP32Client/alert";
const char *geofence_topic = "geofenceproject/ESP32Client/geofence";

// Wi-Fi and MQTT clients
WiFiClient espClient;
PubSubClient client(espClient);

// GPS module
TinyGPSPlus gps;
HardwareSerial gpsSerial(1);

// LED Pin
const int ledPin = 19;

// Geofence parameters
double geofenceLat = 12.972828;
double geofenceLng = 79.165898;
double geofenceRadiusMeters = 500.0;

bool isOutsideGeofence = false;

void connectToWiFi()
{
    Serial.print("Connecting to Wi-Fi");
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.print(".");
    }

    Serial.println("\nConnected to Wi-Fi!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}

void connectToMQTT()
{
    while (!client.connected())
    {
        Serial.println("Connecting to MQTT...");
        String clientId = "ESP32Client-" + String(random(0xffff), HEX);

        if (client.connect(clientId.c_str()))
        {
            Serial.println("Connected to MQTT broker!");

            // Subscribe to necessary topics
            client.subscribe(alert_topic);
            client.subscribe(geofence_topic);
            Serial.println("Subscribed to topics.");
        }
        else
        {
            Serial.print("Failed to connect to MQTT. State: ");
            Serial.println(client.state());
            delay(5000); // Wait 5 seconds before retrying
        }
    }
}

double haversine(double lat1, double lon1, double lat2, double lon2)
{
    const double R = 6371000; // Earth radius in meters
    double dLat = radians(lat2 - lat1);
    double dLon = radians(lon2 - lon1);
    double a = sin(dLat / 2) * sin(dLat / 2) +
               cos(radians(lat1)) * cos(radians(lat2)) *
                   sin(dLon / 2) * sin(dLon / 2);
    double c = 2 * atan2(sqrt(a), sqrt(1 - a));
    return R * c;
}

// Callback for incoming MQTT messages
void mqttCallback(char *topic, byte *payload, unsigned int length)
{
    String message;
    for (int i = 0; i < length; i++)
    {
        message += (char)payload[i];
    }

    Serial.print("Message received on topic: ");
    Serial.println(topic);
    Serial.print("Message: ");
    Serial.println(message);

    if (String(topic) == geofence_topic)
    {
        DynamicJsonDocument doc(256);
        deserializeJson(doc, payload, length);

        geofenceLat = doc["center"]["latitude"];
        geofenceLng = doc["center"]["longitude"];
        geofenceRadiusMeters = doc["radius"];

        Serial.println("Updated geofence parameters:");
        Serial.print("Latitude: ");
        Serial.println(geofenceLat);
        Serial.print("Longitude: ");
        Serial.println(geofenceLng);
        Serial.print("Radius: ");
        Serial.println(geofenceRadiusMeters);
    }

    if (String(topic) == alert_topic)
    {
        for (int i = 0; i < 3; i++)
        {
            digitalWrite(ledPin, HIGH);
            delay(500);
            digitalWrite(ledPin, LOW);
            delay(500);
        }
    }
}

void publishLocation(double latitude, double longitude)
{
    DynamicJsonDocument doc(256);
    doc["latitude"] = latitude;
    doc["longitude"] = longitude;
    doc["timestamp"] = millis();

    String locationMsg;
    serializeJson(doc, locationMsg);
    client.publish(location_topic, locationMsg.c_str());
}

void checkGeofence(double latitude, double longitude)
{
    double distance = haversine(latitude, longitude, geofenceLat, geofenceLng);
    Serial.print("Distance from geofence center: ");
    Serial.println(distance);

    if (distance > geofenceRadiusMeters)
    {
        if (!isOutsideGeofence)
        {
            client.publish(alert_topic, "{\"message\":\"Geofence breached!\"}");
            isOutsideGeofence = true;
        }
    }
    else
    {
        if (isOutsideGeofence)
        {
            client.publish(alert_topic, "{\"message\":\"Returned inside geofence.\"}");
            isOutsideGeofence = false;
        }
    }
}

void setup()
{
    Serial.begin(115200);
    gpsSerial.begin(9600, SERIAL_8N1, 16, 17);

    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, LOW);

    connectToWiFi();
    client.setServer(mqtt_server, mqtt_port);
    client.setCallback(mqttCallback);
    connectToMQTT();
}

void loop()
{
    if (!client.connected())
    {
        connectToMQTT();
    }
    client.loop();

    while (gpsSerial.available() > 0)
    {
        if (gps.encode(gpsSerial.read()))
        {
            if (gps.location.isValid())
            {
                double latitude = gps.location.lat();
                double longitude = gps.location.lng();

                publishLocation(latitude, longitude);
                checkGeofence(latitude, longitude);
            }
        }
    }

    delay(10000); // Run every 10 seconds
}
