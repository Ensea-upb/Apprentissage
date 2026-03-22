import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  LayoutDashboard,
  Map,
  User,
  Flame,
  Coins,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/roadmap', label: 'Roadmap', icon: Map },
    { to: '/profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{ backgroundColor: 'rgba(14, 14, 44, 0.95)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-900/40 group-hover:shadow-violet-900/60 transition-shadow">
              <Brain size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white hidden sm:block">
              DataQuest <span className="text-violet-400">AI</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${active
                      ? 'bg-violet-600/20 text-violet-300'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span className="hidden sm:block">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: User Stats + Logout */}
          <div className="flex items-center gap-2">
            {user && (
              <>
                {/* DataCoins */}
                <div className="flex items-center gap-1.5 bg-amber-900/20 border border-amber-700/30 px-2.5 py-1.5 rounded-full">
                  <Coins size={14} className="text-amber-400" />
                  <span className="text-amber-300 text-xs font-semibold">
                    {user.dataCoins?.toLocaleString() ?? 0}
                  </span>
                </div>

                {/* Streak */}
                <div className="flex items-center gap-1.5 bg-orange-900/20 border border-orange-700/30 px-2.5 py-1.5 rounded-full">
                  <Flame size={14} className="text-orange-400" />
                  <span className="text-orange-300 text-xs font-semibold">
                    {user.streak ?? 0}
                  </span>
                </div>

                {/* XP */}
                <div className="flex items-center gap-1.5 bg-violet-900/20 border border-violet-700/30 px-2.5 py-1.5 rounded-full">
                  <Zap size={14} className="text-violet-400" />
                  <span className="text-violet-300 text-xs font-semibold">
                    {user.xp?.toLocaleString() ?? 0} XP
                  </span>
                </div>

                {/* Username + Level */}
                <div className="hidden md:flex items-center gap-2 ml-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-slate-200 text-xs font-medium">{user.username}</p>
                    <p className="text-slate-500 text-xs">Niv. {user.level}</p>
                  </div>
                </div>
              </>
            )}

            {/* Logout */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-1 p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 transition-all duration-200"
              title="Se déconnecter"
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}
