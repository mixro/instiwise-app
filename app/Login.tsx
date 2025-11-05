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
import { useLoginMutation } from '@/src/services/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import { useTheme } from '@/src/context/ThemeContext';
import { useStorage } from '@/utils/useStorage';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Authbar from '@/src/components/navigation/authbar';
import { useAuth } from '@/src/hooks/useAuth';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user: currentUser } = useAuth();
  const { saveAuth } = useStorage();
  const [login, { isLoading, error }] = useLoginMutation();
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  

  // Auto-redirect if already logged in
  {/*React.useEffect(() => {
    if (currentUser) {
      router.replace('/(tabs)');
    }
  }, [currentUser]);*/}

  const handleLogin = async () => {
    try {
      const result = await login({ email, password }).unwrap();
      console.log('API Response:', result);
      
      // Save to Redux + SecureStore
      const userData = {
        ...result.data.user,
        accessToken: result.data.accessToken,
      }
      dispatch(setCredentials(userData)); 
      await saveAuth(userData);          
      
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
        <ScrollView contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
                <Text className='font-regular' style={[{ color: theme.dark_text, marginVertical: 13 }, styles.inputText]}>
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
                <Text className='font-regular' style={[{ color: theme.dark_text, marginVertical: 13 }, styles.inputText]}>
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
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#383838ff" />
              </TouchableOpacity>
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
                  {isLoading ? 'Signing in...' : 'LOGIN'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center items-center gap-1 pt-6 items-center pb-4">
              <Text className="text-md">
                Don't have an account?
              </Text>
              <TouchableOpacity className='flex-row items-center ' onPress={() => router.push('/signup')}>
                <Text className="font-semibold text-blue-600">Sign up</Text>
              </TouchableOpacity>
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
    paddingBottom: 0,
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