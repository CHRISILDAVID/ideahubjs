import { supabase } from '../../lib/supabase';
import { transformDbIdea } from './transformers';
import { AuthService } from './auth';

export class IdeasService {
  /**
   * Get ideas with optional filters
   */
  static async getIdeas(filters = {}) {
    try {
      let query = supabase
        .from('ideas')
        .select(`
          *,
          author:users(*),
          is_starred:stars!left(user_id)
        `)
        .eq('visibility', 'public')
        .eq('status', 'published');

      // Apply filters
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters.language && filters.language !== 'all') {
        query = query.eq('language', filters.language);
      }

      if (filters.query) {
        query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
      }

      // Apply sorting
      switch (filters.sort) {
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'most-stars':
          query = query.order('stars', { ascending: false });
          break;
        case 'most-forks':
          query = query.order('forks', { ascending: false });
          break;
        case 'recently-updated':
          query = query.order('updated_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;

      const ideas = data?.map((item) => {
        const isStarred = item.is_starred?.length > 0;
        return transformDbIdea({ ...item, is_starred: isStarred });
      }) || [];

      return {
        data: ideas,
        message: 'Ideas retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  /**
   * Get a single idea by ID
   */
  static async getIdea(id) {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          author:users(*),
          is_starred:stars!left(user_id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const isStarred = data.is_starred?.length > 0;
      const idea = transformDbIdea({ ...data, is_starred: isStarred });

      return {
        data: idea,
        message: 'Idea retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  /**
   * Create a new idea
   */
  static async createIdea(ideaData) {
    try {
      const userId = await AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('ideas')
        .insert({
          title: ideaData.title,
          description: ideaData.description,
          content: ideaData.content,
          author_id: userId,
          tags: ideaData.tags || [],
          category: ideaData.category,
          license: ideaData.license || 'MIT',
          visibility: ideaData.visibility || 'public',
          language: ideaData.language,
          status: ideaData.status || 'published',
        })
        .select(`
          *,
          author:users(*)
        `)
        .single();

      if (error) throw error;

      const idea = transformDbIdea(data);

      return {
        data: idea,
        message: 'Idea created successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  /**
   * Update an existing idea
   */
  static async updateIdea(id, ideaData) {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .update({
          title: ideaData.title,
          description: ideaData.description,
          content: ideaData.content,
          tags: ideaData.tags,
          category: ideaData.category,
          license: ideaData.license,
          visibility: ideaData.visibility,
          language: ideaData.language,
          status: ideaData.status,
        })
        .eq('id', id)
        .select(`
          *,
          author:users(*)
        `)
        .single();

      if (error) throw error;

      const idea = transformDbIdea(data);

      return {
        data: idea,
        message: 'Idea updated successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  /**
   * Delete an idea
   */
  static async deleteIdea(id) {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        data: undefined,
        message: 'Idea deleted successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  /**
   * Star or unstar an idea
   */
  static async starIdea(id) {
    try {
      const userId = await AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Check if already starred
      const { data: existingStar } = await supabase
        .from('stars')
        .select('id')
        .eq('user_id', userId)
        .eq('idea_id', id)
        .single();

      if (existingStar) {
        // Unstar
        const { error } = await supabase
          .from('stars')
          .delete()
          .eq('user_id', userId)
          .eq('idea_id', id);

        if (error) throw error;

        return {
          data: undefined,
          message: 'Idea unstarred',
          success: true,
        };
      } else {
        // Star
        const { error } = await supabase
          .from('stars')
          .insert({
            user_id: userId,
            idea_id: id,
          });

        if (error) throw error;

        return {
          data: undefined,
          message: 'Idea starred',
          success: true,
        };
      }
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  /**
   * Fork an idea
   */
  static async forkIdea(id) {
    try {
      const userId = await AuthService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      // Get original idea
      const { data: originalIdea, error: fetchError } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Create fork
      const { data, error } = await supabase
        .from('ideas')
        .insert({
          title: `${originalIdea.title} (Fork)`,
          description: originalIdea.description,
          content: originalIdea.content,
          author_id: userId,
          tags: originalIdea.tags,
          category: originalIdea.category,
          license: originalIdea.license,
          visibility: 'public',
          language: originalIdea.language,
          is_fork: true,
          forked_from: id,
        })
        .select(`
          *,
          author:users(*)
        `)
        .single();

      if (error) throw error;

      // Update fork count
      await supabase
        .from('ideas')
        .update({ forks: originalIdea.forks + 1 })
        .eq('id', id);

      const idea = transformDbIdea(data);

      return {
        data: idea,
        message: 'Idea forked successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  /**
   * Get popular/trending ideas
   */
  static async getPopularIdeas() {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          author:users(*),
          is_starred:stars!left(user_id)
        `)
        .eq('visibility', 'public')
        .eq('status', 'published')
        .order('stars', { ascending: false })
        .limit(10);

      if (error) throw error;

      const ideas = data?.map((item) => {
        const isStarred = item.is_starred?.length > 0;
        return transformDbIdea({ ...item, is_starred: isStarred });
      }) || [];

      return {
        data: ideas,
        message: 'Popular ideas retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  /**
   * Get user's starred ideas
   */
  static async getStarredIdeas(userId) {
    try {
      const { data, error } = await supabase
        .from('stars')
        .select(`
          idea:ideas(
            *,
            author:users(*)
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const ideas = data?.map((item) => 
        transformDbIdea({ ...item.idea, is_starred: true })
      ) || [];

      return {
        data: ideas,
        message: 'Starred ideas retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  /**
   * Get user's forked ideas
   */
  static async getForkedIdeas(userId) {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          author:users(*),
          is_starred:stars!left(user_id)
        `)
        .eq('author_id', userId)
        .eq('is_fork', true);

      if (error) throw error;

      const ideas = data?.map((item) => {
        const isStarred = item.is_starred?.length > 0;
        return transformDbIdea({ ...item, is_starred: isStarred });
      }) || [];

      return {
        data: ideas,
        message: 'Forked ideas retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  /**
   * Get ideas created by a specific user
   */
  static async getUserIdeas(userId) {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          *,
          author:users(*),
          is_starred:stars!left(user_id)
        `)
        .eq('author_id', userId)
        .eq('visibility', 'public')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ideas = data?.map((item) => {
        const isStarred = item.is_starred?.length > 0;
        return transformDbIdea({ ...item, is_starred: isStarred });
      }) || [];

      return {
        data: ideas,
        message: 'User ideas retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }
}
