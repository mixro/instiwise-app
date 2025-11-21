import "../global.css"
import { useEffect, useState } from "react";
import * as Font from 'expo-font';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { ThemeProvider, useTheme } from "@/src/context/ThemeContext";
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Image, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes } from "@/src/constants/themes";
import Sidebar from "@/src/components/navigation/sidebar";
import { store } from '@/store';
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { setupNotificationHandlers } from "@/src/services/notificationConfig";
import { useEventNotification } from "@/src/hooks/useEventNotification";

export default function RootLayout() {
  const { theme } = useTheme();
  const [fontLoaded, setFontLoaded] = useState(false);

  // Event notification handler
  useEffect(() => {
    setupNotificationHandlers();
  }, []);
  useEventNotification();
  
  // font (Poppins)
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
    return null; 
  }


  return (
    <Provider store={store}>
      <ThemeProvider>
        <StatusBar style="auto" />
        
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

          {/* PUBLIC SCREENS */}
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
            name="setupUsername"
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
        </Drawer>
      </ThemeProvider>
    </Provider>
  );
}


function DrawerContent(props: any) {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === themes.dark;

  return (
    <View style={{ flex: 1, paddingTop: 40, backgroundColor: theme.secondary_background, position: "relative" }}>
      <View className="flex-row items-center gap-2 p-4 pb-10" style={{ borderBottomWidth: 1, borderBottomColor: theme.border }}>
        <Image 
          source={require('@/assets/images/instiwise-logo.png')}
          style={styles.logo}
        />
        <Text style={[{ color: theme.text }, { fontSize: 23,fontWeight: 600 }]}>INSTiWISE</Text>
      </View>
      <DrawerContentScrollView style={{position: "relative"}}>
        <Sidebar />

        <View className="py-4 pr-0 flex-row justify-between items-center" style={{ borderTopWidth: 1, borderTopColor: theme.border }}>
          <Text style={{ color: theme.icons }} className="text-lg font-bold">{isDarkMode ? "Light mode" : "Dark Mode"}</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#2E7D32' }} 
            thumbColor={isDarkMode ? '#FFFFFF' : '#F4F3F4'}
          />
        </View>
      </DrawerContentScrollView>
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