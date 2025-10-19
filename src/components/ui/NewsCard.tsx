import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NewsItem } from '@/src/interfaces/interfaces';
import moment from "moment";


export default function NewsCard({ item } :  {item: NewsItem}) {
  const { theme } = useTheme();

  return (
    <View
      style={[{backgroundColor: theme.event_card}, styles.container]}
    >
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100" style={{ color: theme.text }}>
        {item.header}
      </Text>
      <Text className='text-sm' style={{ color: theme.blue_text  }}>
        {moment(item.createdAt).fromNow()}
      </Text>

      <Text className="text-md text-gray-600 dark:text-gray-300 mb-2 mt-3 text-base leading-relaxed"
        style={{ color: theme.text }}
      >
        {item.desc}
      </Text>
            
      {item.img && <Image 
        source={{ uri: item.img}} 
        resizeMode="cover" 
        style={styles.image}
      />}

      <View className="flex-row" style={{gap: 35, marginTop: 10}}>
        <View className="flex-row items-center" style={{gap: 5}}>
          <MaterialIcons name="thumb-up" size={20} style={{ color: theme.icons }} />
          <Text className="ml-1 text-gray-700 dark:text-gray-200 font-medium"
            style={{ color: theme.text }}
          >
            {item.likes.length}
          </Text>
        </View>
        <View className="flex-row items-center" style={{gap: 5}}>
          <MaterialIcons name="thumb-down" size={20} style={{ color: theme.icons }} />
          <Text className="ml-1 text-gray-700 dark:text-gray-200 font-medium"
            style={{ color: theme.text }}
          >
            {item.dislikes.length}
          </Text>
        </View>
        <View className="flex-row items-center" style={{gap: 5}}>
          <Ionicons name="eye" size={20} style={{ color: theme.icons }} />
          <Text className="ml-1 text-gray-700 dark:text-gray-200 font-medium"
            style={{ color: theme.text }}
          >
            {item.views.length}
          </Text>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 20,
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
    width: "100%",
    aspectRatio: 1/0.7,
    borderRadius: 6,
    marginBottom: 4
  }
})