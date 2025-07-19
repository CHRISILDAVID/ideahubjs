import React from 'react';
import Link from 'next/link';
import { Home, Compass, TrendingUp, Star, GitFork, Users, Bell, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar = () => {
  const { isAuthenticated } = useAuth();

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Popular', href: '/popular', icon: TrendingUp },
  ];

  const authenticatedItems = [
    { name: 'Starred', href: '/starred', icon: Star },
    { name: 'Forks', href: '/forks', icon: GitFork },
    { name: 'Following', href: '/following', icon: Users },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {isAuthenticated && (
          <>
            <hr className="my-4 border-gray-200 dark:border-gray-700" />
            {authenticatedItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>
    </aside>
  );
};
