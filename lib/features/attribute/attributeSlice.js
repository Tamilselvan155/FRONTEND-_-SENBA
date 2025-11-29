import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as attributeActions from '../../actions/attributeActions';

// Async thunks
export const fetchAttributesAsync = createAsyncThunk(
  'attribute/fetchAttributes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attributeActions.fetchAttributes();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch attributes');
    }
  }
);

export const fetchAttributeByIdAsync = createAsyncThunk(
  'attribute/fetchAttributeById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await attributeActions.fetchAttributeById(id);
      // Handle response structure: { success: true, data: {...} }
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch attribute');
    }
  }
);

export const createAttributeAsync = createAsyncThunk(
  'attribute/createAttribute',
  async (data, { rejectWithValue }) => {
    try {
      const response = await attributeActions.createAttribute(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to create attribute');
    }
  }
);

export const updateAttributeAsync = createAsyncThunk(
  'attribute/updateAttribute',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await attributeActions.updateAttribute(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to update attribute');
    }
  }
);

export const deleteAttributeAsync = createAsyncThunk(
  'attribute/deleteAttribute',
  async (id, { rejectWithValue }) => {
    try {
      await attributeActions.deleteAttribute(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to delete attribute');
    }
  }
);

const initialState = {
  attributes: [],
  currentAttribute: null,
  loading: false,
  error: null,
};

const attributeSlice = createSlice({
  name: 'attribute',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAttribute: (state) => {
      state.currentAttribute = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all attributes
      .addCase(fetchAttributesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttributesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.attributes = action.payload;
      })
      .addCase(fetchAttributesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch attribute by ID
      .addCase(fetchAttributeByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttributeByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAttribute = action.payload;
      })
      .addCase(fetchAttributeByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create attribute
      .addCase(createAttributeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttributeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.attributes.unshift(action.payload);
      })
      .addCase(createAttributeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update attribute
      .addCase(updateAttributeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttributeAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.attributes.findIndex((attr) => attr.id === action.payload.id);
        if (index !== -1) {
          state.attributes[index] = action.payload;
        }
        if (state.currentAttribute?.id === action.payload.id) {
          state.currentAttribute = action.payload;
        }
      })
      .addCase(updateAttributeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete attribute
      .addCase(deleteAttributeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttributeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.attributes = state.attributes.filter((attr) => attr.id !== action.payload);
      })
      .addCase(deleteAttributeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentAttribute } = attributeSlice.actions;
export default attributeSlice.reducer;

