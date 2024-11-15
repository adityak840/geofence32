import { useState } from 'react';
import './App.css';
import DeviceSetup from './components/DeviceSetup';

function App() {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  return (
    <>
      <div className="h-full w-full p-2 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold lg:text-5xl mt-8 mb-10">
          Geofence
          <span className="font-light">32</span>
        </h1>
        {!deviceId ? <DeviceSetup setDeviceId={setDeviceId} /> : null}
      </div>
    </>
  );
}

export default App;
