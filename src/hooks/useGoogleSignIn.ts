// src/hooks/useGoogleSignIn.ts
import { GoogleSignin, statusCodes, User } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { useEffect } from 'react';

export interface GoogleUser {
  idToken: string;
  accessToken: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    photo: string | null;
  };
}

export const useGoogleSignIn = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const signIn = async (): Promise<GoogleUser | null> => {
    try {
      await GoogleSignin.hasPlayServices();

      // 1. Trigger sign-in
      const result: User = await GoogleSignin.signIn();
      console.log("result", result);

      // 2. Get tokens (critical for idToken)
      const idToken = result.idToken;
      const accessToken = result.accessToken;
      const userInfo = result.user;

      let finalIdToken = idToken;
      let finalAccessToken = accessToken;
      
      if (!finalIdToken || !finalAccessToken) {
          const tokens = await GoogleSignin.getTokens(); // Fallback
          finalIdToken = tokens.idToken;
          finalAccessToken = tokens.accessToken;
      }

      if (!finalIdToken) {
        throw new Error('ID token not received');
      }

      return {
        idToken: finalIdToken,
        accessToken: finalAccessToken!, // The ! assertion is fine here
        user: {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          photo: userInfo.photo ?? null,
        },
      };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'Sign-in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('In Progress', 'Sign-in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services', 'Google Play Services not available');
      } else {
        Alert.alert('Sign-In Failed', error.message || 'Please try again');
      }

      return null;
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Google Sign-Out Error:', error);
    }
  };

  return { signIn, signOut };
};