import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { EventItem } from '../../interfaces/interfaces';
import { useTheme } from '@/src/context/ThemeContext';
import { FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useToggleFavoriteMutation } from '@/src/services/eventsApi';
import { useAppSelector } from '@/store/hooks';

export default function EventCard({ eventItem, onFavorite, isFavorited: externalIsFavorited, }: { eventItem: EventItem; onFavorite?: () => void; isFavorited?: boolean;}) {
    const { theme } = useTheme();
    const [toggleFavorite, { isLoading }] = useToggleFavoriteMutation();
    const userId = useAppSelector((state) => state.auth.currentUser?._id);

    const isFavorited = externalIsFavorited ?? (userId ? (eventItem.favorites ?? []).includes(userId) : false);    

    const handlePress = () => {
      if (onFavorite) {
        onFavorite();
      } else if (userId) {
        toggleFavorite(eventItem._id);
      }
    };
  
  return (
    <View 
      className="bg-white border p-2 rounded shadow" 
      style={[{backgroundColor: theme.event_card}, styles.container]}
    >
        <View className="flex-row justify-between" style={{ paddingVertical: 2}}>
            <Text style={{ color: theme.text, fontSize: 14 }}>
              {eventItem.date}
            </Text>
            <TouchableOpacity onPress={handlePress} disabled={isLoading}>
              {isFavorited ? (
                <MaterialIcons name="star" size={27} color="#f39e00ff" />
              ) : (
                <MaterialIcons name="star-border" size={27} color="#f39e00ff" />
              )}
            </TouchableOpacity>
        </View>

        <View className='flex-row items-center gap-2 mb-2'>
          <MaterialCommunityIcons name="clock" size={16} color="#0a7975ff" />
          <Text style={{ color: theme.text, fontSize: 13 }}>{eventItem.start}</Text>
          <FontAwesome6 name="arrow-right" size={15} color="#0a7975ff" />
          <Text style={{ color: theme.text, fontSize: 13 }}>{eventItem.end}</Text>
        </View>

        <Text className="font-bold" style={{ color: theme.text, marginBottom: 15, fontSize: 18 }}>
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