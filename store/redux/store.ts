import { configureStore } from "@reduxjs/toolkit";

import citiesReducer from './favoriteCities';

export const store = configureStore({
    reducer: {
        favoriteCities: citiesReducer,
    }
});