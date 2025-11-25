import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as brandActions from '../../actions/brandActions';

// Async thunks
export const fetchBrandsAsync = createAsyncThunk(
  'brand/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await brandActions.fetchBrands();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch brands');
    }
  }
);

export const fetchBrandsForDropdownAsync = createAsyncThunk(
  'brand/fetchBrandsForDropdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await brandActions.fetchBrandsForDropdown();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch brands');
    }
  }
);

export const fetchBrandByIdAsync = createAsyncThunk(
  'brand/fetchBrandById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await brandActions.fetchBrandById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch brand');
    }
  }
);

export const createBrandAsync = createAsyncThunk(
  'brand/createBrand',
  async (data, { rejectWithValue }) => {
    try {
      const response = await brandActions.createBrand(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to create brand');
    }
  }
);

export const updateBrandAsync = createAsyncThunk(
  'brand/updateBrand',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await brandActions.updateBrand(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to update brand');
    }
  }
);

export const deleteBrandAsync = createAsyncThunk(
  'brand/deleteBrand',
  async (id, { rejectWithValue }) => {
    try {
      await brandActions.deleteBrand(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to delete brand');
    }
  }
);

const initialState = {
  brands: [],
  brandsForDropdown: [],
  currentBrand: null,
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBrand: (state) => {
      state.currentBrand = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all brands
      .addCase(fetchBrandsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrandsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch brands for dropdown
      .addCase(fetchBrandsForDropdownAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandsForDropdownAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.brandsForDropdown = action.payload;
      })
      .addCase(fetchBrandsForDropdownAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch brand by ID
      .addCase(fetchBrandByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBrand = action.payload;
      })
      .addCase(fetchBrandByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create brand
      .addCase(createBrandAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBrandAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.unshift(action.payload);
      })
      .addCase(createBrandAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update brand
      .addCase(updateBrandAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrandAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.brands.findIndex((brand) => brand.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
        if (state.currentBrand?.id === action.payload.id) {
          state.currentBrand = action.payload;
        }
      })
      .addCase(updateBrandAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete brand
      .addCase(deleteBrandAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrandAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter((brand) => brand.id !== action.payload);
      })
      .addCase(deleteBrandAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentBrand } = brandSlice.actions;
export default brandSlice.reducer;

