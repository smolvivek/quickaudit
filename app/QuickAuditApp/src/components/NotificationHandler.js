import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';
import {setNotification} from '../redux/slices/notificationSlice';

const NotificationHandler = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Handle foreground messages
      const {notification, data} = remoteMessage;

      // Update Redux store
      dispatch(
        setNotification({
          title: notification?.title || 'New Notification',
          body: notification?.body || '',
          data: data || {},
          timestamp: new Date().toISOString(),
        }),
      );

      // Show alert for foreground messages
      Alert.alert(
        notification?.title || 'New Notification',
        notification?.body || '',
        [
          {
            text: 'OK',
            onPress: () => {
              // Handle notification press
              if (data?.type === 'audit') {
                // Navigate to audit details
                // navigation.navigate('AuditDetails', { auditId: data.auditId });
              } else if (data?.type === 'action') {
                // Navigate to action details
                // navigation.navigate('ActionDetails', { actionId: data.actionId });
              }
            },
          },
        ],
      );
    });

    // Handle notification open app from background state
    messaging().onNotificationOpenedApp(remoteMessage => {
      const {data} = remoteMessage;
      if (data?.type === 'audit') {
        // Navigate to audit details
        // navigation.navigate('AuditDetails', { auditId: data.auditId });
      } else if (data?.type === 'action') {
        // Navigate to action details
        // navigation.navigate('ActionDetails', { actionId: data.actionId });
      }
    });

    // Handle notification open app from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const {data} = remoteMessage;
          if (data?.type === 'audit') {
            // Navigate to audit details
            // navigation.navigate('AuditDetails', { auditId: data.auditId });
          } else if (data?.type === 'action') {
            // Navigate to action details
            // navigation.navigate('ActionDetails', { actionId: data.actionId });
          }
        }
      });

    return unsubscribe;
  }, [dispatch]);

  return null;
};

export default NotificationHandler;
