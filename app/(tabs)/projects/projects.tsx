import { View, Text, FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { projects } from '@/src/static/dummyData';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProjectCard from '@/src/components/ui/ProjectCard';
import SearchBar from '@/src/components/ui/SearchBar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';
import { ProjectsItem } from '../../../src/interfaces/interfaces';

export default function Projects() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortOption, setSortOption] = useState<'title' | 'category' | 'status' | 'createdAt' | 'likes'>('title');

  const handleSearch = (text: string) => {
    setSearchQuery(text.toLowerCase());
  };

  const filteredProjects = searchQuery
    ? projects.filter((item) =>
        item.title.toLowerCase().includes(searchQuery) ||
        item.owner?.toLowerCase().includes(searchQuery)
      )
    : projects;

  const handleSortPress = () => {
    setSortMenuVisible((prev) => !prev);
  };

  const handleSortSelect = (option: 'createdAt' | 'category' | 'title' | 'status' | 'likes') => {
    setSortOption(option);
    setSortMenuVisible(false);
  };

  const compareValues = (a: any, b: any) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  };

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortOption) {
      case 'createdAt':
        return compareValues(new Date(a.createdAt || '').getTime(), new Date(b.createdAt || '').getTime());
      case 'category':
        return compareValues(a.category.toLowerCase(), b.category.toLowerCase());
      case 'title':
        return compareValues(a.title.toLowerCase(), b.title.toLowerCase());
      case 'status':
        return compareValues(a.status || '', b.status || '');
      case 'likes':
        return compareValues((a.likes?.length || 0), (b.likes?.length || 0));
      default:
        return 0;
    }
  });

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-3 pt-5'>
      {sortMenuVisible && (
        <View className="absolute border right-2 dark:bg-gray-800 p-3 rounded-lg shadow-md z-10"
          style={{ top: 110, borderColor: "#464646ff", backgroundColor: "white"}}
        >
          <TouchableOpacity onPress={() => handleSortSelect('createdAt')} className="py-2">
            <Text className="text-gray-900 dark:text-gray-100">Sort by Date</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSortSelect('category')} className="py-2">
            <Text className="text-gray-900 dark:text-gray-100">Sort by Category</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSortSelect('title')} className="py-2">
            <Text className="text-gray-900 dark:text-gray-100">Sort by Title</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSortSelect('status')} className="py-2">
            <Text className="text-gray-900 dark:text-gray-100">Sort by Status</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSortSelect('likes')} className="py-2">
            <Text className="text-gray-900 dark:text-gray-100">Sort by Likes</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={sortedProjects}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <ProjectCard project={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ margin: 0 }}
        ListHeaderComponent={
          <>
            <View className='flex-row justify-between gap-2 items-center'>
              <View className='flex-1'>
                <SearchBar
                  placeholder='Search projects'
                  value={searchQuery}
                  onChangeText={handleSearch}
                />
              </View>
              <TouchableOpacity onPress={handleSortPress}>
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