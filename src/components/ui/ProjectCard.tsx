import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { ProjectsItem } from '@/src/interfaces/interfaces'
import { useTheme } from '@/src/context/ThemeContext';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useLikeProjectMutation } from '@/src/services/projectsApi';
import { useAppSelector } from '@/store/hooks';
import * as Haptics from 'expo-haptics';


export default function ProjectCard({ project } : {project: ProjectsItem} ) {
    const { theme } = useTheme();
    const [likeProject, { isLoading: islikeLoading }] = useLikeProjectMutation();
    const userId = useAppSelector(state => state.auth.currentUser?._id);
    const pending = useAppSelector(state => state.projects.likesPending[project._id]);
    const optimisticLiked = useAppSelector(state => state.projects.optimisticLikes[project._id]);

    const isLiked = optimisticLiked ?? (userId ? (project.likes ?? []).includes(userId) : false);
    const disabled = pending || islikeLoading;

    const handleLike = () => {
        if (!userId || pending || islikeLoading) return;
        Haptics.selectionAsync();
        likeProject(project._id);
    };

  return (
    <View
        style={[{backgroundColor: theme.event_card, position: "relative"}, styles.container]}
    >
        <Link href={`/projects/${project._id}`} asChild>
            <Pressable>
                <Image source={{ uri: project.img }}
                    className="w-full"
                    style={styles.image}
                    resizeMode="cover"
                />
            </Pressable>
        </Link>
        <View className='p-2'>
            <View className='flex-row items-center' style={{paddingTop: 5}}>
                <View className='flex-row flex-1' style={{gap: 10}}>
                    <Image
                        source={{ uri: project.userId?.img || 'https://www.pngkey.com/png/full/157-1579943_no-profile-picture-round.png' }}
                        style={styles.profileImg}
                    />
                    <View>
                        <Text className='' style={{ color: theme.text, fontSize: 16 }}>
                            {project.userId.username}
                        </Text>
                        <Text className="text-sm" style={{ color: theme.blue_text }}>
                            {moment(project.createdAt).fromNow()}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity activeOpacity={0.85} onPress={handleLike} disabled={disabled}>
                    {isLiked 
                        ? <Ionicons name="heart-sharp" size={40} color="red" />
                        : <Ionicons name="heart-outline" size={40} color="red" />
                    }                    
                </TouchableOpacity>
            </View>
            <Text className="text-xl font-bold mt-3 text-gray-900 dark:text-gray-100" style={{ color: theme.text }}>
                {project.title}
            </Text>

            <Text className="mt-2 text-base leading-relaxed" style={{ color: theme.dark_text }}>
                {project.description}
            </Text>

            <View className="flex-row justify-between items-center" style={{paddingTop: 10}}>
                <View className="flex-row" style={{ gap: 5}}>
                    <Text className="font-semibold" style={{ color: theme.text}}>
                        Likes:
                    </Text>
                    <Text className="font-medium">
                        {project.likes?.length || 0}
                    </Text>
                </View>
                <View className="px-3" 
                    style={{backgroundColor: "#2E7D32", borderRadius: 4}}
                >
                    <Text className='text-sm' style={{color: "white", marginVertical: 2}}>
                        {project.category || 'N/A'}
                    </Text>
                </View>
            </View>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
    borderColor: '#868686ff',
  },
  image: {
    aspectRatio: 1/0.55,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  profileImg: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },
});