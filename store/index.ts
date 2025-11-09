import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../src/services/authApi';
import { newsApi } from '../src/services/newsApi';
import { userApi } from '../src/services/userApi';
import { eventsApi } from '../src/services/eventsApi';
import { projectsApi } from '../src/services/projectsApi';
import authReducer from './slices/authSlice';
import newsReducer from './slices/newsSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,

    auth: authReducer,
    news: newsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      newsApi.middleware,
      userApi.middleware,
      eventsApi.middleware,
      projectsApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;