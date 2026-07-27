import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, LayoutDashboard, Layers, Star, BarChart3, Search, Info, User } from 'lucide-react';
import clsx from 'clsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-1">
              <Link to="/" className="flex items-center gap-2 px-3 py-2 text-lg font-bold text-primary-600">
                <Layers className="w-6 h-6" />
                Learning Log
              </Link>
              {user && (
                <div className="hidden md:flex items-center gap-1 ml-4">
                  <NavLink to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
                  <NavLink to="/topics" icon={<Layers className="w-4 h-4" />} label="Topics" />
                  <NavLink to="/favorites" icon={<Star className="w-4 h-4" />} label="Favorites" />
                  <NavLink to="/stats" icon={<BarChart3 className="w-4 h-4" />} label="Stats" />
                  <NavLink to="/search" icon={<Search className="w-4 h-4" />} label="Search" />
                </div>
              )}
              <NavLink to="/about" icon={<Info className="w-4 h-4" />} label="About" />
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="hidden sm:inline">{user.username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const { pathname } = useLocation();
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={clsx(
        'flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
        isActive
          ? 'text-primary-600 bg-primary-50'
          : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
