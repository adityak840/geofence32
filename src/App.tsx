import { useEffect } from 'react';
import './App.css';
import DeviceSetup from './components/DeviceSetup';
import { useStore } from './store';
import AlertsScreen from './components/AlertsScreen';
import { Toaster } from './components/ui/toaster';

function App() {
  const setDeviceId = useStore((state) => state.setDeviceId);
  useEffect(() => {
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId) {
      setDeviceId(deviceId);
    }
  }, []);

  const deviceId = useStore((state) => state.deviceId);
  return (
    <>
      <div className="h-full w-full p-2 px-6">
        <div className="w-full max-w-[350px] mx-auto flex flex-col items-center">
          <div className="sticky top-0 bg-white pt-11 pb-8 w-full">
            <h1 className="text-4xl font-extrabold lg:text-5xl text-center">
              Geofence
              <span className="font-light">32</span>
            </h1>
          </div>
          {!deviceId ? <DeviceSetup /> : <AlertsScreen />}
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default App;
