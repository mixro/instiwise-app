import { View, Text, ScrollView, KeyboardAvoidingView, Dimensions, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/src/context/ThemeContext';
import Navbar from '@/src/components/navigation/navbar';
import { Ionicons } from '@expo/vector-icons';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';
const { height } = Dimensions.get('window');

export default function personalDetails() {
    const { theme } = useTheme();
    const [inputs, setInputs] = useState({
        username: '',
        email: '',
        phone: '',
        bio: '', 
    });

    const handleChange = (key: string, value: string) => {
        setInputs((prev) => (
            { ...prev, [key] : value }
        ))
    }

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-4'>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.wrapper}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View className='pb-6'>
                    <Navbar title='Update your details' />

                    <View className='pt-6'>
                        <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Username</Text>
                        <TextInput
                            className='py-3 font-medium'
                            value={inputs.username}
                            onChangeText={(text) => handleChange('username', text)}
                            style={styles.input}
                            placeholder={"Update your username"}
                            placeholderTextColor="#494949ff"
                        />
                    </View>
                    <View className='pt-6'>
                        <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Bio</Text>
                        <TextInput
                            className='py-3 font-medium'
                            value={inputs.bio}
                            onChangeText={(text) => handleChange('bio', text)}
                            placeholder="Update your bio"
                            placeholderTextColor="#494949ff"
                            multiline
                            numberOfLines={5} 
                            style={styles.textArea}
                            textAlignVertical="top"
                        />
                    </View>
                    <View className='pt-6'>
                        <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Email</Text>
                        <TextInput
                            className='py-3 font-medium'
                            value={inputs.email}
                            onChangeText={(text) => handleChange('email', text)}
                            style={styles.input}
                            placeholder={"Update your email"}
                            placeholderTextColor="#494949ff"
                        />
                    </View>
                    <View className='pt-6'>
                        <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Phone</Text>
                        <TextInput
                            className='py-3 font-medium'
                            value={inputs.phone}
                            onChangeText={(text) => handleChange('phone', text)}
                            style={styles.input}
                            placeholder={"Update your phone"}
                            placeholderTextColor="#494949ff"
                        />
                    </View>
                    <View className='pt-6'>
                        <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Profile picture</Text>
                        <View className='flex-1 flex-row gap-4 items-center py-9 justify-center rounded-md' style={{backgroundColor: "#919191ff"}}>
                            <Text className='font-bold text-white'>UPLOAD IMAGE</Text>
                            <Ionicons name="image" size={24} color="white" />
                        </View>
                    </View>
                    <View className='pt-10'>
                        <TouchableOpacity style={{backgroundColor: theme.blue_text}} className='flex-row items-center justify-center p-4 rounded-md'>
                            <Text className='text-xl text-white font-semibold'>UPDATE</Text>
                        </TouchableOpacity>
                    </View>
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