import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/src/constants/api';
import { RootState } from '@/store';
import { logout, setCredentials } from '@/store/slices/authSlice';
import { useStorage } from '@/utils/useStorage';

interface LoginCredentials { email: string; password: string; }
interface RegisterCredentials { email: string; password: string; }
interface SetupUsernameCredentials { username: string; }

interface AuthResponse {
  data: {
    user: {
      _id: string;
      username?: string;
      img?: string;
      bio?: string;
      awards: { name: string; date: Date; description?: string }[];
      email: string;
      isAdmin: boolean;
      projectsCount: number;
      connectionsCount: number;
      isActive: boolean;
    };
    accessToken: string
    refreshToken: string;
  }
}

interface UserDetailsResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    img: string;
    bio?: string;
    isAdmin: boolean;
    awards?: { name: string; date: Date; description?: string }[];
    projectsCount: number;
    projects?: { _id: string; title: string; description: string }[];
    connectionsCount: number;
    connections?: { _id: string; user1: string; user2: string; status?: string }[];
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  };
  accessToken: string
}

// ---------- Base query with auto-refresh ----------
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { currentUser } = (getState() as RootState).auth;
    if (currentUser?.accessToken) {
      headers.set('Authorization', `Bearer ${currentUser.accessToken}`);
    }
    // Tell backend this is the mobile app (optional – skip cookie handling)
    headers.set('x-mobile-app', 'true');
    return headers;
  },
});

const baseQueryWithReauth: typeof rawBaseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // ---- 401 → try refresh ----
  if (result.error?.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.currentUser?.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      await useStorage().clearAuth();
      return result;
    }

    const refreshResult = await rawBaseQuery(
      { url: '/auth/refresh', method: 'POST', body: { refreshToken } },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const newAccess = (refreshResult.data as any).data.accessToken;
      const updatedUser = { ...state.auth.currentUser!, accessToken: newAccess };
      api.dispatch(setCredentials(updatedUser));
      await useStorage().saveAuth(updatedUser);

      // Retry original request with fresh token
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed → force logout
      api.dispatch(logout());
      await useStorage().clearAuth();
    }
  }
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    getMe: builder.query<UserDetailsResponse, void>({
      query: () => ({
        url: '/auth/me',
      }),
      providesTags: ['Auth'],
    }),
    setUpUsername: builder.mutation<AuthResponse, SetupUsernameCredentials>({
      query: (credentials) => ({
        url: '/auth/setup-username',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    changeSelfPassword: builder.mutation< { success: true; message: string }, { oldPassword: string; newPassword: string }>({
      query: (body) => ({
        url: '/auth/me/change-password',
        method: 'POST',
        body,
      }),
    }),
    refresh: builder.mutation<{ data: { accessToken: string } }, { refreshToken: string }>({
      query: (body) => ({ 
        url: '/auth/refresh', 
        method: 'POST', 
        body         
      }),
    }),
    logout: builder.mutation<{ success: boolean; message: string }, { refreshToken?: string }>({
      query: (body) => ({ 
        url: '/auth/logout', 
        method: 'POST', 
        body 
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export { baseQueryWithReauth }
export const { 
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useSetUpUsernameMutation,
  useLogoutMutation,
  useRefreshMutation,
  useChangeSelfPasswordMutation,
} = authApi;