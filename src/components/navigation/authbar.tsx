import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTheme } from '@/src/context/ThemeContext';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function Authbar({page} : {page: string}) {
  const { theme } = useTheme();  

  return (
    <View style={{ backgroundColor: theme.background, height: "38%" }}>
        <View className='flex-row items-center gap-2 flex-1 justify-center' style={{ paddingTop: 50, paddingBottom: 35 }}>
            <Image 
                source={require('@/assets/images/instiwise-icon.png')}
                style={styles.logo}
            />
            <Text className='font-bold' 
                style={[{ color: theme.text }, { fontSize: 20 }]}
            >
                INSTiWISE
            </Text>
        </View>
    
        <View className='flex-column items-center'>
            <Text className='font-semibold mb-3' style={{ fontSize: 26, color: theme.text }}>Welcome to Instiwise</Text>
            <Text className='text-center' style={{ fontSize: 14.5, color: theme.text }}>Sign up or log in below to manage your{"\n"}account and access all news, events, etc</Text>
        </View>
    
        <View className='flex-row justify-between' style={{ paddingTop: 45 }}>
            <View style={{ width: "50%" }}>
            <Link href="/login" asChild>
                <TouchableOpacity className='flex-row items-center justify-center' style={page === "login" ? styles.active_button : styles.button}>
                <Text className='text-lg font-bold mb-2' style={{ color: theme.icons }}>Login</Text>
                </TouchableOpacity>
            </Link>
            </View>
            <View style={{ width: "50%" }}>
            <Link href="/signup" asChild>
                <TouchableOpacity className='flex-row items-center justify-center' style={page === "signup" ? styles.active_button : styles.button}>
                <Text className='text-lg font-bold mb-2' style={{ color: theme.icons }}>Sign Up</Text>
                </TouchableOpacity>
            </Link>
            </View>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    logo: {
        width: 45,
        height: 45,
    },
    button: {
        width: "100%",
        borderBottomWidth: 2.5,
        borderBottomColor: "transparent",
    },
    active_button: {
        width: "100%",
        borderBottomWidth: 2.5,
        borderBottomColor: "#126865ff",
    },
})