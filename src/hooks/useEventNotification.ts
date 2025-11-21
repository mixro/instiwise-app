import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Platform } from 'react-native';

export const useEventNotification = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      // 1. Request permission (only once)
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permission denied');
        return;
      }


      // 2. Android channel (recommended)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'InstiWise Alerts',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#00a86b',
          sound: 'default',
          enableVibrate: true,
        });
      }

      // 3. Global listener: when user taps a notification
      const subscription = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data as {
          screen?: string;
          eventId?: string;
        };

        // Handle event reminder tap
        if (data?.screen === 'calendar' && data.eventId) {
          router.replace({
            pathname: '/(tabs)/calendar',
            params: { highlightEventId: data.eventId }, // optional: use in Calendar screen
          });
        }

        // Future-proof: add more deep links here
        // e.g., projects, announcements, room changes, etc.
      });

      return () => subscription.remove();
    };

    const debugNotifications = async () => {
        if (__DEV__) {
            const scheduled = await Notifications.getAllScheduledNotificationsAsync();
            console.log('Scheduled notifications count:', scheduled.length);
            console.table(
                scheduled.map(n => ({
                    identifier: n.identifier,
                    title: n.content.title,
                    body: n.content.body,
                    trigger: n.trigger,
                    data: n.content.data,
                }))
            );
        }
    };
    setupNotifications();
    debugNotifications();
  }, []);
};