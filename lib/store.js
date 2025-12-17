import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import productReducer from './features/product/productSlice'
import addressReducer from './features/address/addressSlice'
import ratingReducer from './features/rating/ratingSlice'

import authReducer from './features/login/authSlice';
import wishlistReducer from './features/wishlist/wishlistSlice'

import enquiryReducer from './features/enquiry/enquirySlice';

import attributeReducer from './features/attribute/attributeSlice';
import attributeValueReducer from './features/attributeValue/attributeValueSlice';
import categoryReducer from './features/category/categorySlice';
import brandReducer from './features/brand/brandSlice';
import bannerReducer from './features/banner/bannerSlice';
import assetReducer from './features/asset/assetSlice';
import userReducer from './features/user/userSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
            product: productReducer,
            address: addressReducer,
            rating: ratingReducer,

            auth: authReducer,

            wishlist: wishlistReducer,

            enquiry: enquiryReducer,

            attribute: attributeReducer,
            attributeValue: attributeValueReducer,
            category: categoryReducer,
            brand: brandReducer,
            banner: bannerReducer,
            asset: assetReducer,
            user: userReducer,

        },
            // preloadedState: typeof window !== 'undefined' ? loadFromLocalStorage() : initialState,

    })
}