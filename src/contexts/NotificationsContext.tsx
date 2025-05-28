import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { useSettings } from './SettingsContext';
import { useToast } from './ToastContext';
import { usePermissions } from './PermissionsContext';

interface Notification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: number;
  read: boolean;
}

interface NotificationsContextData {
  notifications: Notification[];
  unreadCount: number;
  requestPermission: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextData>(
  {} as NotificationsContextData
);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { settings } = useSettings();
  const { showToast } = useToast();
  const { checkAndRequestPermission } = usePermissions();

  const loadNotifications = useCallback(async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem(
        '@QuickAudit:notifications'
      );
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  const saveNotifications = useCallback(async (newNotifications: Notification[]) => {
    try {
      await AsyncStorage.setItem(
        '@QuickAudit:notifications',
        JSON.stringify(newNotifications)
      );
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    }
    return checkAndRequestPermission('notification');
  }, [checkAndRequestPermission]);

  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        showToast('Notification permission denied', 'warning');
        return null;
      }

      const token = await messaging().getToken();
      await AsyncStorage.setItem('@QuickAudit:fcmToken', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }, [requestPermission, showToast]);

  const markAsRead = useCallback(
    async (id: string): Promise<void> => {
      const updatedNotifications = notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      );
      await saveNotifications(updatedNotifications);
    },
    [notifications, saveNotifications]
  );

  const markAllAsRead = useCallback(async (): Promise<void> => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    await saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  const clearNotifications = useCallback(async (): Promise<void> => {
    await saveNotifications([]);
  }, [saveNotifications]);

  useEffect(() => {
    loadNotifications();

    const unsubscribe = messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      if (!settings.notifications.enabled) {
        return;
      }

      const newNotification: Notification = {
        id: remoteMessage.messageId || Date.now().toString(),
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data,
        timestamp: Date.now(),
        read: false,
      };

      const updatedNotifications = [newNotification, ...notifications];
      await saveNotifications(updatedNotifications);

      if (settings.notifications.sound) {
        // TODO: Play notification sound
      }

      if (settings.notifications.vibration) {
        // TODO: Trigger vibration
      }
    });

    return () => {
      unsubscribe();
    };
  }, [
    loadNotifications,
    saveNotifications,
    notifications,
    settings.notifications,
  ]);

  const unreadCount = notifications.filter((notification) => !notification.read)
    .length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        requestPermission,
        getToken,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextData => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationsProvider'
    );
  }

  return context;
}; 