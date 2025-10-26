import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/context/ThemeContext';
import { Link } from 'expo-router';
import { projects } from '@/src/static/dummyData';
import ProjectCard from '@/src/components/ui/ProjectCard';
import { Ionicons } from '@expo/vector-icons';
import ProfileBar from '@/src/components/navigation/profilebar';
import { useAuth } from '@/src/hooks/useAuth';

export default function Profile() {
  const { theme } = useTheme();
  const { user } = useAuth();

  console.log(user)

  return (
    <SafeAreaView edges={['top']} 
      style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-3'
    >
      <FlatList
        data={projects.slice(0,4)}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <ProjectCard project={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ margin: 0 }}
        ListHeaderComponent={
          <>
            <View className='pt-3 px-1'>
              <ProfileBar />

              <View className='flex-row items-start gap-4 pt-4'>
                <View style={{borderColor: theme.text}} className="rounded-full p-0.5 border border-2 flex-row items-center justify-center">
                  <Image
                    source={{ uri:  'https://www.pngkey.com/png/full/157-1579943_no-profile-picture-round.png' }}
                    style={styles.profileImg}
                  />
                </View>
                <View className='flex-1'>
                  <Text className='font-bold mb-2' style={{color: theme.text, fontSize: 20}}>{user?.username}</Text>
                  <View className='flex-row items-center flex-1'>
                    <View style={styles.metrics}>
                      <View className='flex-column items-center'>
                        <Text className='text-3xl' style={{color: theme.text}}>{user?.projectsCount}</Text>
                        <Text className='text-lg' style={{color: theme.text}}>Projects</Text>
                      </View>
                    </View>
                    <View style={styles.metrics}>
                      <View className='flex-column items-center'>
                        <Text className='text-3xl' style={{color: theme.text}}>0</Text>
                        <Text className='text-lg' style={{color: theme.text}}>Awards</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View className='pt-4'>
                <Text className='text-xl font-bold mb-2' style={{color: theme.blue_text}}>Bio</Text>
                <Text style={{fontSize: 15, color: theme.text}}>⚙️ Engineer | Innovator | Problem Solver {'\n'}Building ideas that move the future. {'\n'}🔗 Turning concepts into real solutions.</Text>
              </View>

              <View className='flex-row pt-6 pb-10 justify-between'>
                <View style={styles.button}>
                  <Link href="/user/personalDetails" asChild>
                    <TouchableOpacity className='flex-row justify-center p-2 rounded-md' style={{backgroundColor: theme.green_text, width: "100%"}}>
                      <Text className='text-white' style={{fontSize: 15}}>Edit profile</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
                <View style={styles.button}>
                  <Link href="/projects/create" asChild>
                    <TouchableOpacity className='flex-row justify-center p-2 rounded-md' style={{backgroundColor: theme.green_text, width: "100%"}}>
                      <Text className='text-white' style={{fontSize: 15}}>Create project</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>

              <View className='flex-row items-center gap-3  mb-6'>
                <Ionicons name="folder" color={theme.text} size={28} />
                <Text className='text-lg font-bold' style={{color: theme.blue_text}}>YOUR PROJECTS</Text>
              </View>
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
  )
}

const styles = StyleSheet.create({
  profileImg: {
    width: 85,
    height: 85,
    borderRadius: 100,
  },
  metrics: {
    width: "45%",
    alignItems: "flex-start"
  },
  button: {
    width: "48%",
  }
})