// src/hooks/useGoogleSignIn.ts
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Alert } from 'react-native';
import { useEffect } from 'react';


interface GoogleSignInSuccess {
  type: 'success';
  idToken: string | null;
  serverAuthCode?: string | null;
  scopes?: string[];
  user: {
    id: string;
    email: string;
    name: string | null;
    photo: string | null;
    givenName?: string | null;
    familyName?: string | null;
  };
}

interface GoogleSignInError {
  type: 'error';
  error: any;
}

type GoogleSignInResponse = GoogleSignInSuccess | GoogleSignInError;


export interface GoogleUser {
  idToken: string;
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
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: ['profile', 'email'],
    });
  }, []);

  const signIn = async (): Promise<GoogleUser | null> => {
    try {
      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();

      // ── Type guard: ensure we have success ──
      if (response.type !== 'success') {
        throw new Error('Sign-in did not return success');
      }

      const { idToken, user } = response.data;

      if (!idToken) {
        // Fallback: very rare, but safe
        const tokens = await GoogleSignin.getTokens();
        if (!tokens.idToken) throw new Error('No ID token available');
        response.data.idToken = tokens.idToken;
      }

      return {
        idToken: idToken!,
        user: {
          id: user.id,                    // ← now 100% safe
          name: user.name ?? null,
          email: user.email,
          photo: user.photo ?? null,
        },
      };
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled', 'You cancelled the sign-in');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Already signing in
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available');
      } else {
        Alert.alert('Login Failed', error.message || 'Please try again');
      }

      return null;
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return { signIn, signOut };
};