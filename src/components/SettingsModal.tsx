import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { DialogContent, DialogTitle } from './ui/dialog';
import GeofenceSetup from './GeofenceSetup';

export default function SettingsModal() {
  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        <Button className="w-full" variant="default">
          Geofence Parameters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:w-[350px]">
        <DialogHeader>
          <DialogTitle>Parameters</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Configure your geofence parameters
        </DialogDescription>
        <GeofenceSetup />
      </DialogContent>
    </Dialog>
  );
}
