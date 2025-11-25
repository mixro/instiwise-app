import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { Href } from 'expo-router/build/types';

interface CustomLinkProps {
  path: Href; 
  title: string;
}

export default function Navbar({ path , title }: CustomLinkProps) {
  const { theme } = useTheme();

  const handlePress = () => {
    router.replace(path);
  };

  return (
    <View className="flex-row" style={styles.navbar}>
        <TouchableOpacity 
          onPress={handlePress}
        >
            <Ionicons name="arrow-back" size={26} color={theme.text} />
        </TouchableOpacity>
        <Text className='text-xl font-semibold' style={{color: theme.text}}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  navbar: {
    alignItems: "center",
    gap: 20,
    paddingVertical: 8,
    marginBottom: 10
  },
})