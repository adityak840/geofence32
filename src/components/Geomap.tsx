import { useEffect } from 'react';
import { useStore } from '@/store';
import { publishToTopic } from '@/mqttClient';

const GeoMap: React.FC = () => {
  const deviceId = useStore((state) => state.deviceId);
  const geofence = useStore((state) => state.center);
  const radius = useStore((state) => state.radius);

  useEffect(() => {
    const pollGPS = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationData = {
              latitude,
              longitude,
              timestamp: new Date().toLocaleString(),
            };

            // Publish location data to /location topic
            publishToTopic(
              `geofenceproject/${deviceId}/location`,
              JSON.stringify(locationData)
            );

            // Check if the device is outside the geofence
            const distance = calculateDistance([latitude, longitude], geofence);
            if (distance > radius) {
              const alertData = {
                message: 'Geofence breached.',
                timestamp: new Date().toLocaleString(),
              };
              // Publish alert data to /alert topic
              publishToTopic(
                `geofenceproject/${deviceId}/alert`,
                JSON.stringify(alertData)
              );
            }
          },
          (error) => {
            console.error('Error getting GPS position:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    const intervalId = setInterval(pollGPS, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [deviceId, geofence, radius]);

  const calculateDistance = (point1: number[], point2: number[]) => {
    const [lat1, lon1] = point1;
    const [lat2, lon2] = point2;
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  return null; // Non-display component
};

export default GeoMap;
