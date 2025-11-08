import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '@/src/context/ThemeContext';
import Navbar from '@/src/components/navigation/navbar';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { useAuth } from '@/src/hooks/useAuth';
import { useDeleteUserMutation } from '@/src/services/userApi';
import { router } from 'expo-router';

export default function deleteAccount() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();

  const [deleteUser, { isLoading, error, isSuccess }] = useDeleteUserMutation();
  
  const confirmDelete = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleDelete,
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = async () => {
    if (!user?._id) return;

    try {
      await deleteUser({ id: user._id }).unwrap();

      // Clear auth & go to login
      await signOut();
      router.replace('/login');
    } catch (err: any) {
      Alert.alert('Error', err?.data?.message || 'Failed to delete account');
    }
  };
  
  
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background, minHeight: "100%" }} className='px-4'>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View className='flex-column' style={{minHeight: "100%"}}>
          <Navbar title='Delete your account' />

          <View 
            style={[{borderColor: theme.border, backgroundColor: theme.border}, styles.profileContainer]} 
            className='flex-row items-start gap-4 p-4 px-3 mt-6 border'
          >
            <View style={{borderColor: theme.text}} className="rounded-full p-0.5 border border-2 flex-row items-center justify-center">
              <Image
                source={{ uri: user?.img || 'https://www.pngkey.com/png/full/157-1579943_no-profile-picture-round.png' }}
                style={styles.profileImg}
              />
            </View>
            <View className='flex-1'>
              <Text className='font-bold mb-2' style={{color: theme.text, fontSize: 17}}>{user?.username}</Text>
              <View className='flex-row items-center flex-1'>
                <View style={styles.metrics}>
                  <View className='flex-column items-center'>
                    <Text className='text-xl' style={{color: theme.text}}>{user?.projectsCount}</Text>
                    <Text className='text-lg' style={{color: theme.text}}>Projects</Text>
                  </View>
                </View>
                <View style={styles.metrics}>
                  <View className='flex-column items-center'>
                    <Text className='text-xl' style={{color: theme.text}}>0</Text>
                    <Text className='text-lg' style={{color: theme.text}}>Awards</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className='flex-1' style={{height: "100%"}}>
            <View className='flex-row items-center gap-3' style={{paddingTop: "10%"}}>
              <MaterialIcons name="dangerous" size={30} color={theme.red_button} />
              <Text className='text-xl font-bold' style={{color: theme.text}}>CAUTION:</Text>
            </View>
            <Text className='mt-5' style={{fontSize: 15, color: theme.text}}>
              If you delete your account, all your data (projects, profile, etc.) will be permanently removed and cannot be recovered.
            </Text>
            
            {/* Error */}
            {error && (
              <Text style={{ color: 'red', marginTop: 16, textAlign: 'center' }}>
                {(error as any).data?.message || 'Failed to delete account'}
              </Text>
            )}

            {/* Success */}
            {isSuccess && (
              <Text style={{ color: 'green', marginTop: 16, textAlign: 'center' }}>
                Account deleted successfully.
              </Text>
            )}

            {/* Delete Button */}
            <View className='pt-14'>
              <TouchableOpacity 
                style={{backgroundColor: theme.red_button}} 
                className='flex-row items-center justify-center p-2 rounded-md'
                onPress={confirmDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg text-white font-bold">DELETE ACCOUNT</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>      
  )
}

const styles = StyleSheet.create({
  profileContainer : {
    borderWidth: 1,
    borderRadius: 5
  },
  profileImg: {
    width: 75,
    height: 75,
    borderRadius: 100,
  },
  metrics: {
    width: "45%",
    alignItems: "flex-start"
  },
  button: {
    width: "48%",
  }
})