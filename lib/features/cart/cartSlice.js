import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as cartActions from '../../actions/cartActions'

// Check if user is logged in
const isUserLoggedIn = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        return !!(token && user)
    }
    return false
}

// Load cart from localStorage
const loadCartFromStorage = () => {
    if (typeof window !== 'undefined') {
        try {
            const savedCart = localStorage.getItem('cart')
            if (savedCart) {
                return JSON.parse(savedCart)
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error)
        }
    }
    return {
        total: 0,
        cartItems: {},
    }
}

// Save cart to localStorage
const saveCartToStorage = (cart) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('cart', JSON.stringify(cart))
        } catch (error) {
            console.error('Error saving cart to localStorage:', error)
        }
    }
}

const initialState = {
    ...loadCartFromStorage(),
    items: [], // Array of cart items with populated product details (for logged-in users)
    loading: false,
    error: null,
    syncing: false,
}

// Async thunks for backend operations
export const fetchCartAsync = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartActions.fetchCart()
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch cart')
        }
    }
)

export const addToCartAsync = createAsyncThunk(
    'cart/addToCartAsync',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await cartActions.addItemToCart(payload)
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to add to cart')
        }
    }
)

export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCartAsync',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await cartActions.removeItemFromCart(productId)
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to remove from cart')
        }
    }
)

export const deleteCartItemAsync = createAsyncThunk(
    'cart/deleteCartItemAsync',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await cartActions.deleteCartItem(productId)
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete cart item')
        }
    }
)

export const clearCartAsync = createAsyncThunk(
    'cart/clearCartAsync',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartActions.clearUserCart()
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to clear cart')
        }
    }
)

export const syncCartAsync = createAsyncThunk(
    'cart/syncCartAsync',
    async (cartItems, { rejectWithValue }) => {
        try {
            const response = await cartActions.syncCart(cartItems)
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to sync cart')
        }
    }
)

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]++
            } else {
                state.cartItems[productId] = 1
            }
            state.total += 1
            saveCartToStorage(state)
        },
        removeFromCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]--
                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId]
                }
                state.total -= 1
            }
            saveCartToStorage(state)
        },
        deleteItemFromCart: (state, action) => {
            const { productId } = action.payload
            const quantity = state.cartItems[productId] || 0
            state.total -= quantity
            delete state.cartItems[productId]
            saveCartToStorage(state)
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.items = [] // Clear populated items
            state.total = 0
            saveCartToStorage(state)
        },
        loadCart: (state, action) => {
            // Load cart from payload (from backend or localStorage)
            if (action.payload) {
                state.cartItems = action.payload.cartItems || {}
                state.total = action.payload.total || 0
                saveCartToStorage(state)
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCartAsync.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchCartAsync.fulfilled, (state, action) => {
                state.loading = false
                state.cartItems = action.payload.cartItems || {}
                state.items = action.payload.items || [] // Store populated items
                state.total = action.payload.total || 0
                saveCartToStorage(state)
            })
            .addCase(fetchCartAsync.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            // Add to cart async
            .addCase(addToCartAsync.pending, (state) => {
                state.syncing = true
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.syncing = false
                state.cartItems = action.payload.cartItems || {}
                state.items = action.payload.items || [] // Store populated items
                state.total = action.payload.total || 0
                saveCartToStorage(state)
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.syncing = false
                state.error = action.payload
            })
            // Remove from cart async
            .addCase(removeFromCartAsync.pending, (state) => {
                state.syncing = true
            })
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                state.syncing = false
                state.cartItems = action.payload.cartItems || {}
                state.items = action.payload.items || [] // Store populated items
                state.total = action.payload.total || 0
                saveCartToStorage(state)
            })
            .addCase(removeFromCartAsync.rejected, (state, action) => {
                state.syncing = false
                state.error = action.payload
            })
            // Delete cart item async
            .addCase(deleteCartItemAsync.pending, (state) => {
                state.syncing = true
            })
            .addCase(deleteCartItemAsync.fulfilled, (state, action) => {
                state.syncing = false
                state.cartItems = action.payload.cartItems || {}
                state.items = action.payload.items || [] // Store populated items
                state.total = action.payload.total || 0
                saveCartToStorage(state)
            })
            .addCase(deleteCartItemAsync.rejected, (state, action) => {
                state.syncing = false
                state.error = action.payload
            })
            // Clear cart async
            .addCase(clearCartAsync.pending, (state) => {
                state.syncing = true
            })
            .addCase(clearCartAsync.fulfilled, (state, action) => {
                state.syncing = false
                state.cartItems = {}
                state.items = [] // Clear populated items
                state.total = 0
                saveCartToStorage(state)
            })
            .addCase(clearCartAsync.rejected, (state, action) => {
                state.syncing = false
                state.error = action.payload
            })
            // Sync cart async
            .addCase(syncCartAsync.pending, (state) => {
                state.syncing = true
            })
            .addCase(syncCartAsync.fulfilled, (state, action) => {
                state.syncing = false
                state.cartItems = action.payload.cartItems || {}
                state.items = action.payload.items || [] // Store populated items
                state.total = action.payload.total || 0
                saveCartToStorage(state)
            })
            .addCase(syncCartAsync.rejected, (state, action) => {
                state.syncing = false
                state.error = action.payload
            })
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart, loadCart, setLoading, setError } = cartSlice.actions

export default cartSlice.reducer
