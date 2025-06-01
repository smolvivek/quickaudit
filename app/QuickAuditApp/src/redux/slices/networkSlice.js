import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isConnected: true,
  isInternetReachable: true,
  type: null,
  lastSync: null,
  pendingSyncCount: 0,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworkStatus: (state, action) => {
      state.isConnected = action.payload.isConnected;
      state.isInternetReachable = action.payload.isInternetReachable;
      state.type = action.payload.type;
    },
    setLastSync: (state, action) => {
      state.lastSync = action.payload;
    },
    setPendingSyncCount: (state, action) => {
      state.pendingSyncCount = action.payload;
    },
    incrementPendingSyncCount: state => {
      state.pendingSyncCount += 1;
    },
    decrementPendingSyncCount: state => {
      state.pendingSyncCount = Math.max(0, state.pendingSyncCount - 1);
    },
  },
});

export const {
  setNetworkStatus,
  setLastSync,
  setPendingSyncCount,
  incrementPendingSyncCount,
  decrementPendingSyncCount,
} = networkSlice.actions;

export default networkSlice.reducer;
