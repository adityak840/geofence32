import React from 'react';
import {
  Card,
  // CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
// import { Label } from '@radix-ui/react-label';
// import { Input } from './ui/input';
import { Button } from './ui/button';
import { useStore } from '@/store';

type DeviceSetupProps = {};

const DeviceSetup: React.FC<DeviceSetupProps> = () => {
  const id = 'bike';
  const setDeviceId = useStore((state) => state.setDeviceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('deviceId', id.trim());
    setDeviceId(id.trim());
  };

  return (
    <>
      <Card className="w-full max-w-[350px] text-center">
        <CardHeader>
          <CardTitle>Device Setup</CardTitle>
          <CardDescription>
            Connect to your bike?
          </CardDescription>
        </CardHeader>
        {/* <CardContent>
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
        </CardContent> */}
        <CardFooter className="flex justify-center">
          <Button disabled={!id} onClick={handleSubmit}>
            Connect
          </Button>
        </CardFooter>
      </Card>
      <p className="text-white text-lg mt-8 text-center">
         Project made by:
      </p>
      <p className="font-light text-gray-500 text-center">
        Aditya Khandelwal (21BCT0164)
      </p>
      <p className="font-light text-gray-500 text-center">
        Kaushal Vishnukanth Rathi (21BCT0084)
      </p>
      <p className="font-light text-gray-500 text-center">
        Shambhavi Singh (21BCT0086)
      </p>
    </>
  );
};

export default DeviceSetup;
