import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  User,
  Brain,
  TrendingUp,
  BookOpen,
  Star,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useProgressStore } from '../../stores/progressStore';
import { getLevelTitle, getProgressToNextLevel } from '../../utils/levelUtils';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { dueTodayCount } = useProgressStore();

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/roadmap', label: 'Roadmap', icon: Map },
    { to: '/profile', label: 'Mon Profil', icon: User },
  ];

  const xpProgress = user ? getProgressToNextLevel(user.xp) : 0;
  const levelTitle = user ? getLevelTitle(user.xp) : '';

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen pt-16"
      style={{ backgroundColor: '#0E0E2C', borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex flex-col flex-1 px-4 py-6 gap-6">
        {/* User card */}
        {user && (
          <div className="glass-card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{user.username}</p>
                <p className="text-violet-400 text-xs">Niv. {user.level} — {levelTitle}</p>
              </div>
            </div>

            {/* XP Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>XP</span>
                <span>{Math.round(xpProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1">
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
            Navigation
          </p>
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${active
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }
                `}
              >
                <Icon size={17} />
                <span>{label}</span>
                {to === '/dashboard' && dueTodayCount > 0 && (
                  <span className="ml-auto bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {dueTodayCount > 9 ? '9+' : dueTodayCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        {user && (
          <div className="space-y-2 mt-auto">
            <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
              Stats rapides
            </p>
            <div className="glass-card p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Brain size={13} />
                  <span>Concepts</span>
                </div>
                <span className="text-emerald-400 text-xs font-semibold">
                  {user.level * 2}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <TrendingUp size={13} />
                  <span>XP Total</span>
                </div>
                <span className="text-violet-400 text-xs font-semibold">
                  {user.xp?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <BookOpen size={13} />
                  <span>Révisions</span>
                </div>
                <span className="text-amber-400 text-xs font-semibold">
                  {dueTodayCount} aujourd'hui
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Star size={13} />
                  <span>ELO</span>
                </div>
                <span className="text-cyan-400 text-xs font-semibold">
                  {user.eloRating ?? 1200}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
