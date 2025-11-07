import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '@/src/services/authApi';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    updateUser: builder.mutation<{ data: any }, { id: string; updates: Partial<any> }>({
      query: ({ id, updates }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),
     deleteUser: builder.mutation< { success: true; message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useUpdateUserMutation, useDeleteUserMutation } = userApi;