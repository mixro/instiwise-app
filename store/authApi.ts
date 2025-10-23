import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/src/constants/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface CheckUsernameRequest {
  username: string;
}

interface CheckUsernameResponse {
  exists: boolean;
}

interface AuthResponse {
  user: {
    _id: string;
    username: string;
    email: string;
    role?: string;
  };
  accessToken: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ['Auth', 'Username'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    // ✅ NEW: Real-time username check
    checkUsername: builder.query<CheckUsernameResponse, CheckUsernameRequest>({
      query: ({ username }) => ({
        url: '/auth/check-username',
        method: 'POST',
        body: { username },
      }),
      providesTags: ['Username'],
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useCheckUsernameQuery // ✅ Export for real-time check
} = authApi;