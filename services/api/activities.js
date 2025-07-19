import { supabase } from '../../lib/supabase';
import { transformDbUser, createBasicIdea } from './transformers';

export class ActivitiesService {
  /**
   * Get general activity feed
   */
  static async getActivityFeed() {
    try {
      // Get recent ideas as activity (simplified approach)
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          id,
          title,
          created_at,
          author:users(*)
        `)
        .eq('visibility', 'public')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const activities = data?.map((item) => ({
        id: `activity-${item.id}`,
        type: 'created',
        user: transformDbUser(item.author),
        idea: createBasicIdea(item),
        description: `created a new idea`,
        timestamp: item.created_at,
      })) || [];

      return {
        data: activities,
        message: 'Activity feed retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  /**
   * Get user-specific activity feed
   */
  static async getUserActivityFeed(userId) {
    try {
      // Get user's recent ideas
      const { data, error } = await supabase
        .from('ideas')
        .select(`
          id,
          title,
          created_at,
          author:users(*)
        `)
        .eq('author_id', userId)
        .eq('visibility', 'public')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const activities = data?.map((item) => ({
        id: `user-activity-${item.id}`,
        type: 'created',
        user: transformDbUser(item.author),
        idea: createBasicIdea(item),
        description: `created a new idea`,
        timestamp: item.created_at,
      })) || [];

      return {
        data: activities,
        message: 'User activity feed retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }
}
