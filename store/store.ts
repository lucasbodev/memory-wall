import { create } from 'zustand';

interface StoreState {
    tooltipSeen: boolean;
}

const initialState: StoreState = {
    tooltipSeen: false,
};

interface Store {
    tooltipSeen: boolean,
    setTooltipSeen: () => void;
}

export const useStore = create<Store>((set) => ({
    ...initialState,
    setTooltipSeen: (): void => {
        set((state : StoreState) => ({...state, tooltipSeen: true}));
    }
}));
