import { View, Text, KeyboardAvoidingView, Dimensions, Platform, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/context/ThemeContext';
import { AntDesign, Entypo, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Authbar from '@/src/components/navigation/authbar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRegisterMutation } from '@/store/authApi';
import * as SecureStore from 'expo-secure-store';
import { setCredentials } from '@/store/slices/authSlice';
import { router } from 'expo-router';
const { height } = Dimensions.get('window');

export default function Signup() {
  const { theme } = useTheme();  
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [register, { isLoading, error }] = useRegisterMutation();
  
  // Form state
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState("");  
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifiedPassword, setShowVerifiedPassword] = useState(false);
  
  // Password validation
  const isValidPassword = (pwd: string) => pwd.length >= 6;
  const hasNumber = (pwd: string) => /\d/.test(pwd);
  const hasUpperLower = (pwd: string) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd);
  const passwordsMatch = password === verifiedPassword;

  const isFormValid =
    username.length >= 3 &&
    isValidPassword(password) &&
    hasNumber(password) &&
    hasUpperLower(password) &&
    passwordsMatch;

  const handleSignup = async () => {
    try {
      const result = await register({
        username,
        email,
        password,
      }).unwrap();

      // Auto-login after signup
      const userData = { ...result.user, accessToken: result.accessToken };
      dispatch(setCredentials(userData));
      await SecureStore.setItemAsync('instiwise-auth', JSON.stringify(userData));

      router.replace('/(tabs)');
    } catch (err: any) {
      console.log("Signup error: ", err)
    }
  }

  // Auto-redirect if already logged in
  React.useEffect(() => {
    if (currentUser) {
      router.replace('/(tabs)');
    }
  }, [currentUser]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 1}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Authbar page="signup" />

          <View className='px-4 pt-9 pb-5' style={{ backgroundColor: "#ccccccff" }}>
            <View>
              <TouchableOpacity className='flex-row items-center gap-2 px-2.5' style={styles.input}>
                <View className='w-10'>
                  <MaterialIcons name="apple" size={32} color="#383838ff" />
                </View>
                <Text className='font-regular' style={[{ color: theme.dark_text, marginVertical: 13 }, styles.inputText]}>Sign up with Apple</Text>
              </TouchableOpacity>
              <TouchableOpacity className='flex-row items-center gap-2 px-2.5' style={styles.input}>
                <View className='w-10 pl-1'>
                  <AntDesign name="google" size={25} color="#383838ff" />
                </View>
                <Text className='font-regular' style={[{ color: theme.dark_text, marginVertical: 13 }, styles.inputText]}>Sign up with Google</Text>
              </TouchableOpacity>
            </View>

            <Text className='flex-1 text-center font-bold mb-8 mt-4' 
              style={{ fontSize: 17 }}
            >Or continue with email</Text>

            <View>
              <View className='flex-row items-center gap-2 px-2.5 py-1' style={styles.input}>
                <View className='w-8'>
                  <MaterialIcons name="person" size={26} color="#383838ff" />
                </View>
                <TextInput
                  className='font-regular flex-1'
                  style={styles.inputText}
                  value={username}
                  onChangeText={(text: string) => setUsername(text)}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.dark_text}
                />
              </View>
              <View className='flex-row items-center gap-2 px-2.5 py-1' style={styles.input}>
                <View className='w-8'>
                  <MaterialIcons name="email" size={26} color="#383838ff" />
                </View>
                <TextInput
                  className='font-regular flex-1'
                  style={styles.inputText}
                  value={email}
                  onChangeText={(text: string) => setEmail(text)}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.dark_text}
                />
              </View>
              <View className='flex-row items-center gap-2 px-2.5 py-1' style={styles.input}>
                <View className='w-8'>
                  <MaterialIcons name="lock" size={27} color="#383838ff" />
                </View>
                <TextInput
                  className='font-regular flex-1'
                  style={styles.inputText}
                  value={password}
                  onChangeText={(text: string) => setPassword(text)}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.dark_text}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#383838ff" />
                </TouchableOpacity>
              </View>
              <View className='flex-row items-center gap-2 px-2.5 py-1' style={styles.input}>
                <View className='w-8'>
                  <MaterialIcons name="lock" size={27} color="#383838ff" />
                </View>
                <TextInput
                  className='font-regular flex-1'
                  style={styles.inputText}
                  value={verifiedPassword}
                  onChangeText={(text: string) => setVerifiedPassword(text)}
                  placeholder="Verify your password"
                  placeholderTextColor={theme.dark_text}
                  secureTextEntry={!showVerifiedPassword}
                />
                <TouchableOpacity onPress={() => setShowVerifiedPassword(!showVerifiedPassword)}>
                  <Ionicons name={showVerifiedPassword ? "eye" : "eye-off"} size={24} color="#383838ff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {(error as any)?.data?.message || 'Signup failed. Please try again.'}
                </Text>
              </View>
            )}

            <View className='pt-5'>
              <View className='flex-row items-center gap-3 mb-2'>
                {isValidPassword(password) 
                  ? <Ionicons name="checkmark-circle-sharp" size={20} color="green" />
                  : <Entypo name="circle" size={17} color={theme.dark_text} />
                }
                <Text>Atleast 6 characters</Text>
              </View>
              <View className='flex-row items-center gap-3 mb-2'>
                {hasNumber(password) 
                  ? <Ionicons name="checkmark-circle-sharp" size={20} color="green" />
                  : <Entypo name="circle" size={17} color={theme.dark_text} />
                }
                <Text>Atleast 1 number</Text>
              </View>
              <View className='flex-row items-center gap-3 mb-2'>
                {hasUpperLower(password) 
                  ? <Ionicons name="checkmark-circle-sharp" size={20} color="green" />
                  : <Entypo name="circle" size={17} color={theme.dark_text} />
                }
                <Text>Both upper and lower case letter</Text>
              </View>
              <View className='flex-row items-center gap-3 mb-2'>
                {passwordsMatch
                  ? <Ionicons name="checkmark-circle-sharp" size={20} color="green" />
                  : <Entypo name="circle" size={17} color={theme.dark_text} />
                }
                <Text>Passwords match</Text>
              </View>
            </View>

            {/* Signup Button */}
            <View className='pt-10'>
              <TouchableOpacity style={{ backgroundColor: theme.green_button }} className='flex-row items-center justify-center p-3 rounded-md'
                onPress={handleSignup}
                disabled={isLoading || !isFormValid}
                activeOpacity={0.8}
              >
                {isLoading && <ActivityIndicator size="small" color="white" className="mr-2" />}
                <Text className='text-xl text-white font-semibold'>
                  {isLoading ? 'Creating account...' : 'SIGN UP'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center items-center gap-1 pt-6 items-center pb-6">
              <Text className="text-md" style={{ color: theme.text }}>
                Already have an account?
              </Text>
              <TouchableOpacity className='flex-row items-center ' onPress={() => router.push('/login')}>
                <Text className="font-semibold text-blue-600">Sign in</Text>
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
  container: {
    backgroundColor: '#fdfdfdff',
    minHeight: height,
  },
  wrapper: {
    flex: 1,
  },
  input: {
    backgroundColor: "#ffffffff",
    borderRadius: 5,
    marginBottom: 15,
  },
  inputText: {
    fontSize: 15,
  },
  addIcon: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  textArea: {
    backgroundColor: "#e6e6e6ff",
    borderRadius: 5,
    padding: 10,
    minHeight: 120,
  },
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