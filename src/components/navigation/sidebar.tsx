import { View, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '@/src/context/ThemeContext';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth(); 
  const router = useRouter();

  const handleLogout = async () => {
    try {
        await signOut();
        router.replace('/login');
    } catch(error) {
        console.log('Logout error:', error);
    }
  }

  return (
    <View>
        <View style={{marginBottom: 20}}>
            <Link href='/(tabs)' className='mb-3'>
                <View className='flex-row items-center gap-5' style={[{backgroundColor: theme.menu_button}, styles.item]}>
                    <Ionicons name="home" color={theme.icons} size={24} />
                    <Text className='text-lg font-bold' style={{color: theme.darker_text}}>Home</Text>
                </View>
            </Link>
            <Link href='/(tabs)/news' className='mb-3'>
                <View className='flex-row items-center gap-5' style={[{backgroundColor: theme.menu_button}, styles.item]}>
                    <Ionicons name="newspaper" color={theme.icons} size={24} />
                    <Text className='text-lg font-bold' style={{color: theme.darker_text}}>News</Text>
                </View>
            </Link>
            <Link href='/(tabs)/calendar' className='mb-3'>
                <View className='flex-row items-center gap-5' style={[{backgroundColor: theme.menu_button}, styles.item]}>
                    <Ionicons name="calendar" color={theme.icons} size={24} />
                    <Text className='text-lg font-bold' style={{color: theme.darker_text}}>Calendar</Text>
                </View>
            </Link>
            <Link href='/(tabs)/projects/projects' className='mb-3'>
                <View className='flex-row items-center gap-5' style={[{backgroundColor: theme.menu_button}, styles.item]}>
                    <Ionicons name="folder" color={theme.icons} size={24} />
                    <Text className='text-lg font-bold' style={{color: theme.darker_text}}>Projects</Text>
                </View>
            </Link>
            <Link href='/(tabs)/settings' className='mb-3'>
                <View className='flex-row items-center gap-5' style={[{backgroundColor: theme.menu_button}, styles.item]}>
                    <Ionicons name="settings-sharp" color={theme.icons} size={24} />
                    <Text className='text-lg font-bold' style={{color: theme.darker_text}}>Settings</Text>
                </View>
            </Link>
        </View>
        
        <Text className='text-lg font-semibold mb-6' style={{color: theme.text}}>Authenticate</Text>

        <View style={{marginBottom: 20}}>
            <Link href='/login' className='mb-3'>
                <View className='flex-row items-center gap-5' style={[{backgroundColor: theme.menu_button}, styles.item]}>
                    <MaterialIcons name="login" size={24} color={theme.icons} />
                    <Text className='text-lg font-bold' style={{color: theme.darker_text}}>Login</Text>
                </View>
            </Link>
            <Link href='/signup' className='mb-3'>
                <View className='flex-row items-center gap-5' style={[{backgroundColor: theme.menu_button}, styles.item]}>
                    <Ionicons name="person-add-sharp" size={24} color={theme.icons} />
                    <Text className='text-lg font-bold' style={{color: theme.darker_text}}>Sign up</Text>
                </View>
            </Link>
            <TouchableOpacity activeOpacity={0.7} className='flex-row items-center gap-5' style={[{backgroundColor: "#fdc200ff"}, styles.item]}
                onPress={handleLogout}
            >
                <AntDesign name="logout" size={24} color="black" />
                <Text className='text-lg font-bold' style={{color: "black"}}>logout</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        width: "100%",
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 20
    }
})