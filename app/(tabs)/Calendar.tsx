import { View, Text, FlatList } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/src/context/ThemeContext';
import { events } from '@/src/static/dummyData';
import { Ionicons } from '@expo/vector-icons';
import { EventItem, CalendarItem } from '../../src/interfaces/interfaces';
import EventCard from '@/src/components/ui/EventCard';
import SearchBar from '@/src/components/ui/SearchBar';

export default function Calendar() {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text: string) => {
    setSearchQuery(text.toLowerCase()); // Convert to lowercase for case-insensitive search
  };

  // Function to parse date (DD/MM/YYYY)
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Filter out events prior to current date
  const currentDate = new Date('2025-10-18T16:26:00Z'); // Updated to current time
  const futureEvents = events.filter((event) => parseDate(event.date) >= currentDate);

  // Filter events based on search query
  const filteredEvents = searchQuery
    ? futureEvents.filter((event) =>
        event.title.toLowerCase().includes(searchQuery) ||
        event.location.toLowerCase().includes(searchQuery) ||
        event.category.toLowerCase().includes(searchQuery)
      )
    : futureEvents;

  // Group filtered events by month
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = parseDate(event.date);
    const monthKey = date.toLocaleString('default', { month: 'long' });
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(event);
    return groups;
  }, {} as { [key: string]: EventItem[] });

  // Sort events within each month by date
  Object.keys(groupedEvents).forEach((month) => {
    groupedEvents[month].sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
  });

  // Get current month
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });

  // Flatten events with month headers
  let flatData: CalendarItem[] = [];
  const months = Object.keys(groupedEvents).sort((a, b) => {
    const monthA = new Date(`1 ${a} 2025`).getMonth();
    const monthB = new Date(`1 ${b} 2025`).getMonth();
    return monthA - monthB;
  });

  // Move current month to top if it exists
  const currentMonthIndex = months.indexOf(currentMonth);
  if (currentMonthIndex > -1) {
    const [currentMonthData] = months.splice(currentMonthIndex, 1);
    months.unshift(currentMonthData);
  }

  months.forEach((month) => {
    flatData.push({ type: 'header', month, count: groupedEvents[month].length });
    flatData.push(...groupedEvents[month].map((event) => ({ ...event, type: 'event' } as CalendarItem)));
  });

  return (
   <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-3'>
     <FlatList
        data={flatData}
        keyExtractor={(item) => (item.type === 'header' ? `header-${(item as any).month}` : `event-${item._id}`)}
        ListHeaderComponent={
          <>
            <View className='px-1'>
              <View className='flex-row items-center gap-2 py-6'>
                <Text className='font-semibold text-2xl' style={{ color: theme.text }}>OUR CALENDAR</Text>
                <Text style={{ color: theme.text }}>(2025-2026)</Text>
              </View>
              <SearchBar 
                placeholder="Search event"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>
          </>
        }
        renderItem={({ item }) => {
          if (item.type === 'header') {
            const headerItem = item as Extract<CalendarItem, { type: 'header' }>;
            return (
              <View className="flex-row justify-between px-1 py-4">
                <Text className="text-xl font-semibold" style={{ color: theme.text }}>{headerItem.month}</Text>
                <Text style={{ color: theme.text }}>Events: <Text className='font-semibold'>{headerItem.count}</Text></Text>
              </View>
            );
          } else {
            const eventItem = item as Extract<CalendarItem, { type: 'event' }>;
            return (
              <EventCard eventItem={eventItem} />
            );
          }
        }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-4">
            <Ionicons name="alert-circle-outline" size={40} color={theme.text} />
            <Text className="text-center text-lg mt-2" style={{ color: theme.text }}>
              No events found matching your search.
            </Text>
          </View>
        }
        initialNumToRender={10}
        windowSize={5}
        showsVerticalScrollIndicator={false}
      />
   </SafeAreaView>
  )
}