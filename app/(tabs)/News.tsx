import { View, Text, FlatList } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/context/ThemeContext';
import { news } from '@/src/static/dummyData';
import { Ionicons } from '@expo/vector-icons';
import NewsCard from '@/src/components/ui/NewsCard';
import SearchBar from '@/src/components/ui/SearchBar';

export default function News() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (text: string) => {
    setSearchQuery(text.toLowerCase()); // Convert to lowercase for case-insensitive search
  };

  // Filter news based on search query
  const filteredNews = searchQuery
    ? news.filter((item) =>
        item.header.toLowerCase().includes(searchQuery) ||
        item.desc.toLowerCase().includes(searchQuery)
      )
    : news;

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-3'>
      <FlatList 
        data={filteredNews}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <NewsCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ margin: 0 }}
        ListHeaderComponent={
          <>
            <View className='pt-7'>
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