import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export interface Blog {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface BlogState {
  blogs: Blog[];
}

const initialState: BlogState = {
  blogs: [],
};

// Fetch blogs
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async ({ page }: { page: number }) => {
    const response = await fetch(`/api/blogs?page=${page}`);
    return (await response.json()) as Blog[];
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id: string) => {
    await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    return id;
  }
);

// ✅ Create blog
export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async ({ title, content }: { title: string; content: string }) => {
    const response = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (!response.ok) throw new Error('Failed to create blog');
    return (await response.json()) as Blog;
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => {
        state.blogs = action.payload;
      })
      .addCase(deleteBlog.fulfilled, (state, action: PayloadAction<string>) => {
        state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
      })
      .addCase(createBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.blogs.unshift(action.payload); // add new blog to the top
      });
  },
});

export default blogSlice.reducer;
