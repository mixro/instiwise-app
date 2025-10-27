import { RootState } from "@/store";
import { useGetMeQuery, useLogoutMutation } from "@/store/authApi";
import { logout, setCredentials } from "@/store/slices/authSlice";
import { useStorage } from "@/utils/useStorage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export const useAuth = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { getAuth, saveAuth } = useStorage();
  const [logoutTrigger] = useLogoutMutation();
  const { data: basicUser, isLoading: isLoadingBasic } = useGetMeQuery(undefined, {
    skip: !currentUser, // Only skip if no user
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

  // SYNC WITH API (FULL DATA FROM /me)
  useEffect(() => {
    if (basicUser && currentUser?._id === basicUser.user._id) {
      const updatedUser = {
        ...currentUser!,
        ...basicUser.user,
        accessToken: currentUser!.accessToken,
        details: {
          awards: basicUser.user.awards,
          //projects: basicUser.user.projects,
          //connections: basicUser.user.connections,
          createdAt: basicUser.user.createdAt,
          updatedAt: basicUser.user.updatedAt,
        },
      };
      console.log("updated", updatedUser);
      dispatch(setCredentials(updatedUser));
      saveAuth(updatedUser); // Persist all data
      console.log('🔄 SYNCED WITH API:', updatedUser.username);
    }
  }, [basicUser]);

  const signOut = async () => {
    try {
      await logoutTrigger().unwrap(); // Call backend logout
      dispatch(logout());
      await useStorage().clearAuth();
      console.log('🔴 LOGOUT COMPLETE');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return {
    user: currentUser || (basicUser?.user ? { ...basicUser.user, accessToken: basicUser.accessToken, details: basicUser } : null),
    isAuthenticated: !!currentUser,
    isLoading: isLoadingBasic,
    signOut,
  };
};