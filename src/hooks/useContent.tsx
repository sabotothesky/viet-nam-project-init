import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from '@/types/common';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  category: string;
  tags: string[];
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  author_profile?: UserProfile;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export const useContent = () => {
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading: loadingPosts } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author_profile:profiles!posts_author_id_fkey(full_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: faqs = [], isLoading: loadingFAQs } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('status', 'active')
        .order('order_index');
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: rules = [], isLoading: loadingRules } = useQuery({
    queryKey: ['rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const createPost = useMutation({
    mutationFn: async (postData: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'view_count'>) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Bài viết đã được tạo!');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast.error('Có lỗi xảy ra khi tạo bài viết');
    },
  });

  const incrementViewCount = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase.rpc('increment_post_views', {
        post_id: postId
      });

      if (error) throw error;
    },
  });

  return {
    posts,
    faqs,
    rules,
    loadingPosts,
    loadingFAQs,
    loadingRules,
    createPost,
    incrementViewCount,
  };
};
