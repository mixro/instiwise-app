import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CurrentUser {
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