import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const favoriteCities = createSlice({
  name: 'favoriteCities',
  initialState: {
    favoriteCities: [],
    loading: false,
    error: null,
  },
  reducers: {
    setFavoriteCities: (state, action) => {
                state.favoriteCities = action.payload.favoriteCities;
                AsyncStorage.setItem('favoriteCities', JSON.stringify(action.payload.favoriteCities));
        
            }
  },
  extraReducers: (builder) => {
    builder.addCase(loadFavoriteCities.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadFavoriteCities.fulfilled, (state, action) => {
      state.favoriteCities = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(loadFavoriteCities.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});

export const loadFavoriteCities = createAsyncThunk(
  'favoriteCities/loadFavoriteCities',
  async () => {
    const favoriteCities = await AsyncStorage.getItem('favoriteCities');
    return JSON.parse(favoriteCities);
  }
);



export const setFavoriteCities = favoriteCities.actions.setFavoriteCities;
export default favoriteCities.reducer;