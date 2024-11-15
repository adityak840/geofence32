import { useEffect } from 'react';
import './App.css';
import DeviceSetup from './components/DeviceSetup';
import { useStore } from './store';
import AlertsScreen from './components/AlertsScreen';

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
      <div className="h-full w-full p-2 px-6 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold lg:text-5xl mt-8 mb-10">
          Geofence
          <span className="font-light">32</span>
        </h1>
        {!deviceId ? <DeviceSetup /> : <AlertsScreen />}
      </div>
    </>
  );
}

export default App;
