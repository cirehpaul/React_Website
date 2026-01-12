import { supabase } from '../lib/supabase.ts';

export const register = async (req: Request): Promise<Response> => {
  try {
    const body = await req.json();
    console.log ('Register Request:', { body });
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return new Response( JSON.stringify({ message: 'Email and password required' }), 
        { status: 400, headers: { "Content-Type": "application/json" },  }
      );
    }

    // Register the user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email: email,      
      password: password, 
    });

    //  Check for Supabase-specific errors
    if (error) {
       return new Response( JSON.stringify({ message: error.message }), 
        { status: 400, headers: { "Content-Type": "application/json" },  }
      );
    }

    // Send success back to React
    return new Response( JSON.stringify({ 
       message: 'Registration successful!',
      token: data.session?.access_token,
      user: data.user
    }), 
        { status: 201, headers: { "Content-Type": "application/json" },  }
      );
  } catch (error) {
    console.error("Register Error:", error);
    return new Response( JSON.stringify({ message: error.message }), 
        { status: 400, headers: { "Content-Type": "application/json" },  }
      );
  }
};