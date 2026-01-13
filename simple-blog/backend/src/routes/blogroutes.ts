import express from 'express';
import { fetchBlogs, deleteBlog, updateBlog } from '../controllers/blogController.ts';

const router = express.Router();

router.get('/', fetchBlogs);
router.delete('/:id', deleteBlog);
router.put('/:id', updateBlog);

export default router;