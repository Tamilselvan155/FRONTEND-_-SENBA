import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as categoryActions from '../../actions/categoryActions';

// Async thunks
export const fetchCategoriesAsync = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryActions.fetchCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoriesForDropdownAsync = createAsyncThunk(
  'category/fetchCategoriesForDropdown',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryActions.fetchCategoriesForDropdown();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch categories');
    }
  }
);

export const fetchCategoriesWithSubcategoriesAsync = createAsyncThunk(
  'category/fetchCategoriesWithSubcategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryActions.fetchCategoriesWithSubcategories();
      // API returns { success: true, data: [...] }
      // response is already response.data from axios (which is { success: true, data: [...] })
      // So we need to extract response.data to get the actual array
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      // Fallback: if response is already an array, return it
      if (Array.isArray(response)) {
        return response;
      }
      // Fallback: if response has data property, try that
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch categories with subcategories');
    }
  }
);

export const fetchCategoryByIdAsync = createAsyncThunk(
  'category/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoryActions.fetchCategoryById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch category');
    }
  }
);

export const createCategoryAsync = createAsyncThunk(
  'category/createCategory',
  async (data, { rejectWithValue }) => {
    try {
      const response = await categoryActions.createCategory(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to create category');
    }
  }
);

export const updateCategoryAsync = createAsyncThunk(
  'category/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await categoryActions.updateCategory(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to update category');
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  'category/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await categoryActions.deleteCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to delete category');
    }
  }
);

const initialState = {
  categories: [],
  categoriesForDropdown: [],
  categoriesWithSubcategories: [],
  currentCategory: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all categories
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch categories for dropdown
      .addCase(fetchCategoriesForDropdownAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesForDropdownAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categoriesForDropdown = action.payload;
      })
      .addCase(fetchCategoriesForDropdownAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch categories with subcategories
      .addCase(fetchCategoriesWithSubcategoriesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesWithSubcategoriesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categoriesWithSubcategories = action.payload;
      })
      .addCase(fetchCategoriesWithSubcategoriesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch category by ID
      .addCase(fetchCategoryByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create category
      .addCase(createCategoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.unshift(action.payload);
      })
      .addCase(createCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update category
      .addCase(updateCategoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory?.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
      })
      .addCase(updateCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete category
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter((cat) => cat.id !== action.payload);
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;

