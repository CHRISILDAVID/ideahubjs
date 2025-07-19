import { supabase } from '../../lib/supabase';

export class StatsService {
  /**
   * Get platform statistics
   */
  static async getPlatformStats() {
    try {
      // Get total ideas count
      const { count: totalIdeas, error: ideasError } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .eq('visibility', 'public')
        .eq('status', 'published');

      if (ideasError) throw ideasError;

      // Get active users count
      const { count: activeUsers, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Get ideas created this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count: ideasThisWeek, error: weekError } = await supabase
        .from('ideas')
        .select('*', { count: 'exact', head: true })
        .eq('visibility', 'public')
        .eq('status', 'published')
        .gte('created_at', oneWeekAgo.toISOString());

      if (weekError) throw weekError;

      // Get total collaborations (forks + stars)
      const { count: totalStars, error: starsError } = await supabase
        .from('stars')
        .select('*', { count: 'exact', head: true });

      if (starsError) throw starsError;

      const { data: forksData, error: forksError } = await supabase
        .from('ideas')
        .select('forks')
        .eq('visibility', 'public')
        .eq('status', 'published');

      if (forksError) throw forksError;

      const totalForks = forksData?.reduce((sum, idea) => sum + (idea.forks || 0), 0) || 0;
      const totalCollaborations = (totalStars || 0) + totalForks;

      return {
        data: {
          totalIdeas: totalIdeas || 0,
          activeUsers: activeUsers || 0,
          ideasThisWeek: ideasThisWeek || 0,
          totalCollaborations,
        },
        message: 'Platform stats retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  /**
   * Get user dashboard statistics
   */
  static async getUserDashboardStats(userId) {
    try {
      // Get user's ideas
      const { data: userIdeas, error: ideasError } = await supabase
        .from('ideas')
        .select('id, stars, forks')
        .eq('author_id', userId);

      if (ideasError) throw ideasError;

      const totalIdeas = userIdeas?.length || 0;
      const totalStars = userIdeas?.reduce((sum, idea) => sum + (idea.stars || 0), 0) || 0;
      const totalForks = userIdeas?.reduce((sum, idea) => sum + (idea.forks || 0), 0) || 0;
      const totalViews = totalIdeas * 150; // Mock calculation

      // Get recent activity (simplified)
      const recentActivity = [];

      return {
        data: {
          totalIdeas,
          totalStars,
          totalForks,
          totalViews,
          recentActivity,
        },
        message: 'User dashboard stats retrieved successfully',
        success: true,
      };
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }
}
