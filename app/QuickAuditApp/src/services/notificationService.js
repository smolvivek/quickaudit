import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {apiService} from './apiService';

class NotificationService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    try {
      if (this.initialized) {
        return;
      }

      // Request permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('User notification permission denied');
        return;
      }

      // Get FCM token
      const token = await messaging().getToken();
      await this.updateFcmToken(token);

      // Listen for token refresh
      messaging().onTokenRefresh(async newToken => {
        await this.updateFcmToken(newToken);
      });

      // Handle foreground messages
      messaging().onMessage(async remoteMessage => {
        // Handle foreground message
        console.log('Received foreground message:', remoteMessage);
      });

      // Handle background/quit state messages
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Received background message:', remoteMessage);
      });

      this.initialized = true;
    } catch (error) {
      console.error('Notification service initialization error:', error);
      throw error;
    }
  }

  async updateFcmToken(token) {
    try {
      // Save token locally
      await AsyncStorage.setItem('fcm_token', token);

      // Update token on server
      await apiService.post('/notifications/update-token', {token});
    } catch (error) {
      console.error('FCM token update error:', error);
    }
  }

  async subscribeToTopic(topic) {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error('Topic subscription error:', error);
    }
  }

  async unsubscribeFromTopic(topic) {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error('Topic unsubscription error:', error);
    }
  }

  async getBadgeCount() {
    try {
      return await messaging().getBadgeCount();
    } catch (error) {
      console.error('Get badge count error:', error);
      return 0;
    }
  }

  async setBadgeCount(count) {
    try {
      await messaging().setBadgeCount(count);
    } catch (error) {
      console.error('Set badge count error:', error);
    }
  }

  async cleanup() {
    try {
      // Unsubscribe from all topics
      const topics = ['audits', 'actions', 'updates'];
      await Promise.all(topics.map(topic => this.unsubscribeFromTopic(topic)));

      // Clear badge count
      await this.setBadgeCount(0);
    } catch (error) {
      console.error('Notification service cleanup error:', error);
    }
  }
}

export const notificationService = new NotificationService();
