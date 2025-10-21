import { View, Text, KeyboardAvoidingView, Dimensions, Platform, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/context/ThemeContext';
import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
const { height } = Dimensions.get('window');

export default function Login() {
  const { theme } = useTheme();  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
          className='flex-column'
        >
          <View style={{ backgroundColor: theme.background }}>
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
              <Text className='text-center' style={{ fontSize: 14.5, color: theme.text }}>Sign up below to manage your{"\n"}account and access all news, events, etc</Text>
            </View>
      
            <View className='flex-row justify-between' style={{ paddingTop: 45 }}>
              <View style={{ width: "50%" }}>
                <Link href="/login" asChild>
                  <TouchableOpacity className='flex-row items-center justify-center' style={styles.active_button}>
                    <Text className='text-lg font-bold mb-2' style={{ color: theme.icons }}>Login</Text>
                  </TouchableOpacity>
                </Link>
              </View>
              <View style={{ width: "50%" }}>
                <Link href="/signup" asChild>
                  <TouchableOpacity className='flex-row items-center justify-center' style={styles.button}>
                    <Text className='text-lg font-bold mb-2' style={{ color: theme.icons }}>Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>

          <View className='px-4 pt-8 pb-5 flex-1' style={{ backgroundColor: "#ccccccff" }}>
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
                  value={newPassword}
                  onChangeText={(text: string) => setNewPassword(text)}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.dark_text}
                  secureTextEntry
                />
              </View>
            </View>

            <View className='pt-10'>
              <TouchableOpacity style={{ backgroundColor: theme.green_button }} className='flex-row items-center justify-center p-3 rounded-md'>
                <Text className='text-xl text-white font-semibold'>SIGN UP</Text>
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
  },logo: {
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
});