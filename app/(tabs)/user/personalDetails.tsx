import { View, Text, ScrollView, KeyboardAvoidingView, Dimensions, Platform, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/src/context/ThemeContext';
import Navbar from '@/src/components/navigation/navbar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { useStorage } from '@/utils/useStorage';
import { useUpdateUserMutation } from '@/src/services/userApi';
import { setCredentials } from '@/store/slices/authSlice';
import { router } from 'expo-router';
const { height } = Dimensions.get('window');

export default function personalDetails() {
    const { theme } = useTheme();
    const { user: authUser, refetchProfile } = useAuth();
    const dispatch = useAppDispatch();
    const { saveAuth } = useStorage();

    // Form + original state (to detect changes)
    const [form, setForm] = useState({
        username: '',
        email: '',
        phone: '',
        bio: '',
    });

    const [original, setOriginal] = useState(form);

    useEffect(() => {
        if (authUser) {
            const data = {
                username: authUser.username ?? '',
                email: authUser.email ?? '',
                phone: authUser.phone ?? '',
                bio: authUser.bio ?? '',
            };
            setForm(data);
            setOriginal(data);
        }
    }, [authUser]);

    // Validation (only for changed fields)
    const isValidUsername = (s: string) => /^[A-Za-z][A-Za-z0-9_]{2,15}$/.test(s);
    const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    const isValidPhone = (s: string) => /^\+?\d{7,15}$/.test(s);
    const isBioValid = (s: string) => s.length <= 300;

    const validateChanges = () => {
        if (form.username !== original.username && !isValidUsername(form.username)) return false;
        if (form.email !== original.email && !isValidEmail(form.email)) return false;
        if (form.phone !== original.phone && !isValidPhone(form.phone)) return false;
        if (form.bio !== original.bio && !isBioValid(form.bio)) return false;
        return true;
    };

    // 3. Build payload: only changed fields
    const getChangedFields = () => {
        const changes: Partial<typeof form> = {};
        (Object.keys(form) as (keyof typeof form)[]).forEach((key) => {
        if (form[key] !== original[key]) {
            changes[key] = form[key];
        }
        });
        return changes;
    };

    const [updateUser, { isLoading, error, isSuccess }] = useUpdateUserMutation();
    
    // Submit handler
    const handleSubmit = async () => {
        if (!authUser?._id) return;

        const updates = getChangedFields();
        if (Object.keys(updates).length === 0) {
            Alert.alert('No changes', 'You haven\'t modified anything.');
            return;
        }

        if (!validateChanges()) {
            Alert.alert('Invalid input', 'Please correct the highlighted fields.');
            return;
        }

        try {
            const result = await updateUser({ id: authUser._id, updates }).unwrap();

            const updatedUser = {
                ...authUser,
                ...result.data,
                accessToken: result.data.accessToken ?? authUser.accessToken,
                refreshToken: result.data.refreshToken ?? authUser.refreshToken,
            };

            dispatch(setCredentials(updatedUser));
            await saveAuth(updatedUser);
            refetchProfile?.();

            Alert.alert('Success', 'Your details have been updated.');
            router.back();
        } catch (err: any) {
            Alert.alert('Error', err?.data?.message ?? 'Failed to update profile.');
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
                <View className='pb-6'>
                    <Navbar title='Update your details' />

                    <View className='pt-6'>
                        <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Username</Text>
                        <TextInput
                            className='py-3 font-medium'
                            value={form.username}
                            onChangeText={(v) => setForm((p) => ({ ...p, username: v }))}
                            style={styles.input}
                            placeholder={"Update your username"}
                            placeholderTextColor="#494949ff"
                        />
                    </View>
                    <View className='pt-6'>
                        <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Bio</Text>
                        <TextInput
                            className='py-3 font-medium'
                            value={form.bio}
                            onChangeText={(v) => setForm((p) => ({ ...p, bio: v }))}
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
                            value={form.email}
                            onChangeText={(v) => setForm((p) => ({ ...p, email: v }))}
                            style={styles.input}
                            placeholder={"Update your email"}
                            placeholderTextColor="#494949ff"
                        />
                    </View>
                    <View className='pt-6'>
                        <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Phone</Text>
                        <TextInput
                            className='py-3 font-medium'
                            value={form.phone}
                            onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
                            style={styles.input}
                            placeholder={"Update your phone"}
                            placeholderTextColor="#494949ff"
                        />
                    </View>

                    {error && (
                        <Text style={{ color: 'red', marginTop: 12, textAlign: 'center' }}>
                        {(error as any).data?.message ?? 'Failed to update profile'}
                        </Text>
                    )}
                    {isSuccess && (
                        <Text style={{ color: 'green', marginTop: 12, textAlign: 'center' }}>
                        Profile updated successfully!
                        </Text>
                    )}

                    <View className='pt-6'>
                        <Text className='text-lg mb-3 font-medium' style={{color: theme.text}}>Profile picture</Text>
                        <View className='flex-1 flex-row gap-4 items-center py-9 justify-center rounded-md' style={{backgroundColor: "#919191ff"}}>
                            <Text className='font-bold text-white'>UPLOAD IMAGE</Text>
                            <Ionicons name="image" size={24} color="white" />
                        </View>
                    </View>

                    <View className='pt-10'>
                        <TouchableOpacity 
                            style={{backgroundColor: theme.blue_text
                            }} 
                            className='flex-row items-center justify-center p-4 rounded-md'
                            onPress={handleSubmit}
                            disabled={isLoading || Object.keys(getChangedFields()).length === 0}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className='text-xl text-white font-semibold'>UPDATE</Text>
                            )}
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