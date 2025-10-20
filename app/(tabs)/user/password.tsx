import { View, Text, KeyboardAvoidingView, Platform, StyleSheet, ScrollView, Dimensions, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/src/context/ThemeContext';
import Navbar from '@/src/components/navigation/navbar';
const { height } = Dimensions.get('window');

export default function password() {
    const { theme } = useTheme();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verifiedPassword, setVerifiedPassword] = useState("");
    
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-4'>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.wrapper}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Navbar title='Update your password' />

                <View className='pt-6'>
                    <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Old password</Text>
                    <TextInput
                        className='py-3 font-medium'
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        style={styles.input}
                        placeholder={"Your old password"}
                        placeholderTextColor="#494949ff"
                    />
                </View>
                <View className='pt-6'>
                    <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>New password</Text>
                    <TextInput
                        className='py-3 font-medium'
                        value={newPassword}
                        onChangeText={setNewPassword}
                        style={styles.input}
                        placeholder={"Your new password"}
                        placeholderTextColor="#494949ff"
                    />
                </View>
                <View className='pt-6'>
                    <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Verify new password</Text>
                    <TextInput
                        className='py-3 font-medium'
                        value={verifiedPassword}
                        onChangeText={setVerifiedPassword}
                        style={styles.input}
                        placeholder={"Verify password"}
                        placeholderTextColor="#494949ff"
                    />
                </View>
                <View className='pt-14'>
                    <TouchableOpacity style={{backgroundColor: theme.blue_text}} className='flex-row items-center justify-center p-3 rounded-md'>
                        <Text className='text-xl text-white font-semibold'>UPDATE</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fdfdfdff',
    minHeight: height
  },
  wrapper: {
    flex: 1
  },
  input: {
    backgroundColor: "#e6e6e6ff",
    borderRadius: 5,
    paddingLeft: 10,
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
})