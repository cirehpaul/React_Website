import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import axios from '../api/axios';

export const register = createAsyncThunk<
  User | null, 
  { email: string; password: string }, 
  { rejectValue: string }
>(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Use Supabase directly instead of axios
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return rejectWithValue(error.message);
      }
      return data.user; 
      
    } catch (err: any) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);
export interface LoginCredentials {
  email: string;
  password: string;
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error; 
      }

      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
export const logout = createAsyncThunk('auth/logout', async () => {
  await supabase.auth.signOut();
});
