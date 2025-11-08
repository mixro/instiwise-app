import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { EventItem } from '../../interfaces/interfaces';
import { useTheme } from '@/src/context/ThemeContext';
import { Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useToggleFavoriteMutation } from '@/src/services/eventsApi';
import * as Haptics from 'expo-haptics';

export default function EventCard({ eventItem }: { eventItem: EventItem }) {
    const { theme } = useTheme();
    const [toggleFavorite, { isLoading }] = useToggleFavoriteMutation();
    
    const handleFavorite = () => {
      Haptics.selectionAsync();
      toggleFavorite(eventItem._id);
    };
  
  return (
    <View 
      className="bg-white border p-2 rounded shadow" 
      style={[{backgroundColor: theme.event_card}, styles.container]}
    >
        <View className="flex-row justify-between" style={{ paddingVertical: 2}}>
            <Text className="text-sm" style={{ color: theme.text }}>
              {eventItem.date}
            </Text>
            <TouchableOpacity onPress={handleFavorite} disabled={isLoading}>
              {eventItem.isFavorite ? (
                <MaterialIcons name="star" size={26} color="#f39e00ff" />
              ) : (
                <MaterialIcons name="star-border" size={26} color="#f39e00ff" />
              )}
            </TouchableOpacity>
        </View>

        <View className='flex-row items-center gap-2 mb-2'>
          <Text>{eventItem.start}</Text>
          <Entypo name="arrow-long-right" size={20} color="#0a7975ff" />
          <Text>{eventItem.end}</Text>
        </View>

        <Text className="font-bold text-lg" style={{ color: theme.text, marginBottom: 6 }}>
          {eventItem.header}          
        </Text>

        <View className="flex-row items-center" style={{paddingBottom: 7}}>
            <Ionicons name="location" size={16} color="#0a7975ff" />
            <Text style={{ color: theme.text }}> {eventItem.location}</Text>
        </View>

        <View
          style={{ backgroundColor: "#0a7975ff",paddingLeft: 5, borderRadius: 3, paddingVertical: 1 }}
        >
          <Text className="text-sm" style={{ color: '#ffffffff' }}>
            {eventItem.category}
          </Text>

        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
  }
})