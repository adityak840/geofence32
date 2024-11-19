import React, { useEffect } from "react";
import { subscribeToTopic } from "../mqttClient";
import { useStore } from "@/store";
import ShowAllCard from "./ShowAllCard";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import SettingsModal from "./SettingsModal";
import GeoMap from "./Geomap";

type AlertsScreenProps = {};

const AlertsScreen: React.FC<AlertsScreenProps> = () => {
  const deviceId = useStore((state) => state.deviceId);
  const alerts = useStore((state) => state.alerts);
  const addAlert = useStore((state) => state.addAlert);
  const showAll = useStore((state) => state.showAll);
  const clearAlerts = useStore((state) => state.clearAlerts);
  // const resetDeviceId = useStore((state) => state.resetDeviceId);
  const setGeofence = useStore((state) => state.setGeofence);
  const radius = useStore((state) => state.radius);
  const geofence = useStore((state) => state.center);
  const { toast } = useToast();

  useEffect(() => {
    const localGeofence = localStorage.getItem("geofence");
    if (localGeofence) {
      const { center, radius } = JSON.parse(localGeofence);
      setGeofence(center, radius);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    const subscribeToTopics = async () => {
      try {
        toast({
          title: "Attempting to subscribe to topics...",
          description: `Subscribing to topics for device ${deviceId}`,
        });
        await Promise.all([
          subscribeToTopic("alert", (msg) => {
            if (isSubscribed) {
              const { timestamp, message } = JSON.parse(msg);
              addAlert({ message, type: "alert", timestamp });
            }
          }),
          subscribeToTopic("location", (message) => {
            if (isSubscribed) {
              const { timestamp, latitude, longitude } = JSON.parse(message);
              addAlert({
                message: `Latitude: ${latitude}, \nLongitude: ${longitude}`,
                type: "location",
                timestamp,
              });
            }
          }),
          subscribeToTopic("fall", (msg) => {
            if (isSubscribed) {
              const timestamp = new Date().toLocaleString();
              const message = msg;
              addAlert({ message, type: "fall", timestamp });
            }
          }),
        ]);
      } catch (error) {
        if (isSubscribed) {
          toast({
            title: "Error subscribing to topics",
            description: `Error subscribing to topics for device ${deviceId}`,
            variant: "destructive",
          });
        }
      }
    };
    subscribeToTopics();
    return () => {
      isSubscribed = false;
    };
  }, [deviceId, addAlert, toast]);

  // const reset = () => {
  //   resetDeviceId();
  //   localStorage.removeItem('deviceId');
  //   location.reload();
  // };

  return (
    <div className="w-full">
      <div className="top-[115px] bg-white z-10 pb-8 pt-1 rounded-xl px-6 pt-4">
        <p className="font-light text-center mb-2">Connected to Device!</p>
        <p className="text-center mb-2">
          <strong>Location Parameters:</strong> <br /> Latitude: {geofence[0]}{" "}
          <br /> Longitude: {geofence[1]} <br />
        </p>
        <ShowAllCard />
        <Button
          variant={"outline"}
          className="mt-4 w-full font-bold mb-4 "
          onClick={clearAlerts}
        >
          Clear Alerts
        </Button>
        {/* <Button
          variant={'outline'}
          className="mt-4 mb-4 w-full font-bold"
          onClick={reset}
        >
          Reset Device ID
        </Button> */}
        {/* <SettingsModal /> */}
      </div>
      <GeoMap />
      <ul>
        {alerts?.length ? (
          alerts.map((alert, index) => (
            <li key={index}>
              {showAll || alert.type === "fall" ? (
                <div
                  className={`${
                    alert.type == "alert"
                      ? "bg-blue-100"
                      : alert.type == "fall"
                      ? "bg-red-200"
                      : "bg-gray-100"
                  } p-4 rounded-lg my-2 w-full grid grid-cols-3`}
                >
                  <p className="font-semibold col-span-2">{alert.message}</p>
                  <p className="font-light">{alert.timestamp}</p>
                </div>
              ) : null}
            </li>
          ))
        ) : (
          <p className="text-center">No alerts yet.</p>
        )}
      </ul>
    </div>
  );
};

export default AlertsScreen;
