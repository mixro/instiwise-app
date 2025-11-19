import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager'; 

const EVENT_REMINDER_TASK = 'event-reminder-task' as const;

interface EventReminderTaskData {
  eventId: string;
  header: string;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,
  }),
});

TaskManager.defineTask<EventReminderTaskData>(EVENT_REMINDER_TASK, async ({ data }) => {
  // Use a try/catch block which is standard practice for async background tasks
  try {
    const { eventId, header } = data; // Data type is now inferred from the generic <EventReminderTaskData>

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Event starting soon!',
        body: header,
        sound: true,
        data: { screen: 'calendar', eventId },
      },
      trigger: null, // fire immediately
    });
    
    // Task manager expects a clean exit
  } catch (error) {
    console.error(`Task ${EVENT_REMINDER_TASK} failed:`, error);
    // You might throw an error or handle it here, but generally, just logging is fine.
  }
});

export const registerBackgroundTask = async () => {
  // Check if the task is already registered to prevent errors
  if (!(await TaskManager.isTaskRegisteredAsync(EVENT_REMINDER_TASK))) {
    await Notifications.registerTaskAsync(EVENT_REMINDER_TASK);
  }
};