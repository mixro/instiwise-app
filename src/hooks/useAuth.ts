import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';
import * as SecureStore from 'expo-secure-store';
import { logout } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  // Manual restore function (call where needed)
  const restoreAuth = async () => {
    try {
      const authData = await SecureStore.getItemAsync('instiwise_auth');
      if (authData && !currentUser) {
        const user = JSON.parse(authData);
        dispatch(setCredentials(user));
      }
    } catch (error) {
      console.error('Auth restore failed:', error);
    }
  };

  const signOut = async () => {
    dispatch(logout());
    await SecureStore.deleteItemAsync('instiwise_auth');
  };

  return { 
    user: currentUser, 
    isAuthenticated: !!currentUser, 
    restoreAuth, // ✅ Call manually
    signOut 
  };
};