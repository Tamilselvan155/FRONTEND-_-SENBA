import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as bannerActions from '../../actions/bannerActions';

// Async thunks
export const fetchBannersAsync = createAsyncThunk(
  'banner/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bannerActions.fetchBanners();
      // Handle response structure: { success: true, data: [...] }
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch banners');
    }
  }
);

export const fetchBannerByIdAsync = createAsyncThunk(
  'banner/fetchBannerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bannerActions.fetchBannerById(id);
      // Handle response structure: { success: true, data: {...} }
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch banner');
    }
  }
);

export const createBannerAsync = createAsyncThunk(
  'banner/createBanner',
  async (data, { rejectWithValue }) => {
    try {
      const response = await bannerActions.createBanner(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to create banner');
    }
  }
);

export const updateBannerAsync = createAsyncThunk(
  'banner/updateBanner',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await bannerActions.updateBanner(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to update banner');
    }
  }
);

export const deleteBannerAsync = createAsyncThunk(
  'banner/deleteBanner',
  async (id, { rejectWithValue }) => {
    try {
      await bannerActions.deleteBanner(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to delete banner');
    }
  }
);

const initialState = {
  banners: [],
  currentBanner: null,
  loading: false,
  error: null,
};

const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBanner: (state) => {
      state.currentBanner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all banners
      .addCase(fetchBannersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBannersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBannersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch banner by ID
      .addCase(fetchBannerByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBannerByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBanner = action.payload;
      })
      .addCase(fetchBannerByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create banner
      .addCase(createBannerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBannerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.unshift(action.payload);
      })
      .addCase(createBannerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update banner
      .addCase(updateBannerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBannerAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex((b) => (b.id || b._id) === (action.payload.id || action.payload._id));
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
        if (state.currentBanner && (state.currentBanner.id || state.currentBanner._id) === (action.payload.id || action.payload._id)) {
          state.currentBanner = action.payload;
        }
      })
      .addCase(updateBannerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete banner
      .addCase(deleteBannerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBannerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter((b) => (b.id || b._id) !== action.payload);
        if (state.currentBanner && (state.currentBanner.id || state.currentBanner._id) === action.payload) {
          state.currentBanner = null;
        }
      })
      .addCase(deleteBannerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentBanner } = bannerSlice.actions;
export default bannerSlice.reducer;

