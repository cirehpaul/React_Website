import cors from 'cors';
import { register } from './controllers/auth.controller.ts';
import { updateBlog,deleteBlog,fetchBlogs } from './controllers/blogsController.ts';
import express from "npm:express@4.18.2";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";


const app = express(); // Create API 

app.use(cors({
  origin: (origin, callback) => {
    // This allows requests with no origin 
    if (!origin || origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  console.log(`Incoming request: ${req.method} to ${path}`);

  // This logic ensures that even if you call /api/register, 
  // the function will catch it instead of throwing a 'Cannot POST'
  if (req.method === 'POST' && path.includes('/register')) {
   // Call the exported handler 
   return await register(req);
  }

  if (req.method === "PUT" && path.includes("/update-blog")) 
    
    { return await updateBlog(req); } 

  if (req.method === "DELETE" && path.includes("/delete-blog")) 
    { return await deleteBlog(req); } 

  if (req.method === "GET" && path.includes("/fetch-blogs"))
     { return await fetchBlogs(req); }

  // Fallback so you don't get a generic error
  return new Response(`Function is working, but path ${path} not found`, { status: 404 });
})

// Export handler
serve(app);

