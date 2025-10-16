import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calendarEvents } from '@/src/static/dummyData';
import EventCard from '@/src/components/ui/EventCard';
import Topbar from '@/src/components/navigation/topbar';
import { useTheme } from '@/src/context/ThemeContext';

export default function Index() {
  const { theme, toggleTheme } = useTheme();

  // Sample data (replace with API calls in a real app)
  const stats: { title: string; value: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
    { title: 'News', value: '134,348', icon: 'reader' },
    { title: 'Events', value: '145', icon: 'calendar' },
    { title: 'Projects', value: '1034', icon: 'folder' },
    { title: 'Users', value: '5000+', icon: 'people' },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: theme.background }}>
        <FlatList 
            data={calendarEvents}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <EventCard event={item} />}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <>
                    <Topbar />
                    <TouchableOpacity
                        className="p-2 mt-4 bg-green-600 rounded"
                        onPress={toggleTheme}
                    >
                        <Text style={{ color: theme.text }}>Switch Theme</Text>
                    </TouchableOpacity>
                    {/* Centralized Platform Banner */}
                    <View className="bg-green-700 p-4 rounded-lg mx-4 mb-4" style={{ backgroundColor: '#2E7D32' }}>
                        <Text className="text-white text-center text-lg font-semibold">
                        CENTRALIZED PLATFORM FOR ALL INFORMATION
                        </Text>
                    </View>

                    {/* Stats Section */}
                    <View className="flex-row flex-wrap justify-around p-4">
                        {stats.map((stat, index) => (
                        <View
                            key={index}
                            className="w-40 h-32 bg-white p-2 m-2 rounded-lg shadow"
                            style={{ backgroundColor: theme.background === '#FFFFFF' ? '#FFF' : '#2E3440' }}
                        >
                            <Ionicons name={stat.icon} size={24} color={theme.text} />
                            <Text className="text-xl font-bold mt-2" style={{ color: theme.text }}>
                            {stat.value}
                            </Text>
                            <Text className="text-sm" style={{ color: theme.text }}>
                            {stat.title}
                            </Text>
                        </View>
                        ))}
                    </View>

                    {/* Timeline News Section */}
                    <View className="bg-green-700 p-4 rounded-lg mx-4 mb-4" style={{ backgroundColor: '#2E7D32' }}>
                        <Text className="text-white text-center text-xl font-semibold mb-2">
                        STAY UPDATED WITH DITSO TIMELINE NEWS
                        </Text>
                        <TouchableOpacity className="bg-gray-300 p-2 rounded mx-auto">
                        <Text className="text-green-700">Explore news</Text>
                        </TouchableOpacity>
                    </View>
                </>
            }

            ListFooterComponent={
                <>
                    {/* Explore Projects Section */}
                    <View className="bg-green-700 p-4 rounded-lg mx-4 mt-4" style={{ backgroundColor: '#2E7D32' }}>
                        <Text className="text-white text-center text-xl font-semibold mb-2">
                        EXPLORE MORE PROJECTS FROM OUR ENGINEERS
                        </Text>
                        <TouchableOpacity className="bg-gray-300 p-2 rounded mx-auto">
                        <Text className="text-green-700">Explore Projects</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Footer */}
                    <Text className="text-center text-sm mt-4" style={{ color: theme.text }}>
                        INSTIWISE • 2025
                    </Text>
                </>
            }
        />
    </SafeAreaView>
  );
}