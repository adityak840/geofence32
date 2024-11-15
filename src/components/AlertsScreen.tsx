import React, { useEffect } from 'react';
import { subscribeToTopic } from '../mqttClient';
import { useStore } from '@/store';
import ShowAllCard from './ShowAllCard';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

type AlertsScreenProps = {};

const AlertsScreen: React.FC<AlertsScreenProps> = () => {
  const deviceId = useStore((state) => state.deviceId);
  const alerts = useStore((state) => state.alerts);
  const addAlert = useStore((state) => state.addAlert);
  const showAll = useStore((state) => state.showAll);
  const clearAlerts = useStore((state) => state.clearAlerts);
  const resetDeviceId = useStore((state) => state.resetDeviceId);
  const { toast } = useToast();

  useEffect(() => {
    const subscribeToTopics = async () => {
      try {
        await Promise.all([
          subscribeToTopic(`geofenceproject/${deviceId}/alert`, (message) => {
            addAlert({ message, type: 'alert' });
          }),
          subscribeToTopic(
            `geofenceproject/${deviceId}/location`,
            (message) => {
              addAlert({ message, type: 'location' });
            }
          ),
        ]);
        toast({
          title: 'Subscribed to topics',
          description: `Successfully subscribed to topics for device ${deviceId}`,
        });
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
      <div>
        <p className="font-light text-center mb-2">
          Device ID: <span className="font-semibold">{deviceId}</span>
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
          className="mt-4 w-full font-bold"
          onClick={reset}
        >
          Reset Device ID
        </Button>
      </div>
      <ul className="mt-8">
        {alerts?.length ? (
          alerts.map((alert, index) => (
            <li key={index}>
              {showAll || alert.type === 'alert' ? (
                <div
                  className={`${
                    alert.type == 'alert' ? 'bg-blue-100' : 'bg-gray-100'
                  } p-4 rounded-lg my-2`}
                >
                  {alert.message}
                </div>
              ) : null}
            </li>
          ))
        ) : (
          <p>No alerts yet.</p>
        )}
      </ul>
    </div>
  );
};

export default AlertsScreen;
