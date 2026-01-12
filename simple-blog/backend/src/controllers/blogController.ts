import { Request, Response } from 'express';
import { supabase } from '../lib/supabase'; 

export const fetchBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('blogs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    res.status(200).json({ blogs: data, totalCount: count || 0 });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) throw error;
    res.status(200).json({ id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const { data, error } = await supabase
      .from('blogs')
      .update({ title, content })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.status(200).json(data[0]);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};