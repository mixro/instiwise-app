import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/src/constants/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  password: string;
}

interface SetupUsernameCredentials {
  username: string;
}

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

// Custom baseQuery to include Authorization header
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const { currentUser } = (getState() as any).auth; // Access Redux state
    if (currentUser?.accessToken) {
      headers.set('Authorization', `Bearer ${currentUser.accessToken}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
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
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useGetMeQuery,
  useSetUpUsernameMutation,
  useLogoutMutation,
} = authApi;