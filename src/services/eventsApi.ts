import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { EventItem } from '@/src/interfaces/interfaces';
import { RootState } from '@/store/index';
import { baseQueryWithReauth } from './authApi';

export const eventsApi = createApi({
  reducerPath: 'eventsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Events'],
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

    // NEW: Toggle favorite
    toggleFavorite: builder.mutation<{ isFavorite: boolean }, string>({
      query: (eventId) => ({
        url: `/events/${eventId}/favorite`,
        method: 'PATCH',
      }),
      async onQueryStarted(eventId, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const userId = state.auth.currentUser?._id;
        if (!userId) return;

        // Find current isFavorite state
        const currentEvent = (state.eventsApi.queries['getEvents(undefined)']?.data as EventItem[] | undefined)?.find(e => e._id === eventId);
        const newFavoriteState = !currentEvent?.isFavorite;

        // Optimistic update
        const patchResult = dispatch(
          eventsApi.util.updateQueryData('getEvents', undefined, (draft) => {
            const event = draft.find(e => e._id === eventId);
            if (event) {
              event.isFavorite = newFavoriteState;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          // Optional: show error toast
        }
      },
      // NO invalidatesTags → no refetch → no refresh bubble
    }),
  }),
});

export const {
  useGetEventsQuery,
  useToggleFavoriteMutation, // ← NEW
} = eventsApi;