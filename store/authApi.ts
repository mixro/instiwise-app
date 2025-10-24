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

interface AuthResponse {
  _id: string;
  accessToken: string;
  awards?: any[];
  connections?: any[];
  createdAt?: string;
  email: string;
  isAdmin?: boolean;
  projects?: any[];
  updatedAt?: string;
  username: string;
  [key: string]: any; // Allow extra fields
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
    getMe: builder.query<AuthResponse['user'], void>({
      query: () => ({
        url: '/auth/me',
        credentials: 'include',
      }),
      providesTags: ['Auth'],
    })
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetMeQuery,
} = authApi;