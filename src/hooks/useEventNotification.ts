import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { registerBackgroundTask } from '@/src/services/notifications';
import { router } from 'expo-router';

export const useEventNotification = () => {
  useEffect(() => {
    const setup = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      await registerBackgroundTask();

      const subscription = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data as {
          screen: string;
          eventId?: string;
        };

        if (data.screen === 'calendar') {
          router.replace('/(tabs)/calendar');
          // Optional: scroll to eventId using context or event emitter
        }
      });

      return () => subscription.remove();
    };

    setup();
  }, []);
};