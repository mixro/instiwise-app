import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function ProfileBar() {
    const { theme } = useTheme();
    const navigation = useNavigation() as any;

  return (
    <View className="flex-row" style={styles.navbar}>
        <Text style={[{ color: theme.text }, styles.logo]}>
            Profile
        </Text>
        <View className='flex-row items-center' style={{gap: 15}}>
            <Link href="/projects/create" asChild>
                <TouchableOpacity>
                    <MaterialIcons name="add-box" size={29} color={theme.icons} />
                </TouchableOpacity>
            </Link>
            <Link href="/settings" asChild>
                <TouchableOpacity>
                    <Ionicons name="settings-sharp" size={28} color={theme.icons} />
                </TouchableOpacity>
            </Link>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  navbar: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  logo: {
    fontWeight: 500,
    fontSize: 22,
  }
})