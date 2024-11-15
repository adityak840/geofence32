import { create } from 'zustand';

type Alert = {
  message: string;
  type: 'alert' | 'location';
};

export type StoreType = {
  deviceId: string | null;
  setDeviceId: (id: string) => void;
  showAll: boolean;
  setShowAll: (showAll: boolean) => void;
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  clearAlerts: () => void;
  resetDeviceId: () => void;
};

export const useStore = create<StoreType>((set) => ({
  deviceId: null,
  showAll: false,
  setDeviceId: (id) => set({ deviceId: id }),
  setShowAll: (showAll) => set({ showAll }),
  alerts: [] as Alert[],
  addAlert: (alert: Alert) =>
    set((state) => ({ alerts: [alert, ...state.alerts] })),
  clearAlerts: () => set({ alerts: [] }),
  resetDeviceId: () => set({ deviceId: null }),
}));
