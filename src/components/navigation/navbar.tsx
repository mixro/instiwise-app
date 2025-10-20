import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

export default function Navbar({title} :{title: string}) {
    const router = useRouter();
    const { theme } = useTheme();

  return (
    <View className="flex-row" style={styles.navbar}>
        <TouchableOpacity onPress={router.back}>
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