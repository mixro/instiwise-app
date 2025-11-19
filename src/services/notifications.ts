import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

const EVENT_REMINDER_TASK = 'event-reminder-task';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(EVENT_REMINDER_TASK, ({ data }) => {
  const { eventId, header } = data as { eventId: string; header: string };

  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Event starting soon!',
      body: header,
      sound: true,
      data: { screen: 'calendar', eventId },
    },
    trigger: null, // fire immediately
  });
});

export const registerBackgroundTask = async () => {
  await Notifications.registerTaskAsync(EVENT_REMINDER_TASK);
};