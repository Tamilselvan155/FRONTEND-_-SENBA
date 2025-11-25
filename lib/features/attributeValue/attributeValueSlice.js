import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as attributeValueActions from '../../actions/attributeValueActions';

// Async thunks
export const fetchAttributeValuesAsync = createAsyncThunk(
  'attributeValue/fetchAttributeValues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attributeValueActions.fetchAttributeValues();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch attribute values');
    }
  }
);

export const fetchAttributeValuesByAttributeAsync = createAsyncThunk(
  'attributeValue/fetchAttributeValuesByAttribute',
  async (attributeId, { rejectWithValue }) => {
    try {
      const response = await attributeValueActions.fetchAttributeValuesByAttribute(attributeId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch attribute values');
    }
  }
);

export const fetchAttributeValueByIdAsync = createAsyncThunk(
  'attributeValue/fetchAttributeValueById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await attributeValueActions.fetchAttributeValueById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to fetch attribute value');
    }
  }
);

export const createAttributeValueAsync = createAsyncThunk(
  'attributeValue/createAttributeValue',
  async (data, { rejectWithValue }) => {
    try {
      const response = await attributeValueActions.createAttributeValue(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to create attribute value');
    }
  }
);

export const updateAttributeValueAsync = createAsyncThunk(
  'attributeValue/updateAttributeValue',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await attributeValueActions.updateAttributeValue(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to update attribute value');
    }
  }
);

export const deleteAttributeValueAsync = createAsyncThunk(
  'attributeValue/deleteAttributeValue',
  async (id, { rejectWithValue }) => {
    try {
      await attributeValueActions.deleteAttributeValue(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.error || error.message || 'Failed to delete attribute value');
    }
  }
);

const initialState = {
  attributeValues: [],
  currentAttributeValue: null,
  loading: false,
  error: null,
};

const attributeValueSlice = createSlice({
  name: 'attributeValue',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAttributeValue: (state) => {
      state.currentAttributeValue = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all attribute values
      .addCase(fetchAttributeValuesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttributeValuesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.attributeValues = action.payload;
      })
      .addCase(fetchAttributeValuesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch attribute values by attribute
      .addCase(fetchAttributeValuesByAttributeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttributeValuesByAttributeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.attributeValues = action.payload;
      })
      .addCase(fetchAttributeValuesByAttributeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch attribute value by ID
      .addCase(fetchAttributeValueByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttributeValueByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAttributeValue = action.payload;
      })
      .addCase(fetchAttributeValueByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create attribute value
      .addCase(createAttributeValueAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttributeValueAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.attributeValues.unshift(action.payload);
      })
      .addCase(createAttributeValueAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update attribute value
      .addCase(updateAttributeValueAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttributeValueAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.attributeValues.findIndex((av) => av.id === action.payload.id);
        if (index !== -1) {
          state.attributeValues[index] = action.payload;
        }
        if (state.currentAttributeValue?.id === action.payload.id) {
          state.currentAttributeValue = action.payload;
        }
      })
      .addCase(updateAttributeValueAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete attribute value
      .addCase(deleteAttributeValueAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttributeValueAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.attributeValues = state.attributeValues.filter((av) => av.id !== action.payload);
      })
      .addCase(deleteAttributeValueAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentAttributeValue } = attributeValueSlice.actions;
export default attributeValueSlice.reducer;

