// File: src/services/notificationConfig.ts (The file containing your setup logic)

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const setupNotificationHandlers = () => {
  // Set handler for foreground notification display
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const isEventReminder = notification.request.content.data.screen === 'calendar';
      return {
        shouldShowAlert: !isEventReminder,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true, 
        shouldShowList: true,
      };
    },
  });

  // Configure the channel for Android (Good practice)
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'InstiWise Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00a86b',
      sound: 'default',
      enableVibrate: true,
    });
  }
};