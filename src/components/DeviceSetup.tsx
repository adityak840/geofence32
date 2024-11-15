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
import { useStore } from '@/store';

type DeviceSetupProps = {};

const DeviceSetup: React.FC<DeviceSetupProps> = () => {
  const [id, setId] = useState('');
  const setDeviceId = useStore((state) => state.setDeviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('deviceId', id.trim());
    setDeviceId(id.trim());
  };

  return (
    <>
      <Card className="w-full max-w-[350px]">
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
      <p className="font-light text-gray-500 mt-8 text-center">
        Built by Anirudh Mishra (21BCT0168), Tiya Maheshwari (@1BCT0165) and
        Rudrajeet Chaudhuri (21BCT0064)
      </p>
    </>
  );
};

export default DeviceSetup;
