// src/components/RequireAuth.tsx
import { useAuth } from '@/src/hooks/useAuth';
import { Redirect } from 'expo-router';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useTheme } from '@/src/context/ThemeContext';

type Props = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.green_text} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}