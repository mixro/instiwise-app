import { View, Text, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useCallback, useState } from 'react';
import { projects } from '@/src/static/dummyData';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProjectCard from '@/src/components/ui/ProjectCard';
import SearchBar from '@/src/components/ui/SearchBar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';
import { useFocusEffect } from 'expo-router';
import { RefreshControl } from 'react-native';
import { useGetProjectsQuery } from '@/src/services/projectsApi';

type SortOption = 'title' | 'category' | 'status' | 'createdAt' | 'likes';

export default function Projects() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  const { data: projects = [], isLoading, isFetching, refetch } = useGetProjectsQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = useCallback(() => {
    setIsManualRefresh(true);
    refetch().finally(() => setIsManualRefresh(false));
  }, [refetch]);

  const filteredAndSorted = React.useMemo(() => {
    let filtered = projects.filter(p =>
      p.title.toLowerCase().includes(searchQuery) ||
      (p.userId.username?.toLowerCase().includes(searchQuery) ?? false)
    );

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'createdAt':
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          return timeB - timeA;
        case 'likes':
          return (b.likes?.length || 0) - (a.likes?.length || 0);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        default:
          return 0;
      }
    });
  }, [projects, searchQuery, sortOption]);

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-3'>
      {sortMenuVisible && (
        <View className="absolute border right-2 dark:bg-gray-800 p-3 rounded-lg shadow-md z-10"
          style={{ top: 110, borderColor: "#464646ff", backgroundColor: "white"}}
        >
          {(['createdAt', 'title', 'category', 'status', 'likes'] as SortOption[]).map(opt => (
            <TouchableOpacity key={opt} onPress={() => { setSortOption(opt); setSortMenuVisible(false); }} className="py-2">
              <Text className="text-gray-900 dark:text-gray-100">
                Sort by {opt === 'createdAt' ? 'Date' : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <ProjectCard project={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ margin: 0 }}
        refreshControl={
          <RefreshControl 
            refreshing={isManualRefresh} 
            onRefresh={onRefresh} 
            colors={[theme.blue_text]} 
          />
        }
        ListHeaderComponent={
          <>
            <View className='flex-row justify-between gap-2 items-center pt-5'>
              <View className='flex-1 pl-1'>
                <SearchBar
                  placeholder='Search projects'
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity onPress={() => setSortMenuVisible(prev => !prev)}>
                <MaterialIcons name="sort" size={36} style={{ color: theme.text }} className='mb-7' />
              </TouchableOpacity>
            </View>
            
          </>
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-4">
            <Ionicons name="alert-circle-outline" size={40} color={theme.text} />
            <Text className="text-center text-lg mt-2" style={{ color: theme.text }}>
              No projects found matching your search.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}