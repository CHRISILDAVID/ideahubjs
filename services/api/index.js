// Import and re-export all API services and utilities
import { AuthService } from './auth';
import { IdeasService } from './ideas';
import { ActivitiesService } from './activities';
import { StatsService } from './stats';

// Re-export all services
export { AuthService, IdeasService, ActivitiesService, StatsService };

// Re-export transformers and types
export {
  transformDbUser,
  transformDbIdea,
  createBasicIdea,
} from './transformers';

// Main API object for backward compatibility
export const supabaseApi = {
  // Authentication
  signUp: AuthService.signUp,
  signIn: AuthService.signIn,
  signOut: AuthService.signOut,
  getCurrentUser: AuthService.getCurrentUser,

  // Ideas
  getIdeas: IdeasService.getIdeas,
  getIdea: IdeasService.getIdea,
  createIdea: IdeasService.createIdea,
  updateIdea: IdeasService.updateIdea,
  deleteIdea: IdeasService.deleteIdea,
  starIdea: IdeasService.starIdea,
  forkIdea: IdeasService.forkIdea,
  getPopularIdeas: IdeasService.getPopularIdeas,
  getStarredIdeas: IdeasService.getStarredIdeas,
  getForkedIdeas: IdeasService.getForkedIdeas,
  getUserIdeas: IdeasService.getUserIdeas,

  // Activities
  getActivityFeed: ActivitiesService.getActivityFeed,
  getUserActivityFeed: ActivitiesService.getUserActivityFeed,

  // Stats
  getUserDashboardStats: StatsService.getUserDashboardStats,
  getPlatformStats: StatsService.getPlatformStats,
};

// Simplified API object
export const api = supabaseApi;
