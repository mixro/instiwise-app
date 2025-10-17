import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/src/context/ThemeContext';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useDrawerStatus } from '@react-navigation/drawer';

export default function Topbar() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const isDrawerOpen = useDrawerStatus() === 'open';

  return (
    <View className="flex-row" style={styles.topbar}>
        <Text style={[{ color: theme.text }, styles.logo]}>
          INSTiWISE
        </Text>
        <TouchableOpacity onPress={() => (
          isDrawerOpen
            ? navigation.dispatch(DrawerActions.closeDrawer())
            : navigation.dispatch(DrawerActions.openDrawer())
        )}>
          <Ionicons name="menu" size={30} color={theme.text} />
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  topbar: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8
  },
  logo: {
    fontWeight: "600",
    fontSize: 20,
  }
})