import moment from 'moment';
import * as Notifications from 'expo-notifications';

interface EventItem {
  _id: string;
  header: string;
  date: string; // "DD/MM/YYYY"
  start: string; // "09:00 AM"
  end: string; // "09:00 AM"
}

const REMINDER_IDENTIFIER_PREFIX = 'event-reminder-';

export const useScheduleEventReminder = () => {
  const schedule30MinReminder = async (event: EventItem) => {
    // Cancel any previous reminder for this event
    await Notifications.cancelScheduledNotificationAsync(
      REMINDER_IDENTIFIER_PREFIX + event._id
    );

    // Date and time parsing
    const eventDateTimeString = `${event.date} ${event.start}`;
    const eventMoment = moment(eventDateTimeString, 'DD/MM/YYYY hh:mm A');

    // Calculate 30 minutes before
    const reminderMoment = eventMoment.clone().subtract(5, 'minutes');

    const now = moment();

    // 🔬 DEBUG STEP: Log all three times clearly
    console.log('--- Scheduling Check ---');
    console.log(`Event Time: ${eventMoment.format('LLL Z')}`);
    console.log(`Reminder Target: ${reminderMoment.format('LLL Z')}`);
    console.log(`Current Time: ${now.format('LLL Z')}`);

    if (reminderMoment.isBefore(now)) {
      console.log(`Reminder skipped: Target time ${reminderMoment.format('LLL')} is in the past.`);
      console.log('------------------------');
      return;
    }

    // Use a small buffer to skip race conditions, if desired.
    const timeUntilReminderMs = reminderMoment.diff(now);
    const timeUntilReminderSeconds = Math.max(0, Math.floor(timeUntilReminderMs / 1000));

    const bufferSeconds = 5; 
    if (timeUntilReminderSeconds < bufferSeconds) {
      console.warn(`Reminder skipped: Too close to schedule (${timeUntilReminderSeconds}s left). Buffer is ${bufferSeconds}s.`);
      console.log('------------------------');
      return;
    }

    const trigger = {
        seconds: timeUntilReminderSeconds,
        repeats: false, // Ensure it only runs once
    } as Notifications.NotificationTriggerInput;

    const detailedBody = 
        `${event.header}\n` +
        `Date: ${event.date} | Time: ${event.start} - ${event.end}`;
    
    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_IDENTIFIER_PREFIX + event._id, // ← Crucial!
      content: {
        title: 'Event in 30 minutes! ⏰',
        body: detailedBody,
        sound: 'default', 
        data: { screen: 'calendar', eventId: event._id },
      },
      trigger, 
    });

    // 🔬 DEBUG STEP 2: Confirmation
    console.log(`✅ Reminder scheduled for event ${event._id} in ${timeUntilReminderSeconds} seconds.`);
    console.log('------------------------');
  };

  const cancelReminder = async (eventId: string) => {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_IDENTIFIER_PREFIX + eventId);
  };

  return { schedule30MinReminder, cancelReminder };
};