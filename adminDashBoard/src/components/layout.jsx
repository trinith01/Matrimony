import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavigationBar } from './nav-bar';
import { Toaster } from 'sonner';

function Layout() {
  return (
    <div>
      <NavigationBar />
      <main>
        <div className="mx-1 py-3 px-3">
          {/* This is where the main content will be rendered */}
          <Outlet />
          <Toaster />
        </div>
      </main>

    </div>
  );
}

export default Layout;

