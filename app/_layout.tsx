import "../global.css"
import { useEffect, useState } from "react";
import * as Font from 'expo-font';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes } from "@/src/constants/themes";
import { Link } from "expo-router";

export default function RootLayout() {
  const { theme } = useTheme();
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Regular': Poppins_400Regular,
        'Poppins-Medium': Poppins_500Medium,
        'Poppins-SemiBold': Poppins_600SemiBold,
        'Poppins-Bold': Poppins_700Bold,
      });
      setFontLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontLoaded) {
    return null; // or a loading screen
  }


  return (
    <ThemeProvider>
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: { backgroundColor: theme.background, width: '80%' },
          drawerActiveTintColor: theme.tabActiveTint,
          drawerInactiveTintColor: theme.tabInactiveTint,
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: 'Home',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="signup"
          options={{
            title: 'Sign Up',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="person-add" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="login"
          options={{
            title: 'Login',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="log-in" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: 'Settings',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
      </Drawer>
    </ThemeProvider>
  );
}


function DrawerContent(props: any) {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === themes.dark;

  return (
    <View style={{ flex: 1, paddingTop: 40, backgroundColor: theme.background, position: "relative" }}>
      <View className="flex-row items-center gap-2 p-4 pb-10" style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <Image 
          source={require('@/assets/images/instiwise-icon.png')}
          style={styles.logo}
        />
        <Text style={[{ color: theme.text }, { fontSize: 23,fontWeight: 600 }]}>INSTiWISE</Text>
      </View>
      <DrawerContentScrollView style={{position: "relative",}} {...props}>
        <DrawerItemList {...props} />

        <View className="p-4 pr-0 flex-row justify-between items-center" style={{ borderTopWidth: 1, borderTopColor: theme.border }}>
          <Text style={{ color: theme.text }}>{isDarkMode ? "Light mode" : "Dark Mode"}</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#2E7D32' }} 
            thumbColor={isDarkMode ? '#FFFFFF' : '#F4F3F4'}
          />
        </View>

      </DrawerContentScrollView>
      <View 
        style={{backgroundColor: "#d5e6d5ff"}}
        className="absolute bottom-[7%] left-4 w-[90%] rounded-lg p-1.5"
      >
        <Link href={'/(tabs)/profile'} asChild>
          <TouchableOpacity 
            className="flex-row items-center gap-2"
          >
            <View className="rounded-full p-0.5 border border-2 border-[#2E7D32] flex-row items-center justify-center">
              <Image
                source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
                style={styles.profileImg}
              />
            </View>
            <View>
              <Text style={{ fontSize: 15 }}>Christopher Chong</Text>
              <Text className="font-bold text-sm text-[#2E7D32]">Student</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
})