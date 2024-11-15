import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { publishToTopic } from '../mqttClient';
import { useStore } from '@/store';
import { Button } from './ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

type GeofenceProps = {};

const GeofenceSetup: React.FC<GeofenceProps> = () => {
  const [center, setCenter] = useState<[number, number]>([12.971, 79.163]);
  const [radius, setRadius] = useState<number>(100);
  const deviceId = useStore((state) => state.deviceId);
  const { toast } = useToast();

  const handleUpdate = () => {
    publishToTopic(
      `geofenceproject/${deviceId}/geofence`,
      JSON.stringify({ center, radius, timestamp: new Date().toLocaleString() })
    );
    toast({
      title: 'Geofence Updated',
      description: `Geofence updated for device ${deviceId}`,
    });
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setCenter([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  return (
    <div>
      <h1>Geofence Setup</h1>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={center} />
        <MapClickHandler />
      </MapContainer>
      <div className="flex flex-col gap-2 mt-2">
        <Label>
          Latitude: <Input type="number" value={center[0]} readOnly />
        </Label>
        <Label>
          Longitude: <Input type="number" value={center[1]} readOnly />
        </Label>
        <Label>
          Radius (m):
          <Input
            type="number"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          />
        </Label>
        <Button onClick={handleUpdate}>Update Geofence</Button>
      </div>
    </div>
  );
};

export default GeofenceSetup;
