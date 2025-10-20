import { View, Text, TouchableOpacity, Image, FlatList, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { events } from '@/src/static/dummyData';
import EventCard from '@/src/components/ui/EventCard';
import Topbar from '@/src/components/navigation/topbar';
import { useTheme } from '@/src/context/ThemeContext';
import { LinearGradient } from "expo-linear-gradient";
import HomeStats from '@/src/components/ui/HomeStats';
import { Link } from 'expo-router';

export default function Index() {
  const { theme } = useTheme();

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-4'>
        <ScrollView showsVerticalScrollIndicator={false} style={{margin: 0, padding: 0}}>
            <Topbar />
                    
            <LinearGradient
                colors={["#0F8783", "#084442"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 8 }}
                className="flex-1 justify-center items-center mt-6 p-4 py-7"
            >
                <Text className="text-white text-2xl font-semibold text-center capitalize">Centralizing every</Text>
                <Text className="text-white text-2xl font-semibold text-center capitalize">piece of DIT information</Text>
            </LinearGradient>
            
            <HomeStats />

            <LinearGradient
                colors={["#0F8783", "#084442"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 8 }}
                className="flex-1 justify-center items-center mt-6 p-4 py-7"
            >
                <Text className='text-base text-primary-light mb-7'>Stay Informed Instantly</Text>
                <Text className="text-white text-2xl font-semibold text-center">Never Miss an Update</Text>
                <Text className="text-white text-2xl font-semibold text-center">DITSO Timeline News</Text>
                <Link href={'/(tabs)/news'} asChild>
                    <TouchableOpacity className="bg-gray-300 mt-8 p-2 px-7 rounded-full mx-auto">
                        <Text className="font-semibold text-sm">Explore news</Text>
                    </TouchableOpacity>
                </Link>
            </LinearGradient>

            <View>
                <Text className='mt-10 mb-6 text-2xl font-semibold uppercase' style={{ color: theme.text }}>Our Calendar</Text>

                {events.slice(0, 4).map((event) => (
                    <View key={event._id}>
                        <EventCard eventItem={event} />
                    </View>
                ))}

                <View className='mb-2'>
                    <Link href={'/(tabs)/calendar'} asChild>
                        <TouchableOpacity className="bg-[#0C6A67] mt-3 p-2 px-7 rounded-full mx-auto">
                        <Text className="font-semibold text-sm color-white">Explore events</Text>
                        </TouchableOpacity>
                    </Link>
                </View>

                <LinearGradient
                    colors={["#0F8783", "#084442"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 8 }}
                    className="flex-1 justify-center items-center my-7 p-4"
                >
                    <Text className='text-base text-primary-light mb-7'>Stay Informed Instantly</Text>
                    <Text className="text-white text-2xl font-semibold text-center">Discover What Our</Text>
                    <Text className="text-white text-2xl font-semibold text-center">Engineers Are Creating</Text>
                    <Link href={'/(tabs)/projects/projects'} asChild>
                        <TouchableOpacity className="bg-gray-300 mt-8 p-2 px-7 rounded-full mx-auto">
                        <Text className="font-semibold text-sm">Explore projects</Text>
                        </TouchableOpacity>
                    </Link>
                </LinearGradient>
            </View>
        </ScrollView>
    </SafeAreaView>
  );
}