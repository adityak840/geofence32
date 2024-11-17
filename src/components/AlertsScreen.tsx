import React, { useEffect } from 'react';
import { subscribeToTopic } from '../mqttClient';
import { useStore } from '@/store';
import ShowAllCard from './ShowAllCard';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import SettingsModal from './SettingsModal';
import GeoMap from './Geomap';

type AlertsScreenProps = {};

const AlertsScreen: React.FC<AlertsScreenProps> = () => {
  const deviceId = useStore((state) => state.deviceId);
  const alerts = useStore((state) => state.alerts);
  const addAlert = useStore((state) => state.addAlert);
  const showAll = useStore((state) => state.showAll);
  const clearAlerts = useStore((state) => state.clearAlerts);
  const resetDeviceId = useStore((state) => state.resetDeviceId);
  const setGeofence = useStore((state) => state.setGeofence);
  const radius = useStore((state) => state.radius);
  const geofence = useStore((state) => state.center);
  const { toast } = useToast();

  useEffect(() => {
    const localGeofence = localStorage.getItem('geofence');
    if (localGeofence) {
      const { center, radius } = JSON.parse(localGeofence);
      setGeofence(center, radius);
    }
  }, []);

  useEffect(() => {
    const subscribeToTopics = async () => {
      try {
        toast({
          title: 'Attempting to subscribe to topics...',
          description: `Subscribing to topics for device ${deviceId}`,
        });
        await Promise.all([
          subscribeToTopic(`geofenceproject/${deviceId}/alert`, (msg) => {
            const { timestamp, message } = JSON.parse(msg);
            addAlert({ message, type: 'alert', timestamp });
          }),
          subscribeToTopic(
            `geofenceproject/${deviceId}/location`,
            (message) => {
              const { timestamp, latitude, longitude } = JSON.parse(message);
              addAlert({
                message: `Lat: ${latitude}, Lng: ${longitude}`,
                type: 'location',
                timestamp,
              });
            }
          ),
          subscribeToTopic(
            `geofenceproject/${deviceId}/geofence`,
            (message) => {
              let data = JSON.parse(message);
              setGeofence([data.center[0], data.center[1]], data.radius);
              localStorage.setItem(
                'geofence',
                JSON.stringify({ center: data.center, radius: data.radius })
              );
              addAlert({
                message: `Center: [${data.center[0]}, ${data.center[1]}], Radius: ${data.radius}`,
                type: 'geofence',
                timestamp: data.timestamp,
              });
            }
          ),
        ]);
      } catch (error) {
        toast({
          title: 'Error subscribing to topics',
          description: `Error subscribing to topics for device ${deviceId}`,
          variant: 'destructive',
        });
      }
    };

    subscribeToTopics();
  }, [deviceId]);

  const reset = () => {
    resetDeviceId();
    localStorage.removeItem('deviceId');
    location.reload();
  };

  return (
    <div className="w-full max-w-[350px]">
      <div className="sticky top-[115px] bg-white z-10 pb-8 pt-1">
        <p className="font-light text-center mb-2">
          Device ID: <span className="font-semibold">{deviceId}</span>
        </p>
        <p className="text-center mb-2">
          Geofence: {geofence[0]}, {geofence[1]} with radius {radius}m
        </p>
        <ShowAllCard />
        <Button
          variant={'outline'}
          className="mt-4 w-full font-bold"
          onClick={clearAlerts}
        >
          Clear Alerts
        </Button>
        <Button
          variant={'outline'}
          className="mt-4 mb-4 w-full font-bold"
          onClick={reset}
        >
          Reset Device ID
        </Button>
        <SettingsModal />
      </div>
      <GeoMap />
      <ul>
        {alerts?.length ? (
          alerts.map((alert, index) => (
            <li key={index}>
              {showAll || alert.type === 'alert' ? (
                <div
                  className={`${
                    alert.type == 'alert'
                      ? 'bg-blue-100'
                      : alert.type == 'geofence'
                      ? 'bg-gray-200'
                      : 'bg-gray-100'
                  } p-4 rounded-lg my-2 w-full grid grid-cols-3`}
                >
                  <p className="font-semibold col-span-2">{alert.message}</p>
                  <p className="font-light">{alert.timestamp}</p>
                </div>
              ) : null}
            </li>
          ))
        ) : (
          <p className="text-center">No alerts yet.</p>
        )}
      </ul>
    </div>
  );
};

export default AlertsScreen;
