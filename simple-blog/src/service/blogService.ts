import { supabase } from '../lib/supabase'; 

export const getBlogs = async () => {
  const { data, error } = await supabase.from('blogs').select('*');
  if (error) throw error;
  return data;
};