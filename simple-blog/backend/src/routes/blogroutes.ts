// routes/blogroutes.ts
import express from 'express';
import { fetchBlogs, deleteBlog, updateBlog } from '../controllers/blogController.ts';

const router = express.Router();

// GET api by ID
router.get('/', fetchBlogs);

// DELETE by ID
router.delete('/:id', deleteBlog);

// PUT by ID
router.put('/:id', updateBlog);

export default router;