import { View, Text, StyleSheet, Image, Touchable, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { ProjectsItem } from '@/src/interfaces/interfaces'
import { useTheme } from '@/src/context/ThemeContext';
import moment from 'moment';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function ProjectCard({ project } : {project: ProjectsItem} ) {
    const { theme } = useTheme();

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
                        source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
                        style={styles.profileImg}
                    />
                    <View>
                        <Text className='' style={{ color: theme.text, fontSize: 16 }}>
                            {project.owner}
                        </Text>
                        <Text className="text-sm" style={{ color: theme.blue_text }}>
                            {moment(project.createdAt).fromNow()}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Feather name="heart" size={30} color="red" />
                </TouchableOpacity>
            </View>
            <Text className="text-xl font-bold mt-3 text-gray-900 dark:text-gray-100" style={{ color: theme.text }}>
                {project.title}
            </Text>

            <Text className="text-gray-600 dark:text-gray-300 mt-2 text-base leading-relaxed" style={{ color: theme.text }}>
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