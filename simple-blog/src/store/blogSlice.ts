import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../lib/supabase';
import axios from '../api/axios';


export interface Blog {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id?: string;
}

interface BlogState {
  blogs: Blog[];
  totalCount: number; 
  loading: boolean;    
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  totalCount: 0,
  loading: false,
  error: null,
};

const URL = process.env.MY_SIMPLE_BLOG_URL || 'http://localhost:5000/api/blogs';

// Fetch blogs with pagination
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async ({ page, limit = 2 }: { page: number; limit?: number }, { rejectWithValue }) => {
    try {
      // Logic: Page 1 (0-1), Page 2 (2-3)
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('blogs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to); // Range is inclusive

      if (error) throw error;

      return {
        blogs: data as Blog[],
        totalCount: count || 0,
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk( 
  'blog/deleteBlog',
   async ({ id }: { id: string }, { rejectWithValue }) => {
     try { const { error } = await supabase
     .from('blogs')
     .delete()
     .eq('id', id); 
     if (error) 
      throw error; 
    return id;
   } catch (err: any){ 
    return rejectWithValue(err.message || "Failed to delete"); } } 
  );

//  Create blog
export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async ({ title, content }: { title: string; content: string }, { rejectWithValue }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in.");

      const { data, error } = await supabase
        .from('blogs')
        .insert([{ title, content, user_id: user.id }])
        .select();

      if (error) throw error; 
      return data[0] as Blog;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Update blog
export const updateBlog = createAsyncThunk( 'blog/updateBlog',
  async ({ id, title, content }: { id: string; title: string; content: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .update({ title, content })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0] as Blog;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // When the request starts
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // When the request succeeds
      .addCase(fetchBlogs.fulfilled, (state, action: PayloadAction<{ blogs: Blog[]; totalCount: number }>) => {
        state.loading = false;
        state.blogs = action.payload.blogs;     
        state.totalCount = action.payload.totalCount; 
      })
      // When the request fails
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      builder.addCase(updateBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        const index = state.blogs.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload; 
        }
      });
      builder.addCase(deleteBlog.fulfilled, (state, action) => {
      state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      state.totalCount -= 1; 
    });
  },
});

export default blogSlice.reducer;
