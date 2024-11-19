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
      <div className="bg-black" style={{fontFamily: 'PoppinsRegular'}}>
        <div className="min-h-screen w-full max-w-[350px] mx-auto flex flex-col items-center justify-center">
          <div className="top-0 pt-11 pb-8 w-full">
            <h1 className="text-4xl text-white font-extrabold lg:text-5xl text-center">
              BikeLink
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
