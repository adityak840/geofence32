import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { useStore } from '@/store';

export default function ShowAllCard() {
  const showAll = useStore((state) => state.showAll);
  const setShowAll = useStore((state) => state.setShowAll);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Show All</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center gap-6">
          <div>
            <Label htmlFor="showAll">
              Toggle to show all updates
            </Label>
          </div>
          <Switch
            id="showAll"
            checked={showAll}
            onCheckedChange={() => setShowAll(!showAll)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
