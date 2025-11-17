// src/components/RequireAuth.tsx
import { useAuth } from '@/src/hooks/useAuth';
import { Redirect } from 'expo-router';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Text } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <SafeAreaView 
        style={{ flex: 1, paddingTop: 40, minHeight: "100%", backgroundColor: theme.secondary_background}}
      >
        <View 
          className='flex-column items-center justify-between' 
          style={{height: '100%', paddingBottom: '20%', paddingTop: '50%'}}
        >
          <View>
            <View className="flex-row items-center"
              style={{gap: 15}}
            >
              <Image 
                source={require('@/assets/images/instiwise-logo.png')}
                style={styles.logo}
              />
              <Text 
                style={{ color: theme.text, fontSize: 33,fontWeight: 700 }}
              >
                INSTiWISE
              </Text>
            </View>
          </View>

          <View>
            <Text className="text-2xl font-semibold" style={{color: theme.text}}>Seamless Scheduling</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}


const styles = StyleSheet.create({
  logo: {
    width: 65,
    height: 65
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
})