import * as Notifications from 'expo-notifications';

interface EventItem {
  _id: string;
  header: string;
  date: string; // "DD/MM/YYYY"
  start: string; // "09:00 AM"
}

export const useScheduleEventReminder = () => {
  const schedule30MinReminder = async (event: EventItem) => {
    const [day, month, year] = event.date.split('/').map(Number);
    const [time, period] = event.start.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    const eventDate = new Date(year, month - 1, day, hours, minutes);

    const trigger = new Date(eventDate.getTime() - 30 * 60 * 1000); // 30 mins before

    if (trigger < new Date()) return; // don't schedule past events

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Event in 30 minutes!',
        body: event.header,
        sound: true, // uses system default sound
        data: { screen: 'calendar', eventId: event._id },
      },
      trigger,
    });
  };

  return { schedule30MinReminder };
};