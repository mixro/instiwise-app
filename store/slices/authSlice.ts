import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CurrentUser {
  _id: string;
  username?: string; // Optional until setup
  email: string;
  img?: string;
  bio?: string;
  isAdmin: boolean;
  projectsCount: number;
  connectionsCount: number;
  isActive: boolean;
  accessToken: string;
  details?: {
    awards?: { name: string; date: Date; description?: string }[];
    //projects?: { _id: string; title: string; description: string }[];
    //connections?: { _id: string; user1: string; user2: string; status?: string }[];
    createdAt?: Date;
    updatedAt?: Date;
  };
}

interface AuthState {
  currentUser: CurrentUser | null;
}

const initialState: AuthState = {
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CurrentUser>) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;