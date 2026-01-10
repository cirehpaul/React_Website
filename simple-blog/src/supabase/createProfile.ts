import { supabase } from '../supabase/supabase';

export const createProfile = async (user: any) => {
  const { error } = await supabase.from('profiles').insert({
    id: user.id,
    email: user.email,
  });

  if (error) throw error;
};
