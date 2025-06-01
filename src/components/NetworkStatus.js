import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { setNetworkStatus } from '../redux/slices/networkSlice';

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [bannerHeight] = useState(new Animated.Value(0));
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable;
      setIsConnected(connected);
      
      // Update Redux store
      dispatch(setNetworkStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type
      }));

      // Animate banner
      Animated.timing(bannerHeight, {
        toValue: connected ? 0 : 40,
        duration: 300,
        useNativeDriver: false
      }).start();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { height: bannerHeight }]}>
      <Text style={styles.text}>
        You are currently offline. Changes will be synced when you're back online.
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 1000,
    overflow: 'hidden'
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center'
  }
});

export default NetworkStatus; 