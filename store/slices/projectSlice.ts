// src/store/slices/projectSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectUIState {
  likesPending: Record<string, boolean>; // projectId → is liking
  optimisticLikes: Record<string, boolean>; // projectId → temp liked state
}

const initialState: ProjectUIState = {
  likesPending: {},
  optimisticLikes: {},
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLikePending: (state, action: PayloadAction<{ id: string; pending: boolean }>) => {
      const { id, pending } = action.payload;
      state.likesPending[id] = pending;
    },
    setOptimisticLike: (state, action: PayloadAction<{ id: string; liked: boolean }>) => {
      const { id, liked } = action.payload;
      state.optimisticLikes[id] = liked;
    },
    clearOptimisticLike: (state, action: PayloadAction<string>) => {
      delete state.optimisticLikes[action.payload];
    },
  },
});

export const { setLikePending, setOptimisticLike, clearOptimisticLike } = projectSlice.actions;
export default projectSlice.reducer;