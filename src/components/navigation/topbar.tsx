import { View, Text } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/src/context/ThemeContext';

export default function Topbar() {
    const { theme } = useTheme();

  return (
    <View className="flex-row justify-between items-center p-4" style={{ backgroundColor: theme.background }}>
        <Text className="text-2xl font-bold" style={{ color: theme.text }}>
          INSTIWISE
        </Text>
        <View className="flex-row">
          <Ionicons name="wifi" size={20} color={theme.text} style={{ marginRight: 8 }} />
          <Ionicons name="battery-full" size={20} color={theme.text} />
        </View>
    </View>
  )
}