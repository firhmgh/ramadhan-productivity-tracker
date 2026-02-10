import { useEffect } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { 
  Home, 
  CheckSquare, 
  Moon, 
  DollarSign, 
  Calendar, 
  ClipboardList, 
  Target, 
  User,
  LogOut
} from 'lucide-react';

export function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-emerald-600">Loading...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/daily', label: 'Daily', icon: CheckSquare },
    { path: '/puasa', label: 'Puasa', icon: Moon },
    { path: '/zakat', label: 'Zakat', icon: DollarSign },
    { path: '/calendar', label: 'Kalender', icon: Calendar },
    { path: '/agenda', label: 'Agenda', icon: ClipboardList },
    { path: '/targets', label: 'Target', icon: Target },
    { path: '/profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
              <Moon size={20} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="font-bold text-emerald-800">Ramadhan Care</h1>
              <p className="text-xs text-emerald-600">Assalamu'alaikum, {user.fullName.split(' ')[0]}</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Logout</span>
          </motion.button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-emerald-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-emerald-600 hover:bg-emerald-50'
                  }`
                }
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
