import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from './authTypes';
import { login, register, logout } from './authThunks';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
      })
      .addCase(register.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? 'Registration failed';
      })

      // Login
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload;
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? 'Login failed';
      })

      // Logout
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
      });
  },
});

export default authSlice.reducer;
