import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import { setOnline, setConnectionType } from '../store/networkSlice';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnlineLocal] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isConnected = state.isConnected && state.isInternetReachable;
      setIsOnlineLocal(isConnected);
      dispatch(setOnline(isConnected));
      dispatch(setConnectionType(state.type));
    });

    // Check initial state
    NetInfo.fetch().then((state) => {
      const isConnected = state.isConnected && state.isInternetReachable;
      setIsOnlineLocal(isConnected);
      dispatch(setOnline(isConnected));
      dispatch(setConnectionType(state.type));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return isOnline;
};
