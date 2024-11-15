import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Button } from './ui/button';

type DeviceSetupProps = {
  setDeviceId: (id: string) => void;
};

const DeviceSetup: React.FC<DeviceSetupProps> = ({ setDeviceId }) => {
  const [id, setId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeviceId(id.trim());
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Device Setup</CardTitle>
        <CardDescription>
          Set up your device ID to connect to the cloud MQTT broker.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Device ID</Label>
              <Input
                id="deviceid"
                placeholder="Device ID for your ESP32S Device."
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button disabled={!id} onClick={handleSubmit}>
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeviceSetup;
