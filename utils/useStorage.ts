import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../src/constants/storage';

export const useStorage = () => {
  const saveAuth = async (userData: any) => {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH, JSON.stringify(userData));
      console.log(`✅ SAVED TO SECURESTORE: ${userData.username}`);
    } catch (error) {
      console.error('❌ SECURESTORE SAVE FAILED:', error);
    }
  };

  const getAuth = async () => {
    try {
      const data = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ SECURESTORE READ FAILED:', error);
      return null;
    }
  };

  const clearAuth = async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH);
      console.log('🔴 CLEARED SECURESTORE');
    } catch (error) {
      console.error('❌ SECURESTORE CLEAR FAILED:', error);
    }
  };

  return { saveAuth, getAuth, clearAuth };
};