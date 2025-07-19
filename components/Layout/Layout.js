import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

