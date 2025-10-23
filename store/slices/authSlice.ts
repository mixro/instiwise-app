import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CurrentUser {
  _id: string;
  username: string;
  email: string;
  role?: string;
  accessToken: string;
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