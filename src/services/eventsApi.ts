import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EventItem } from '@/src/interfaces/interfaces';
import { RootState } from '@/store/index';
import { baseQueryWithReauth } from './authApi';

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Events', 'UpcomingEvents'],
  endpoints: (builder) => ({
    getEvents: builder.query<EventItem[], void>({
      query: () => '/events',
      transformResponse: (response: { data: EventItem[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Events' as const, id: _id })),
              { type: 'Events', id: 'LIST' },
            ]
          : [{ type: 'Events', id: 'LIST' }],
    }),

    getUpcomingEvents: builder.query<EventItem[], void>({
      query: () => '/events/upcoming',
      transformResponse: (res: { data: EventItem[] }) => res.data,
      providesTags: ['UpcomingEvents'],
    }),

    // NEW: Toggle favorite
    toggleFavorite: builder.mutation<{ isFavorited: boolean; favoriteCount: number }, string>({
      query: (eventId) => ({
        url: `/events/${eventId}/favorite`,
        method: 'PATCH',
      }),
      async onQueryStarted(eventId, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const userId = state.auth.currentUser?._id;
        if (!userId) return;

        // 1. Update Home (upcoming)
        const patchUpcoming = dispatch(
          eventsApi.util.updateQueryData('getUpcomingEvents', undefined, (draft) => {
            const event = draft.find(e => e._id === eventId);
            if (event) {
              const wasFavorited = event.favorites.includes(userId);
              if (wasFavorited) {
                event.favorites = event.favorites.filter(id => id !== userId);
              } else {
                event.favorites.push(userId);
              }
            }
          })
        );

        // 2. Update Calendar (all events)
        const patchAll = dispatch(
          eventsApi.util.updateQueryData('getEvents', undefined, (draft) => {
            const event = draft.find(e => e._id === eventId);
            if (event) {
              const wasFavorited = event.favorites.includes(userId);
              if (wasFavorited) {
                event.favorites = event.favorites.filter(id => id !== userId);
              } else {
                event.favorites.push(userId);
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchUpcoming.undo();
          patchAll.undo();
        }
      },
      // Optional: invalidate to sync with server
      invalidatesTags: ['UpcomingEvents', 'Events'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useToggleFavoriteMutation, 
  useGetUpcomingEventsQuery,
} = eventsApi;