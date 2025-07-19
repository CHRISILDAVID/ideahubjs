import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { supabaseApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const currentUser = await supabaseApi.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user && session.user.email_confirmed_at) {
          // Ensure user profile exists
          await ensureUserProfile(session.user);
          const currentUser = await supabaseApi.getCurrentUser();
          setUser(currentUser);
        } else if (event === 'TOKEN_REFRESHED' && session?.user && session.user.email_confirmed_at) {
          const currentUser = await supabaseApi.getCurrentUser();
          setUser(currentUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const ensureUserProfile = async (user) => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile from user metadata
        const userData = {
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
          email: user.email,
          full_name: user.user_metadata?.full_name || 'User',
        };

        const { error } = await supabase
          .from('users')
          .insert(userData);

        if (error) {
          console.error('Error creating user profile:', error);
          throw error;
        }
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      await supabaseApi.signIn(email, password);
      // User will be set via onAuthStateChange
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      await supabaseApi.signUp(userData.email, userData.password, {
        username: userData.username,
        fullName: userData.fullName,
      });
      // User will be set via onAuthStateChange after email confirmation
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    supabaseApi.signOut();
    // User will be cleared via onAuthStateChange
  };

  const updateProfile = async (userData) => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Map from frontend User type to database fields
      const dbUserData = {
        ...(userData.username && { username: userData.username }),
        ...(userData.fullName && { full_name: userData.fullName }),
        ...(userData.avatar && { avatar_url: userData.avatar }),
        ...(userData.bio && { bio: userData.bio }),
        ...(userData.location && { location: userData.location }),
        ...(userData.website && { website: userData.website }),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('users')
        .update(dbUserData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      // Fetch updated user data
      const updatedUser = await supabaseApi.getCurrentUser();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
