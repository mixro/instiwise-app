// src/hooks/useAuth.ts – **final fixed version**

import { RootState } from '@/store';
import {
  useGetMeQuery,
  useLogoutMutation,
} from '@/src/services/authApi';
import { logout, setCredentials } from '@/store/slices/authSlice';
import { useStorage } from '@/utils/useStorage';
import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';


export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state: RootState) => state.auth);
  const { getAuth, saveAuth } = useStorage();
  const [logoutTrigger] = useLogoutMutation();

  // 1. Restore from SecureStore (runs only once)
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current || currentUser) return;

    const restore = async () => {
      const stored = await getAuth();
      if (stored) {
        console.log('RESTORED FROM SECURESTORE:', stored.username);
        dispatch(setCredentials(stored));
      }
      restoredRef.current = true;
    };
    restore();
  }, [dispatch, currentUser, getAuth]);

  // 2. Initialize /me query – starts **only** when we have a token
  const {
    data: meData,
    isLoading: meLoading,
    refetch: internalRefetch, // RTK Query's refetch function
  } = useGetMeQuery(undefined, {
    // Skip until we have accessToken
    skip: !currentUser?.accessToken,
  });

  // Track whether the query has been started at least once
  const queryStartedRef = useRef(false);
  useEffect(() => {
    if (!meLoading && currentUser?.accessToken) {
      queryStartedRef.current = true;
    }
  }, [meLoading, currentUser?.accessToken]);

  // 3. Safe public refetch – only callable after query started
  const refetchProfile = () => {
    if (queryStartedRef.current && typeof internalRefetch === 'function') {
      internalRefetch();
    } else {
      console.warn('refetchProfile called before /me query started – will fetch on next mount');
    }
  };

  // 4. One-time sync after /me response
  useEffect(() => {
    if (!meData?.user || !currentUser) return;

    const server = meData.user;
    const updates: Partial<typeof currentUser> = {};

    if (server.projectsCount !== currentUser.projectsCount)
      updates.projectsCount = server.projectsCount;
    if (server.connectionsCount !== currentUser.connectionsCount)
      updates.connectionsCount = server.connectionsCount;
    if (server.awards) {
      const existing = currentUser.details?.awards ?? [];
      if (JSON.stringify(server.awards) !== JSON.stringify(existing))
        updates.details = { ...(currentUser.details ?? {}), awards: server.awards };
    }

    if (!currentUser.details?.createdAt && server.createdAt)
      updates.details = { ...(updates.details ?? currentUser.details), createdAt: server.createdAt };
    if (!currentUser.details?.updatedAt && server.updatedAt)
      updates.details = { ...(updates.details ?? currentUser.details), updatedAt: server.updatedAt };

    if (Object.keys(updates).length) {
      const merged = { ...currentUser, ...updates };
      dispatch(setCredentials(merged));
      saveAuth(merged);
      console.log('PROFILE SYNCED (one-time)');
    }
  }, [meData, currentUser, dispatch, saveAuth]);

  // 5. Logout
  const signOut = async () => {
    try {
      await logoutTrigger({ refreshToken: currentUser?.refreshToken }).unwrap();
      dispatch(logout());
      await useStorage().clearAuth();
      console.log('LOGOUT COMPLETE');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // 6. Return API
  return {
    user: currentUser,
    isAuthenticated: !!currentUser?.accessToken && !!currentUser?.refreshToken,
    isLoading: meLoading,
    /** Safe to call from Profile screen */
    refetchProfile,
    signOut,
  };
};