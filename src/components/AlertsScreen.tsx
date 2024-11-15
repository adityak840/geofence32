import React, { useState, useEffect } from 'react';
import { subscribeToTopic } from '../mqttClient';
import { useStore } from '@/store';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

type AlertsScreenProps = {};
type Alert = {
  message: string;
  type: 'alert' | 'location';
};

const AlertsScreen: React.FC<AlertsScreenProps> = () => {
  const deviceId = useStore((state) => state.deviceId);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    subscribeToTopic(`geofenceproject/${deviceId}/alert`, (message) => {
      setAlerts((prev) => [{ message, type: 'alert' }, ...prev]);
    });

    subscribeToTopic(`geofenceproject/${deviceId}/location`, (message) => {
      setAlerts((prev) => [{ message, type: 'location' }, ...prev]);
    });
  }, [deviceId]);

  return (
    <div>
      <Card className="sm:w-[350px] w-full">
        <CardHeader>
          <CardTitle>Show All</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center gap-6">
            <div>
              <Label htmlFor="showAll">
                Show All (Breach Alerts, Location Updates, etc.) or Alerts only.
              </Label>
            </div>
            <Switch
              id="showAll"
              checked={showAll}
              onCheckedChange={() => setShowAll((prev) => !prev)}
            />
          </div>
        </CardContent>
      </Card>
      <ul>
        {alerts.map((alert, index) => (
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
        ))}
      </ul>
    </div>
  );
};

export default AlertsScreen;
