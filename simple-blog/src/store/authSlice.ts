import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Simulated login API
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    //  API delay
    await new Promise((res) => setTimeout(res, 500));
    if (!email || !password) throw new Error('Invalid credentials');
    return { id: '1', email } as User;
  }
);

// Simulated register API
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }: { email: string; password: string }) => {
    await new Promise((res) => setTimeout(res, 500));
    if (!email || !password) throw new Error('Registration failed');
    return { id: '1', email } as User;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
