import { Redirect, Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import RequireAuth from '@/src/components/wrapper/RequireAuth';

export default function TabLayout() {
  const { theme } = useTheme();

  const tabOptions = {
    tabBarActiveTintColor: theme.tabActiveTint,
    tabBarInactiveTintColor: theme.tabInactiveTint,
    tabBarStyle: { backgroundColor: theme.tabBackground, borderTopWidth: 1, borderTopColor: theme.border },
    headerShown: false,
  };

  return (
    <RequireAuth>
      <Tabs screenOptions={tabOptions}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={20} />,
            tabBarLabel: ({ focused }) => (
              <Text
                className={focused ? 'font-bold' : ''}
                style={{ color: focused ? theme.tabActiveTint : theme.tabInactiveTint, fontSize: 12 }}
              >
                Home
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            title: 'News',
            tabBarIcon: ({ color }) => <Ionicons name="newspaper" color={color} size={20} />,
            tabBarLabel: ({ focused }) => (
              <Text
                className={focused ? 'font-bold' : ''}
                style={{ color: focused ? theme.tabActiveTint : theme.tabInactiveTint, fontSize: 12 }}
              >
                News
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => <Ionicons name="calendar" color={color} size={20} />,
            tabBarLabel: ({ focused }) => (
              <Text
                className={focused ? 'font-bold' : ''}
                style={{ color: focused ? theme.tabActiveTint : theme.tabInactiveTint, fontSize: 12 }}
              >
                Calendar
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="projects/projects"
          options={{
            title: 'Projects',
            href: '/(tabs)/projects/projects',
            tabBarIcon: ({ color }) => <Ionicons name="folder" color={color} size={20} />,
            tabBarLabel: ({ focused }) => (
              <Text
                className={focused ? 'font-bold' : ''}
                style={{ color: focused ? theme.tabActiveTint : theme.tabInactiveTint, fontSize: 12 }}
              >
                Projects
              </Text>
            ),
          }}
        />

        <Tabs.Screen
          name="projects/create"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="projects/update/[id]"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="projects/[id]"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="user/personalDetails"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="user/deleteAccount"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="user/password"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Ionicons name="person" color={color} size={20} />,
            tabBarLabel: ({ focused }) => (
              <Text
                className={focused ? 'font-bold' : ''}
                style={{ color: focused ? theme.tabActiveTint : theme.tabInactiveTint, fontSize: 12 }}
              >
                Profile
              </Text>
            ),
          }}
        />
      </Tabs>
    </RequireAuth>
  );
}