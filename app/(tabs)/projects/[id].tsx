import { View, Text, ScrollView, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import React from 'react'
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { projects } from '@/src/static/dummyData';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/context/ThemeContext';
import ProjectDetails from '@/src/components/ui/ProjectDetails';
import moment from 'moment';
import * as Haptics from 'expo-haptics';
import { useAppSelector } from '@/store/hooks';
import { useGetProjectByIdQuery, useLikeProjectMutation } from '@/src/services/projectsApi';
import { Ionicons } from '@expo/vector-icons';

export default function project() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = useAppSelector(state => state.auth.currentUser?._id);

  const { data: project, isLoading, isFetching, refetch } = useGetProjectByIdQuery(id, {
    skip: !id,
    selectFromResult: ({ data, ...other }) => ({
      data,
      ...other,
    }),
  });

  const [likeProject, { isLoading: islikeLoading }] = useLikeProjectMutation();
  

  useFocusEffect(
    React.useCallback(() => {
      if (id) refetch();
    }, [id, refetch])
  );

  if (isLoading || !project) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.blue_text} />
      </SafeAreaView>
    );
  }

  const isLiked = userId ? (project.likes ?? []).includes(userId) : false;

  const handleLike = () => {
    Haptics.selectionAsync();
    if (userId) {
      likeProject(project._id);
    }
  };

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

          <View className='flex-row items-center justify-between' style={{ paddingTop: 36 }}>
            <View className="flex-row items-center gap-2">
              <View className="rounded-full p-0.5 border border-2 flex-row items-center justify-center"
                style={{borderColor: theme.text}}
              >
                <Image
                  source={{ uri: project.userId?.img || 'https://www.pngkey.com/png/full/157-1579943_no-profile-picture-round.png' }}
                  style={styles.profileImg}
                />
              </View>
              <View>
                <Text style={{ fontSize: 17, color: theme.text, marginBottom: 3 }}>{project.userId.username}</Text>
                <Text className="font-bold text-md" style={{color: theme.green_text}}>Student</Text>
              </View>
            </View>

            <View className='flex-row items-center justify-center'>
              <TouchableOpacity onPress={handleLike} disabled={islikeLoading}>
                  {isLiked 
                      ? <Ionicons name="heart-sharp" size={40} color="red" />
                      : <Ionicons name="heart-outline" size={40} color="red" />
                  }                    
              </TouchableOpacity>
            </View>
          </View>

          <View style={{paddingTop: 30}}>
            <Text className='text-xl font-semibold' style={{color: theme.blue_text, marginBottom: 10}}>
              Project Details
            </Text>

            <View className='flex-row gap-3' style={{marginBottom: 5}}>
              <Text className='font-bold text-lg' style={{color: theme.text}}>Likes:</Text>
              <Text className="text-lg" style={{color: theme.text}}>{project.likes?.length}</Text>
            </View>
            
            {[
              { label: 'Owner', value: project.userId.username },
              { label: 'Created', value: moment(project.createdAt).fromNow() },
              { label: 'Category', value: project.category },
              { label: 'Problem', value: project.problem },
              { label: 'Duration', value: project.duration },
              { label: 'Status', value: project.status },
            ].map((item, i) => (
              <View key={i} className='flex-row gap-3 mb-2'>
                <Text className='font-bold text-lg' style={{ color: theme.text }}>{item.label}:</Text>
                <Text className="text-lg" style={{ color: theme.text }}>{item.value || '—'}</Text>
              </View>
            ))}
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