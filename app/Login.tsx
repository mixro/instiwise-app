import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useLoginMutation } from '@/store/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '@/src/context/ThemeContext';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import Authbar from '@/src/components/navigation/authbar';
import { useAuth } from '@/src/hooks/useAuth';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  //const { user: currentUser, restoreAuth } = useAuth();
  const [login, { isLoading, error }] = useLoginMutation();
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Auto-redirect if already logged in
  React.useEffect(() => {
    //restoreAuth();
    if (currentUser) {
      router.replace('/(tabs)');
    }
  }, [currentUser]);

  const handleLogin = async () => {
    try {
      const result = await login({ email, password }).unwrap();
      
      // Save to Redux + SecureStore
      const userData = { ...result.user, accessToken: result.accessToken };
      dispatch(setCredentials(userData));
      await SecureStore.setItemAsync('instiwise_auth', JSON.stringify(userData));
      
      router.replace('/(tabs)');
    } catch (err: any) {
      console.log('Login error:', err);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Authbar page="login" />

          <View className="px-4 pt-9 pb-5" style={{ backgroundColor: "#ccccccff" }}>
            {/* Social Buttons */}
            <View>
              <TouchableOpacity
                className="flex-row items-center gap-2 px-2.5 mb-4"
                style={styles.input}
                disabled={isLoading}
              >
                <View className="w-10">
                  <MaterialIcons name="apple" size={32} color="#383838ff" />
                </View>
                <Text style={[{ color: theme.dark_text, marginVertical: 13 }, styles.inputText]}>
                  Sign in with Apple
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center gap-2 px-2.5"
                style={styles.input}
                disabled={isLoading}
              >
                <View className="w-10 pl-1">
                  <AntDesign name="google" size={25} color="#383838ff" />
                </View>
                <Text style={[{ color: theme.dark_text, marginVertical: 13 }, styles.inputText]}>
                  Sign in with Google
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-center font-bold mb-8 mt-8" style={{ fontSize: 17 }}>
              Or continue with email 
            </Text>

            {/* Email Input */}
            <View className="flex-row items-center gap-2 px-2.5 py-1 mb-4" style={styles.input}>
              <View className="w-8">
                <MaterialIcons name="email" size={26} color="#383838ff" />
              </View>
              <TextInput
                className="font-regular flex-1"
                style={styles.inputText}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={theme.dark_text}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            {/* Password Input */}
            <View className="flex-row items-center gap-2 px-2.5 py-1 mb-6" style={styles.input}>
              <View className="w-8">
                <MaterialIcons name="lock" size={27} color="#383838ff" />
              </View>
              <TextInput
                className="font-regular flex-1"
                style={styles.inputText}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={theme.dark_text}
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {(error as any)?.data?.message || 'Login failed. Please try again.'}
                </Text>
              </View>
            )}

            {/* Login Button */}
            <View className="pt-10">
              <TouchableOpacity
                onPress={handleLogin}
                style={{ backgroundColor: theme.green_button }}
                className="flex-row items-center justify-center p-3 rounded-md"
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading && <ActivityIndicator size="small" color="white" className="mr-2" />}
                <Text className="text-xl text-white font-semibold">
                  {isLoading ? 'Signing in...' : 'SIGN IN'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View className="pt-6 items-center pb-8">
              <Text className="text-center text-sm" style={{ color: theme.text }}>
                Don't have an account?{' '}
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text className="font-semibold text-blue-500">Sign up</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  input: {
    backgroundColor: '#ffffffff',
    borderRadius: 5,
  },
  inputText: {
    fontSize: 15,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    marginBottom: 16,
    padding: 12,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});