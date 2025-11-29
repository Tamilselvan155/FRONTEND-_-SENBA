import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productActions from '../../actions/productActions';

// Async thunks
export const fetchProductsAsync = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productActions.fetchProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductByIdAsync = createAsyncThunk(
  'product/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productActions.fetchProductById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch product');
    }
  }
);

export const createProductAsync = createAsyncThunk(
  'product/createProduct',
  async (data, { rejectWithValue }) => {
    try {
      const response = await productActions.createProduct(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to create product');
    }
  }
);

export const updateProductAsync = createAsyncThunk(
  'product/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await productActions.updateProduct(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to update product');
    }
  }
);

export const deleteProductAsync = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productActions.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to delete product');
    }
  }
);

const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch product by ID
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create product
      .addCase(createProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update product
      .addCase(updateProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => (p.id || p._id) === (action.payload.id || action.payload._id));
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct && (state.currentProduct.id || state.currentProduct._id) === (action.payload.id || action.payload._id)) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => (p.id || p._id) !== action.payload);
      })
      .addCase(deleteProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
