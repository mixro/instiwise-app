// src/config/appwrite.ts
import { Client, Account, Storage, ID } from 'appwrite';

if (!process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT) {
  throw new Error('Appwrite endpoint not set in .env');
}
if (!process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID) {
  throw new Error('Appwrite project ID not set in .env');
}

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const storage = new Storage(client);
export { ID }; // Export for use in uploads

export default client;