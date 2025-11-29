import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as assetActions from '../../actions/assetActions';

// Async thunks
export const fetchAllMediaFilesAsync = createAsyncThunk(
  'asset/fetchAllMediaFiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assetActions.fetchAllMediaFiles();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch media files');
    }
  }
);

export const deleteMediaFileAsync = createAsyncThunk(
  'asset/deleteMediaFile',
  async ({ category, filename }, { rejectWithValue }) => {
    try {
      await assetActions.deleteMediaFile(category, filename);
      return { category, filename };
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to delete media file');
    }
  }
);

const initialState = {
  mediaFiles: [],
  loading: false,
  error: null,
};

const assetSlice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all media files
      .addCase(fetchAllMediaFilesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMediaFilesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaFiles = action.payload;
      })
      .addCase(fetchAllMediaFilesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete media file
      .addCase(deleteMediaFileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMediaFileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.mediaFiles = state.mediaFiles.filter(
          (file) => !(file.category === action.payload.category && file.name === action.payload.filename)
        );
      })
      .addCase(deleteMediaFileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = assetSlice.actions;
export default assetSlice.reducer;

