import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InteractionAction } from '@/src/types/types';

interface NewsUIState {
  pending: Record<string, InteractionAction>;
  error: Record<string, boolean>;
}

const initialState: NewsUIState = {
  pending: {},
  error: {},
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setPendingInteraction: (
      state,
      action: PayloadAction<{ newsId: string; action: InteractionAction }>
    ) => {
      const { newsId, action: interaction } = action.payload;
      if (interaction) {
        state.pending[newsId] = interaction;
      } else {
        delete state.pending[newsId];
      }
      delete state.error[newsId];
    },
    markInteractionFailed: (state, action: PayloadAction<string>) => {
      const newsId = action.payload;
      state.error[newsId] = true;
      delete state.pending[newsId];
    },
    clearInteractionError: (state, action: PayloadAction<string>) => {
      delete state.error[action.payload];
    },
  },
});

// Export actions ONLY from here
export const {
  setPendingInteraction,
  markInteractionFailed,
  clearInteractionError,
} = newsSlice.actions;

export default newsSlice.reducer;