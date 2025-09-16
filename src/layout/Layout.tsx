import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header, Loading } from '@components/index';

const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default Layout;
