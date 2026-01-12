import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase.ts';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = "";//await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error'});
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    
    const { email, password } = req.body;
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Register the user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,      
      password: password, 
    });

    //  Check for Supabase-specific errors
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Send success back to React
    res.status(201).json({
      message: 'Registration successful!',
      token: data.session?.access_token,
      user: data.user
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // This captures the UUID from the URL

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id); // Matches the 'id' column in Supabase with the param

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Success: Return the id so Redux can filter it out of the state
    return res.status(200).json({ id, message: "Blog deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Server error during deletion" });
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

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Returns the updated blog object to the frontend
    return res.status(200).json(data[0]);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error during update" });
  }
};