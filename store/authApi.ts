import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
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
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://instiwise-backend.onrender.com/api',
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation } = authApi;