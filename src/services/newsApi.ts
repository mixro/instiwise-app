// src/api/newsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewsItem } from '@/src/interfaces/interfaces';
import { RootState } from '@/store/index';
import { API_BASE_URL } from '@/src/constants/api';
import { markInteractionFailed, setPendingInteraction } from '@/store/slices/newsSlice';
import { baseQueryWithReauth } from './authApi';


export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['News'],
  endpoints: (builder) => ({
    getNews: builder.query<NewsItem[], void>({
      query: () => '/news',
      // Transform the response to return only the array
      transformResponse: (response: { data: NewsItem[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'News' as const, id: _id })),
              { type: 'News', id: 'LIST' },
            ]
          : [{ type: 'News', id: 'LIST' }],
    }),

    likeNews: builder.mutation<void, string>({
      query: (newsId) => ({
        url: `/news/${newsId}/like`,
        method: 'PUT',
      }),
      async onQueryStarted(newsId, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const userId = state.auth.currentUser?._id;

        if (!userId) {
          console.warn('User not logged in');
          return;
        }

        const patchResult = dispatch(
          newsApi.util.updateQueryData('getNews', undefined, (draft) => {
            const item = draft.find((n) => n._id === newsId);
            if (!item) return;

            const hasLiked = item.likes.includes(userId);
            const hasDisliked = item.dislikes.includes(userId);

            if (hasLiked) {
              item.likes = item.likes.filter((id) => id !== userId);
            } else {
              item.likes.push(userId);
            }

            if (hasDisliked) {
              item.dislikes = item.dislikes.filter((id) => id !== userId);
            }
          })
        );

        dispatch(setPendingInteraction({ newsId, action: 'like' }));

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          dispatch(markInteractionFailed(newsId));
        } finally {
          dispatch(setPendingInteraction({ newsId, action: null }));
        }
      },
    }),

    dislikeNews: builder.mutation<void, string>({
      query: (newsId) => ({
        url: `/news/${newsId}/dislike`,
        method: 'PUT',
      }),
      async onQueryStarted(newsId, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const userId = state.auth.currentUser?._id;

        if (!userId) {
          console.warn('User not logged in');
          return;
        }

        const patchResult = dispatch(
          newsApi.util.updateQueryData('getNews', undefined, (draft) => {
            const item = draft.find((n) => n._id === newsId);
            if (!item) return;

            const hasLiked = item.likes.includes(userId);
            const hasDisliked = item.dislikes.includes(userId);

            if (hasDisliked) {
              item.dislikes = item.dislikes.filter((id) => id !== userId);
            } else {
              item.dislikes.push(userId);
            }

            if (hasLiked) {
              item.likes = item.likes.filter((id) => id !== userId);
            }
          })
        );

        dispatch(setPendingInteraction({ newsId, action: 'dislike' }));

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          dispatch(markInteractionFailed(newsId));
        } finally {
          dispatch(setPendingInteraction({ newsId, action: null }));
        }
      },
    }),

    viewNews: builder.mutation<void, string>({
      query: (newsId) => ({
        url: `/news/${newsId}/view`,
        method: 'PUT', 
      }),
      async onQueryStarted(newsId, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const userId = state.auth.currentUser?._id;
        if (!userId) return;

        // Optimistically add user to views
        const patchResult = dispatch(
          newsApi.util.updateQueryData('getNews', undefined, (draft) => {
            const item = draft.find((n) => n._id === newsId);
            if (item && !item.views.includes(userId)) {
              item.views.push(userId);
            }
          })
        );

        dispatch(setPendingInteraction({ newsId, action: 'view' }));

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          dispatch(markInteractionFailed(newsId));
        } finally {
          dispatch(setPendingInteraction({ newsId, action: null }));
        }
      },
    }),
  }),
});

export const {
  useGetNewsQuery,
  useLikeNewsMutation,
  useDislikeNewsMutation,
  useViewNewsMutation,
} = newsApi;