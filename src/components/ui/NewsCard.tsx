import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NewsItem } from '@/src/interfaces/interfaces';
import moment from "moment";
import { useDislikeNewsMutation, useLikeNewsMutation, useViewNewsMutation } from '@/src/services/newsApi';
import { clearInteractionError } from '@/store/slices/newsSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import * as Haptics from 'expo-haptics';


export default function NewsCard({ item } :  {item: NewsItem}) {
  const { theme } = useTheme();
  const userId = useAppSelector((state) => state.auth.currentUser?._id);
  const dispatch = useAppDispatch();
  const [like, { isLoading: liking }] = useLikeNewsMutation();
  const [dislike, { isLoading: disliking }] = useDislikeNewsMutation();
  const [view] = useViewNewsMutation();

  const pending = useAppSelector((state) => state.news.pending[item._id]);
  const failed = useAppSelector((state) => state.news.error[item._id]);

  const hasViewed = userId ? item.views.includes(userId) : false;
  const hasLiked = userId ? item.likes.includes(userId) : false;
  const hasDisliked = userId ? item.dislikes.includes(userId) : false;
  const isPending = liking || disliking || !!pending;

  const handleLike = () => {
    Haptics.selectionAsync();
    like(item._id)
  };
  const handleDislike = () => {
    Haptics.selectionAsync();
    dislike(item._id)
  };

  const handleRetry = () => {
    dispatch(clearInteractionError(item._id));
    if (pending === 'like' || hasLiked) handleLike();
    else handleDislike();
  };

  // Trigger view once when card mounts
  useEffect(() => {
    if (userId && !hasViewed) {
      view(item._id);
    }
  }, [userId, hasViewed, item._id, view]);

  return (
    <View style={[{backgroundColor: theme.event_card}, styles.container]}>
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
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleLike}
            activeOpacity={1}
            disabled={isPending}
            style={{ flexDirection: 'row', width: 30, alignItems: 'center', gap: 6, opacity: isPending ? 0.9 : 1 }}
          >
            <MaterialIcons name="thumb-up" size={20} 
              color={hasLiked ? theme.red_button : theme.text}
            />
            <Text className="ml-1 text-gray-700 dark:text-gray-200 font-medium"
              style={{ color: theme.text }}
            >
              {item.likes.length}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleDislike}
            disabled={isPending}
            activeOpacity={1}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, opacity: isPending ? 0.9 : 1 }}
          >
            <MaterialIcons
              name="thumb-down"
              size={22}
              color={hasDisliked ? theme.red_button : theme.text}
            />
            <Text className="ml-1 text-gray-700 dark:text-gray-200 font-medium"
              style={{ color: theme.text }}
            >
              {item.dislikes.length}
            </Text>
          </TouchableOpacity>
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
      {failed && (
        <TouchableOpacity onPress={handleRetry} 
          style={{backgroundColor: theme.menu_button}}
        >
          <Text style={{ color: theme.red_button, fontSize: 12, marginVertical: 4, textAlign: 'center' }}>
            Failed to update. Tap to retry.
          </Text>
        </TouchableOpacity>
      )}
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