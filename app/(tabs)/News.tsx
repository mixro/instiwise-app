import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import NewsCard from '@/src/components/ui/NewsCard';
import SearchBar from '@/src/components/ui/SearchBar';
import { useGetNewsQuery } from '@/src/services/newsApi';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function News() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: news = [], isLoading, isFetching, error, refetch } = useGetNewsQuery();

  const handleSearch = (text: string) => {
    setSearchQuery(text.toLowerCase()); // Convert to lowercase for case-insensitive search
  };

  // Sort: newest first
  const sortedAndFilteredNews = useMemo(() => {
    const filtered = searchQuery
      ? news.filter(
          (item) =>
            item.header.toLowerCase().includes(searchQuery) ||
            item.desc.toLowerCase().includes(searchQuery)
        )
      : news;

    return [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [news, searchQuery]);

  const onRefresh = () => {
    refetch();
  };

  // Auto-refetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch(); 
    }, [refetch])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.blue_text} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}>Failed to load news.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-3'>
      <FlatList 
        data={sortedAndFilteredNews}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <NewsCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ margin: 0 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading} // Show spinner only during refetch
            onRefresh={onRefresh}
            colors={[theme.blue_text]}
            tintColor={theme.blue_text}
          />
        }
        ListHeaderComponent={
          <>
            <View className='pt-7 px-1'>
              <SearchBar
                placeholder='Search news'
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>
          </>
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-4">
            <Ionicons name="alert-circle-outline" size={40} color={theme.text} />
            <Text className="text-center text-lg mt-2" style={{ color: theme.text }}>
              No news found matching your search.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}