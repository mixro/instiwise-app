import * as SecureStore from 'expo-secure-store';

export const storeAuthData = async (data: any) => {
  await SecureStore.setItemAsync('instiwise_auth', JSON.stringify(data));
};

export const getAuthData = async () => {
  try {
    const data = await SecureStore.getItemAsync('instiwise_auth');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearAuthData = async () => {
  await SecureStore.deleteItemAsync('instiwise_auth');
};