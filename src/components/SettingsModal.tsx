import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { DialogContent, DialogTitle } from './ui/dialog';
import ShowAllCard from './ShowAllCard';
import { useStore } from '@/store';

export default function SettingsModal() {
  const clearAlerts = useStore((state) => state.clearAlerts);
  return (
    <Dialog>
      <DialogTrigger className="w-full" asChild>
        <Button className="w-full" variant="outline">
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:w-[350px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Configure the settings for the Geofence32 application.
        </DialogDescription>
        <div>
          <ShowAllCard />
          <Button
            variant={'outline'}
            className="mt-4 w-full font-bold"
            onClick={clearAlerts}
          >
            Clear Alerts
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
