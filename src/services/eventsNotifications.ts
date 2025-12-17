// src/services/eventsNotifications.ts

import * as Notifications from 'expo-notifications';
import moment from 'moment';
import { EventItem } from '@/src/interfaces/interfaces';

const REMINDER_IDENTIFIER_PREFIX = 'event-reminder-';

export const schedule30MinReminder = async (event: EventItem) => {
  const identifier = `${REMINDER_IDENTIFIER_PREFIX}${event._id}`;

  // Parse event time — your format is perfect
  const eventDateTimeString = `${event.date} ${event.start}`;
  const eventMoment = moment(eventDateTimeString, 'DD/MM/YYYY hh:mm A');

  if (!eventMoment.isValid()) {
    console.log('Invalid event time:', eventDateTimeString);
    return;
  }

  // This is the exact fire time: 30 minutes before
  const reminderTime = eventMoment.clone().subtract(31, 'minutes');
  const reminderDate = reminderTime.toDate(); // ← Pure JS Date object

  const now = moment();

  // Skip if already passed
  if (reminderTime.isBefore(now)) {
    console.log('Skipped: reminder time is in the past');
    return;
  }

  const trigger = {
    type: 'date',
    date: reminderDate,
    repeats: false,
  } as Notifications.NotificationTriggerInput;

  try {
    await Notifications.scheduleNotificationAsync({
      identifier,
      content: {
        title: 'Event in 30 minutes!',
        body: `${event.header}\n${event.date} • ${event.start} – ${event.end || '??'} • ${event.location}`,
        sound: 'default',
        data: { screen: 'calendar', eventId: event._id },
      },
      trigger,
    });

    // console.log(`✅ SUCCESS: Reminder scheduled for \nEvent: ${event.header} \nTime: ${reminderTime.format('DD MMM YYYY, hh:mm A')} (30 min before event)`);
  } catch (error) {
    console.log('scheduleNotificationAsync failed:', error);
  }
};

export const cancelReminder = async (eventId: string) => {
  await Notifications.cancelScheduledNotificationAsync(REMINDER_IDENTIFIER_PREFIX + eventId);
  // console.log(`Reminder canceled for event ID: ${eventId}`);
};