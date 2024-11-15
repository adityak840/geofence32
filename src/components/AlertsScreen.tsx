import React, { useEffect } from 'react';
import { subscribeToTopic } from '../mqttClient';
import { useStore } from '@/store';
import SettingsModal from './SettingsModal';

type AlertsScreenProps = {};

const AlertsScreen: React.FC<AlertsScreenProps> = () => {
  const deviceId = useStore((state) => state.deviceId);
  const alerts = useStore((state) => state.alerts);
  const addAlert = useStore((state) => state.addAlert);
  const showAll = useStore((state) => state.showAll);

  useEffect(() => {
    subscribeToTopic(`geofenceproject/${deviceId}/alert`, (message) => {
      addAlert({ message, type: 'alert' });
    });

    subscribeToTopic(`geofenceproject/${deviceId}/location`, (message) => {
      addAlert({ message, type: 'location' });
    });
  }, [deviceId]);

  return (
    <div className="w-full max-w-[350px]">
      <SettingsModal />
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
