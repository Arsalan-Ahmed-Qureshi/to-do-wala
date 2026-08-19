import { createSlice } from '@reduxjs/toolkit';

const networkSlice = createSlice({
  name: 'network',
  initialState: {
    isOnline: true,
    connectionType: 'unknown',
    signalStrength: 0,
  },
  reducers: {
    setOnline: (state, action) => {
      state.isOnline = action.payload;
    },
    setConnectionType: (state, action) => {
      state.connectionType = action.payload;
    },
    setSignalStrength: (state, action) => {
      state.signalStrength = action.payload;
    },
  },
});

export const { setOnline, setConnectionType, setSignalStrength } = networkSlice.actions;
export default networkSlice.reducer;
