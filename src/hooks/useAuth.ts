import { RootState } from "@/store";
import { useGetMeQuery } from "@/store/authApi";
import { logout, setCredentials } from "@/store/slices/authSlice";
import { useStorage } from "@/utils/useStorage";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export const useAuth = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { getAuth, saveAuth } = useStorage();
  const { data: userFromApi, isLoading } = useGetMeQuery(undefined, {
    skip: !currentUser, // Only fetch if authenticated
  });

  // RESTORE FROM SECURESTORE ON APP START
  useEffect(() => {
    const restoreAuth = async () => {
      if (currentUser) return;

      const storedUser = await getAuth();
      if (storedUser) {
        console.log('✅ RESTORED FROM SECURESTORE:', storedUser.username);
        dispatch(setCredentials(storedUser));
      } else {
        console.log('❌ NO SECURESTORE DATA FOUND');
      }
    }
    restoreAuth();
  }, [dispatch, currentUser]);

  // SYNC WITH API (KEEP DATA FRESH)
  useEffect(() => {
    if (userFromApi && currentUser?._id === userFromApi._id) {
      const updatedUser = { ...currentUser!, ...userFromApi, accessToken: currentUser!.accessToken };
      dispatch(setCredentials(updatedUser));
      saveAuth(updatedUser);
      console.log('🔄 SYNCED WITH API:', updatedUser.username)
    }
  }, [userFromApi]);

  const signOut = async () => {
    dispatch(logout());
    await useStorage().clearAuth();
    console.log('🔴 LOGOUT COMPLETE')
  }

  return {
    user: currentUser || userFromApi || null,
    isAuthenticated: !!currentUser,
    isLoading,
    signOut
  }
};