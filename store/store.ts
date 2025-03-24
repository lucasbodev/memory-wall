import { create } from 'zustand';

interface StoreState {
    count: number;
}

const initialState: StoreState = {
    count: 0,
};

interface Store {
    count: number,
    setUpdatedCount: () => void;
}

export const useStore = create<Store>((set) => ({
    ...initialState,
    setUpdatedCount: (): void => {
        set((state : StoreState) => ({...state, count: state.count + 1}));
    }
}));
