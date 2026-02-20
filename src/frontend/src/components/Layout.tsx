import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import MobileNavigation from './MobileNavigation';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <MobileNavigation />
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
