import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { useTheme } from '@/src/context/ThemeContext';
import { useSetUpUsernameMutation } from '@/src/services/authApi';
import { useStorage } from '@/utils/useStorage';
import { setCredentials } from '@/store/slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '@/store/hooks';

export default function SetupUsername() {
  const [username, setUsername] = useState('');
  const [setupUsername, { isLoading, error }] = useSetUpUsernameMutation();
  const dispatch = useAppDispatch();
  const { saveAuth } = useStorage();
  const router = useRouter();
  const { theme } = useTheme(); 

  const minLength = (name: string) => name.length >= 3;
  const maxLength = (name: string) => /^[A-Za-z][A-Za-z0-9_]{3,15}$/.test(name);
  const startWithLetter = (name: string) => /^[A-Za-z]/.test(name);
  const hasValidCharacters =  (name: string) => /^[A-Za-z0-9_]+$/.test(name);

  const isFormValid = minLength(username) && maxLength(username) && startWithLetter(username) && hasValidCharacters(username);

  const handleSetupUsername = async () => {
    if (!username || username.length < 3) {
      console.log('Username must be at least 3 characters');
      return;
    }

    try {
      const result = await setupUsername({ username }).unwrap();

      const userData = {
        ...result.data.user,
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      };
      
      dispatch(setCredentials(userData));
      await saveAuth(userData);
      
      router.replace('/(tabs)');
    } catch (err: any) {
      console.log('Setup username error:', err);
    }
  };

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
          <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: theme.background }}>
            <Text className='font-bold' style={{ color: theme.dark_text, fontSize: 20, marginBottom: 20 }}>Set Your Username</Text>
            <TextInput
              style={[{ borderColor: theme.green_button, color: theme.text}, styles.input]}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={theme.text}
            />

            <View className='pt-5 pb-6'>
              <View className='flex-row items-center gap-3 mb-2'>
                {minLength(username) 
                  ? <Ionicons name="checkmark-circle-sharp" size={20} color="green" />
                  : <Entypo name="circle" size={17} color={theme.icons} />
                }
                <Text style={{color: theme.text}}>Atleast 3 characters</Text>
              </View>
              <View className='flex-row items-center gap-3 mb-2'>
                {maxLength(username) 
                  ? <Ionicons name="checkmark-circle-sharp" size={20} color="green" />
                  : <Entypo name="circle" size={17} color={theme.icons} />
                }
                <Text style={{color: theme.text}}>maximum 16 characters</Text>
              </View>
              <View className='flex-row items-center gap-3 mb-2'>
                {startWithLetter(username) 
                  ? <Ionicons name="checkmark-circle-sharp" size={20} color="green" />
                  : <Entypo name="circle" size={17} color={theme.icons} />
                }
                <Text style={{color: theme.text}}>Start with a letter</Text>
              </View>
              <View className='flex-row items-center gap-3 mb-2'>
                {hasValidCharacters(username)
                  ? <Ionicons name="checkmark-circle-sharp" size={20} color="green" />
                  : <Entypo name="circle" size={17} color={theme.icons} />
                }
                <Text style={{color: theme.text}}>Only letters, numbers, and underscore allowed</Text>
              </View>
            </View>

            {/* ─── Error message ─── */}
            {error && <Text style={{ color: 'red', marginBottom: 10 }}>{(error as any).data?.message || 'Error setting username'}</Text>}

            {/* ─── Submit button ─── */}
            <TouchableOpacity
              style={{ backgroundColor: theme.green_button, padding: 15, borderRadius: 5, alignItems: 'center' }}
              onPress={handleSetupUsername}
              disabled={isLoading || !isFormValid}
              activeOpacity={0.8}
            >
              {isLoading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontSize: 16 }}>SUBMIT</Text>}
            </TouchableOpacity>
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
    fontSize: 18,
    borderWidth: 2, 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10 
  }
})