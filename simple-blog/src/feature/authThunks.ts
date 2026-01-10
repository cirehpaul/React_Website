import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import axios from '../api/axios';

export const register = createAsyncThunk<
  any, 
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/register',
        data
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Server error'
      );
    }
  }
);

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return rejectWithValue(error?.message ?? 'Invalid login credentials');
  }

  return data.user;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await supabase.auth.signOut();
});
