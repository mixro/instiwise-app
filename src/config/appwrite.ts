// src/config/appwrite.ts
import { Platform } from 'react-native';
import { Client, Account, Storage, ID } from 'react-native-appwrite';  // <-- RN SDK

if (!process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT) {
  throw new Error('Missing EXPO_PUBLIC_APPWRITE_ENDPOINT in .env');
}

if (!process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID) {
  throw new Error('Missing EXPO_PUBLIC_APPWRITE_PROJECT_ID in .env');
}

if (!process.env.EXPO_PUBLIC_BUCKET_ID) {
    throw new Error('Missing EXPO_PUBLIC_BUCKET_ID in .env');
}

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setPlatform(Platform.OS === 'ios' ? 'com.micep.instiwise' : 'com.micep.instiwise');  // <-- Required for RN

export const account = new Account(client);
export const storage = new Storage(client);
export { ID };

export const APPWRITE_URL_CONSTANTS = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

export const BUCKET_ID = process.env.EXPO_PUBLIC_BUCKET_ID!;

export default client;
