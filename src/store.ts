import { create } from 'zustand';

export type StoreType = {
  deviceId: string | null;
  setDeviceId: (id: string) => void;
};

export const useStore = create<StoreType>((set) => ({
  deviceId: null,
  setDeviceId: (id) => set({ deviceId: id }),
}));
