import { supabase } from '../lib/supabase.ts';


export const deleteBlog = async (req: Request): Promise<Response> => {
    try {
        const { id } = await req.json();
        const { error } = await supabase.from('blogs').delete().eq('id', id);

        if (error) throw error;
            return new Response(JSON.stringify({ id }), 
              { status: 200, headers:
                { "Content-Type": "application/json" } 
              });
            }catch (error: any) {
        return new Response(JSON.stringify(
            { message: error.message }),
            { status: 500, headers: 
                { "Content-Type": "application/json" } 
            });
         }
        };

export const updateBlog = async (req: Request): Promise<Response> => {
    try {
        const { id, title, content } = await req.json();
        const { error } = await supabase.from('blogs').update({ title, content }).eq('id', id);
        if (error) throw error;
        return new Response(JSON.stringify({ id, title, content }), 
            { status: 200, headers: 
                { "Content-Type": "application/json" } 
            });
    } catch (error: any) {
        return new Response(JSON.stringify(
            { message: error.message }),
            { status: 500, headers: 
                { "Content-Type": "application/json" } 
            });
        }     
};

export const fetchBlogs = async (req: Request): Promise<Response> => {
    try {
        const url = new URL(req.url); 
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const { data, error, count } = await supabase
            .from('blogs')
            .select('*', { count: 'exact' })    
            .range(from, to);

        if (error) throw error;
        return new Response(JSON.stringify({ data, count }), 
            { status: 200, headers: 
                { "Content-Type": "application/json" } 
            });

    } catch (error: any) {

        return new Response(JSON.stringify(

            { message: error.message }),
            { status: 500, headers: 
                { "Content-Type": "application/json" } 
            });
    }
};