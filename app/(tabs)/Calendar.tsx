import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/src/context/ThemeContext';
import { events } from '@/src/static/dummyData';
import { Ionicons } from '@expo/vector-icons';
import { EventItem, CalendarItem } from '../../src/interfaces/interfaces';
import EventCard from '@/src/components/ui/EventCard';
import SearchBar from '@/src/components/ui/SearchBar';
import { ScrollView } from 'react-native';
import { useGetEventsQuery } from '@/src/services/eventsApi';
import { useFocusEffect } from 'expo-router';

type FilterType = 'all' | 'favourites' | 'ongoing' | 'upcoming' | 'past';

export default function Calendar() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  const { data: events = [], isLoading, isFetching, refetch } = useGetEventsQuery();

  // Auto-refetch on focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Pull-to-refresh
  const onRefresh = useCallback(() => {
    setIsManualRefresh(true);
    refetch().finally(() => setIsManualRefresh(false));
  }, [refetch]);

  // Helper to parse date "DD/MM/YYYY" to Date
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Helper to parse time "HH:MM AM/PM" to hours/minutes
  const parseTime = (timeStr: string): { hours: number; minutes: number } => {
    const [time, ampm] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (ampm === 'PM' && hours !== 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  };

  // Get full start/end Date for event
  const getEventStartEnd = (event: EventItem): { start: Date; end: Date } => {
    const date = parseDate(event.date);
    const startTime = parseTime(event.start);
    const endTime = parseTime(event.end);

    const start = new Date(date);
    start.setHours(startTime.hours, startTime.minutes, 0, 0);

    const end = new Date(date);
    end.setHours(endTime.hours, endTime.minutes, 0, 0);

    return { start, end };
  };

  // Filtered events based on activeFilter and search
  const filteredEvents = useMemo(() => {
    const now = new Date();

    let filtered = events.filter((event) => {
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        if (
          !event.header.toLowerCase().includes(lowerQuery) &&
          !event.location.toLowerCase().includes(lowerQuery) &&
          !event.category.toLowerCase().includes(lowerQuery)
        ) {
          return false;
        }
      }

      const { start, end } = getEventStartEnd(event);

      switch (activeFilter) {
        case 'favourites':
          return event.isFavorite;
        case 'ongoing':
          return start <= now && now <= end;
        case 'upcoming':
          return start > now;
        case 'past':
          return end < now;
        case 'all':
        default:
          return true;
      }
    });

    return filtered;
  }, [events, activeFilter, searchQuery]);

  // Group filtered events by month
  const groupedEvents = useMemo(() => {
    return filteredEvents.reduce((groups, event) => {
      const date = parseDate(event.date);
      const monthKey = date.toLocaleString('default', { month: 'long' });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(event);
      return groups;
    }, {} as { [key: string]: EventItem[] });
  }, [filteredEvents]);

  // Sort events within each month by date ascending
  const sortedGroupedEvents = useMemo(() => {
    const sorted = { ...groupedEvents };
    Object.keys(sorted).forEach((month) => {
      sorted[month].sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime());
    });
    return sorted;
  }, [groupedEvents]);

  // Flatten with headers
  const flatData: CalendarItem[] = useMemo(() => {
    let data: CalendarItem[] = [];
    const months = Object.keys(sortedGroupedEvents).sort((a, b) => {
      const monthA = new Date(`1 ${a} 2025`).getMonth();
      const monthB = new Date(`1 ${b} 2025`).getMonth();
      return monthA - monthB;
    });

    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentMonthIndex = months.indexOf(currentMonth);
    if (currentMonthIndex > -1) {
      const [current] = months.splice(currentMonthIndex, 1);
      months.unshift(current);
    }

    months.forEach((month) => {
      data.push({ type: 'header', month, count: sortedGroupedEvents[month].length });
      data.push(...sortedGroupedEvents[month].map((event) => ({ ...(event as EventItem), type: 'event' } as CalendarItem)));
    });

    return data;
  }, [sortedGroupedEvents]);

  if (isLoading && !isFetching) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.green_text} />
      </SafeAreaView>
    );
  }

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
                onChangeText={setSearchQuery}
              />

              <View className='pb-3'>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexDirection: 'row', gap: 10 }}
                >
                  {['all', 'favourites', 'ongoing', 'upcoming', 'past'].map((filter) => (
                    <TouchableOpacity 
                      key={filter}
                      onPress={() => setActiveFilter(filter as FilterType)}
                      style={{ 
                        backgroundColor: activeFilter === filter ? theme.gray_text : theme.menu_button, 
                        paddingVertical: 8, 
                        paddingHorizontal: 20, 
                        borderRadius: 50 
                      }}
                    >
                      <Text style={{ color: activeFilter === filter ? '#fff' : theme.text, fontWeight: 600 }}>
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <View className="flex-row justify-between px-1 py-4">
                <Text className="text-xl font-semibold" style={{ color: theme.blue_text }}>{item.month}</Text>
                <Text style={{ color: theme.text }}>Events: <Text className='font-semibold'>{item.count}</Text></Text>
              </View>
            );
          } else {
            return <EventCard eventItem={item} />;
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={isManualRefresh}
            onRefresh={onRefresh}
            colors={[theme.blue_text]}
            tintColor={theme.blue_text}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-4 pt-20">
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