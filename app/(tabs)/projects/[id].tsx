import { View, Text, ScrollView, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { projects } from '@/src/static/dummyData';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/context/ThemeContext';
import ProjectDetails from '@/src/components/ui/ProjectDetails';
import moment from 'moment';

export default function project() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();

  const project = projects.filter((item) => item._id.toString().includes(id.toString()))[0];

  return (
    <SafeAreaView edges={['top']} 
      style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-3'
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={{paddingBottom: 0}}>
          <Text className='text-2xl font-bold' style={{color: theme.text, marginTop: 25}}>
            {project.title.toUpperCase()}
          </Text>

          <View className='pt-4 flex-row gap-5'>
            <Text className='px-3 text-sm text-white py-0.5 rounded-full capitalize'
              style={{backgroundColor: project.status === "completed" ? "#2E7D32" : project.status === "on hold" ? "#F9A825" : "#1976D2"}}
            >
              {project.status}
            </Text>
            <Text className='border-left ' style={[{color: theme.text, paddingLeft: 15}, styles.category]}>
              {project.category}
            </Text>
          </View>

          <View className="flex-row items-center gap-2" style={{ paddingTop: 36 }}>
            <View className="rounded-full p-0.5 border border-2 flex-row items-center justify-center"
              style={{borderColor: theme.text}}
            >
              <Image
                source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
                style={styles.profileImg}
              />
            </View>
            <View>
              <Text style={{ fontSize: 17, color: theme.text, marginBottom: 3 }}>{project.userId.username}</Text>
              <Text className="font-bold text-md" style={{color: theme.green_text}}>Student</Text>
            </View>
          </View>

          <View style={{paddingTop: 30}}>
            <Text className='text-xl font-semibold' style={{color: theme.blue_text, marginBottom: 10}}>Project Details</Text>
            <View className='flex-row gap-3' style={{marginBottom: 5}}>
              <Text className='font-bold text-lg' style={{color: theme.text}}>Likes:</Text>
              <Text className="text-lg" style={{color: theme.text}}>{project.likes?.length}</Text>
            </View>
            <View className='flex-row gap-3' style={{marginBottom: 5}}>
              <Text className='font-bold text-lg' style={{color: theme.text}}>Owner:</Text>
              <Text className="text-lg" style={{color: theme.text}}>{project.userId.username}</Text>
            </View>
            <View className='flex-row gap-3' style={{marginBottom: 5}}>
              <Text className='font-bold text-lg' style={{color: theme.text}}>Created at:</Text>
              <Text className="text-lg" style={{color: theme.text}}>{moment(project.createdAt).fromNow()}</Text>
            </View>
            <View className='flex-row gap-3' style={{marginBottom: 5}}>
              <Text className='font-bold text-lg' style={{color: theme.text}}>Category:</Text>
              <Text className="text-lg" style={{color: theme.text}}>{project.category}</Text>
            </View>
            <View className='flex-row gap-3' style={{marginBottom: 5}}>
              <Text className='font-bold text-lg' style={{color: theme.text}}>Problem:</Text>
              <Text className="text-lg" style={{color: theme.text}}>{project.problem}</Text>
            </View>
            <View className='flex-row gap-3' style={{marginBottom: 5}}>
              <Text className='font-bold text-lg' style={{color: theme.text}}>Duration:</Text>
              <Text className="text-lg" style={{color: theme.text}}>{project.duration}</Text>
            </View>
            <View className='flex-row gap-3' style={{marginBottom: 5}}>
              <Text className='font-bold text-lg' style={{color: theme.text}}>Status:</Text>
              <Text className="text-lg" style={{color: theme.text}}>{project.status}</Text>
            </View>
          </View>

          <View style={{paddingTop: 20}}>
            <Text className='text-xl font-semibold' 
              style={{color: theme.blue_text, marginBottom: 10}}
            >
              Project Description
            </Text>
            <View className='flex-row gap-3' style={{marginBottom: 5}}>
              <Text className="text-lg" style={{color: theme.text}}>{project.description}</Text>
            </View>
          </View>

          <ProjectDetails project={project} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  category: {
    borderLeftWidth: 2,
    borderColor: "#616161ff",
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
})