import { View, Text, KeyboardAvoidingView, Platform, StyleSheet, ScrollView, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/src/context/ThemeContext';
import Navbar from '@/src/components/navigation/navbar';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/hooks/useAuth';
import { useChangeSelfPasswordMutation } from '@/src/services/authApi';
import { ActivityIndicator } from 'react-native';
const { height } = Dimensions.get('window');

export default function password() {
    const { theme } = useTheme();
    const { signOut } = useAuth();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verifiedPassword, setVerifiedPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showVerify, setShowVerify] = useState(false);

    // Password validation
    const isValidPassword = (pwd: string) => pwd.length >= 6;
    const hasNumber = (pwd: string) => /\d/.test(pwd);
    const hasUpperLower = (pwd: string) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd);
    const passwordsMatch = newPassword !== "" && verifiedPassword !== "" && newPassword === verifiedPassword;

    const isFormValid = isValidPassword(newPassword) && hasNumber(newPassword) && hasUpperLower(newPassword) && passwordsMatch;

    // RTK Query mutation
    const [changePassword, { isLoading, error, isSuccess }] = useChangeSelfPasswordMutation();
    
    const handleSubmit = async () => {
    console.log('Change password payload:', { oldPassword, newPassword }); // ← DEBUG

    try {
      await changePassword({
        oldPassword,
        newPassword,
      }).unwrap();

      Alert.alert(
        'Success',
        'Password changed! Logging you out for security.',
        [{ text: 'OK', onPress: signOut }]
      );
    } catch (err: any) {

      const message =
        err?.data?.message ||
        err?.message ||
        'Failed to change password. Check your connection ';

      Alert.alert('Error', message);
    }
  };
    
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
                    <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Current password</Text>
                    <View style={styles.input} className='flex-row justify-between items-center'>
                      <TextInput
                          className='py-3 font-medium flex-1'
                          value={oldPassword}
                          onChangeText={setOldPassword}
                          placeholder={"Your current password"}
                          secureTextEntry={!showOld}
                          autoCapitalize="none"
                          placeholderTextColor="#494949ff"
                      />
                      <TouchableOpacity onPress={() => setShowOld(!showOld)} style={styles.eyeIcon}>
                        <Ionicons name={showOld ? 'eye' : 'eye-off'} size={24} color={theme.dark_text} />
                      </TouchableOpacity>
                    </View>
                </View>
                <View className='pt-6'>
                    <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>New password</Text>
                    <View style={styles.input} className='flex-row justify-between items-center'>
                      <TextInput
                          className='py-3 font-medium flex-1'
                          value={newPassword}
                          onChangeText={setNewPassword}
                          placeholder={"Your new password"}
                          placeholderTextColor="#494949ff"
                          secureTextEntry={!showNew}
                          autoCapitalize="none"
                          />
                      <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eyeIcon}>
                        <Ionicons name={showNew ? 'eye' : 'eye-off'} size={24} color={theme.dark_text} />
                      </TouchableOpacity>
                    </View>
                </View>
                <View className='pt-6'>
                    <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Verify new password</Text>
                    <View style={styles.input} className='flex-row justify-between items-center'>
                      <TextInput
                          className='py-3 font-medium flex-1'
                          value={verifiedPassword}
                          onChangeText={setVerifiedPassword}
                          placeholder={"Verify new password"}
                          placeholderTextColor="#494949ff"
                          secureTextEntry={!showVerify}
                          autoCapitalize="none"
                          />
                      <TouchableOpacity onPress={() => setShowVerify(!showVerify)} style={styles.eyeIcon}>
                        <Ionicons name={showVerify ? 'eye' : 'eye-off'} size={24} color={theme.dark_text} />
                      </TouchableOpacity>
                    </View>
                </View>

                <View className='pt-5'>
                  <View className='flex-row items-center gap-3 mb-2'>
                    {isValidPassword(newPassword) 
                      ? <Ionicons name="checkmark-circle-sharp" size={20} color="green" />
                      : <Entypo name="circle" size={17} color={theme.dark_text} />
                    }
                    <Text>Atleast 6 characters</Text>
                  </View>
                  <View className='flex-row items-center gap-3 mb-2'>
                    {hasNumber(newPassword) 
                      ? <Ionicons name="checkmark-circle-sharp" size={20} color="green" />
                      : <Entypo name="circle" size={17} color={theme.dark_text} />
                    }
                    <Text>Atleast 1 number</Text>
                  </View>
                  <View className='flex-row items-center gap-3 mb-2'>
                    {hasUpperLower(newPassword) 
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

                {/* Error */}
                {error && (
                  <Text style={{ color: 'red', marginTop: 16, textAlign: 'center' }}>
                    {(error as any).data?.message || 'Failed to change password'}
                  </Text>
                )}

                {/* Success */}
                {isSuccess && (
                  <Text style={{ color: 'green', marginTop: 16, textAlign: 'center' }}>
                    Password changed successfully!
                  </Text>
                )}

                <View className='pt-14'>
                    <TouchableOpacity style={{backgroundColor: theme.blue_text}} 
                      className='flex-row items-center justify-center p-3 rounded-md'
                      onPress={handleSubmit}
                      disabled={isLoading || !isFormValid}
                    >
                        {isLoading ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text className="text-xl text-white font-semibold">UPDATE PASSWORD</Text>
                        )}
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
  eyeIcon: {
    padding: 10,
  },
})