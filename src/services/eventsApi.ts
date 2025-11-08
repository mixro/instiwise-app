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
    toggleFavorite: builder.mutation<{ isFavorited: boolean; favoriteCount: number }, string>({
        query: (eventId) => ({
            url: `/events/${eventId}/favorite`,
            method: 'PATCH',
        }),
        
        async onQueryStarted(eventId, { dispatch, getState, queryFulfilled }) {
            const state = getState() as RootState;
            const userId = state.auth.currentUser?._id;
            if (!userId) return;

            // Get current event from cache
            const cachedEvents = state.eventsApi.queries['getEvents(undefined)']?.data as EventItem[] | undefined;
            const event = cachedEvents?.find(e => e._id === eventId);
            if (!event) return;

            const isFavorited = event.favorites.includes(userId);
            const newFavoriteState = !isFavorited;
            const newCount = isFavorited ? event.favorites.length - 1 : event.favorites.length + 1;

            // Optimistic update
            const patchResult = dispatch(
            eventsApi.util.updateQueryData('getEvents', undefined, (draft) => {
                const draftEvent = draft.find(e => e._id === eventId);
                if (draftEvent) {
                if (newFavoriteState) {
                    draftEvent.favorites.push(userId);
                } else {
                    draftEvent.favorites = draftEvent.favorites.filter(id => id !== userId);
                }
                }
            })
            );

            try {
            await queryFulfilled;
            // Success: cache is already correct
            } catch {
            patchResult.undo();
            // Optional: show error toast
            }
        },
        // NO invalidatesTags → no refetch
    }),
  }),
});

export const {
  useGetEventsQuery,
  useToggleFavoriteMutation, // ← NEW
} = eventsApi;