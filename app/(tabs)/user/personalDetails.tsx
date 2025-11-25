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
import { Image } from 'react-native';
import { ImageAsset, useImageUpload } from '@/src/hooks/useImageUpload';
const { height } = Dimensions.get('window');

export default function personalDetails() {
    const { theme } = useTheme();
    const { user: authUser, refetchProfile } = useAuth();
    const dispatch = useAppDispatch();
    const { saveAuth } = useStorage();
    const { pickImage, uploadImage, uploading, progress } = useImageUpload();
    const [selectedImage, setSelectedImage] = useState<ImageAsset | null>(null);
    const [updateUser, { isLoading, error, isSuccess }] = useUpdateUserMutation();

    // Form + original state (to detect changes)
    const [form, setForm] = useState({
        username: '',
        email: '',
        phone: '',
        bio: '',
        img: '',
    });

    const [original, setOriginal] = useState(form);

    useEffect(() => {
        if (authUser) {
            const data = {
                username: authUser.username ?? '',
                email: authUser.email ?? '',
                phone: authUser.phone ?? '',
                bio: authUser.bio ?? '',
                img: authUser.img ?? '',
            };
            setForm(data);
            setOriginal(data);
        }
    }, [authUser]);

    const handleSelectImage = async () => {
        const asset = await pickImage();
        if (asset) {
            setSelectedImage(asset);
        }
    };

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
    
    // Submit handler
    const handleSubmit = async () => {
        if (!authUser?._id) return;

        const updates = getChangedFields();
        if (Object.keys(updates).length === 0 && !selectedImage) {
            Alert.alert('No changes', 'You haven\'t modified anything.');
            return;
        }

        if (!validateChanges()) {
            Alert.alert('Invalid input', 'Please correct the highlighted fields.');
            return;
        }

        let imgUrl = form.img;

        // Upload image if selected
        if (selectedImage) {
            console.log("started")
            const uploadResult = await uploadImage(selectedImage);
            if (!uploadResult) {
                Alert.alert('Upload Failed', 'Could not upload profile image');
                return;
            }
            imgUrl = uploadResult.url;
            updates.img = imgUrl;
            console.log(imgUrl);
        }

        try {
            const result = await updateUser({ id: authUser._id, updates }).unwrap();

            const updatedUser = {
                ...authUser,
                ...result.data,
                img: imgUrl,
                accessToken: result.data.accessToken ?? authUser.accessToken,
                refreshToken: result.data.refreshToken ?? authUser.refreshToken,
            };

            dispatch(setCredentials(updatedUser));
            await saveAuth(updatedUser);
            refetchProfile?.();

            setSelectedImage(null);

            Alert.alert('Success', 'Your profile have been updated.');
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
                    <Navbar path="/settings" title='Update your details' />

                    <View className='flex-column items-center justify-center mt-3'>
                        <View style={{borderColor: theme.text}} className="relative rounded-full p-0.5 border border-2 flex-row items-center justify-center">
                            <Image
                                source={{ 
                                    uri: selectedImage?.uri || form.img || 'https://www.pngkey.com/png/full/157-1579943_no-profile-picture-round.png',
                                }}
                                style={styles.updateProfileImg}
                            />
                            <TouchableOpacity 
                                onPress={handleSelectImage}
                                disabled={uploading}
                                style={styles.imageIcon}
                            >
                                <View className='rounded-full flex-row items-center justify-center' 
                                    style={[{backgroundColor: theme.blue_text, padding: 2}]}
                                >
                                    <Ionicons name="add-circle-sharp" size={38} color="white" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Upload Progress */}
                        {uploading && (
                            <View className="mt-4 w-[60%]">
                                <Text className="text-sm mb-2" style={{ color: theme.text }}>
                                    Uploading image...
                                </Text>
                                <View style={{ height: 6, backgroundColor: '#ddd', borderRadius: 3, overflow: 'hidden' }}>
                                    <View
                                    style={{
                                        height: '100%',
                                        width: `${progress}%`,
                                        backgroundColor: theme.green_text,
                                    }}
                                    />
                                </View>
                                <Text className="text-xs mt-1" style={{ color: theme.text }}>
                                    {progress}%
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Username */}
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

                    {/* Bio */}
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

                    {/* Email */}
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

                    {/* Phone */}
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

                    <View className='pt-10'>
                        <TouchableOpacity 
                            style={{backgroundColor: 
                                Object.keys(getChangedFields()).length > 0 || selectedImage
                                ? theme.blue_text
                                : theme.gray_text,
                            }} 
                            className='flex-row items-center justify-center p-4 rounded-md'
                            onPress={handleSubmit}
                            disabled={isLoading || uploading}
                        >
                            {isLoading || uploading ? (
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
  updateProfileImg: {
    width: 130,
    height: 130,
    borderRadius: 100,
  },
  imageIcon: {
    right: -4,
    bottom: 6,
    position: "absolute"
  }
})