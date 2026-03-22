import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Zap, Trophy, Flame, Coins, Target, TrendingUp,
  Star, Brain, Calendar, Award,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import { progressApi } from '../api/progress';
import { UserStats, ErrorType, SkillLevel } from '../types';
import {
  getLevelTitle, getProgressToNextLevel, getXPForLevel, formatXP,
} from '../utils/levelUtils';

const ERROR_COLORS: Record<ErrorType, string> = {
  conceptual: '#7C3AED',
  mathematical: '#06B6D4',
  application: '#F59E0B',
  reading: '#F43F5E',
};

const ERROR_LABELS: Record<ErrorType, string> = {
  conceptual: 'Conceptuel',
  mathematical: 'Mathématique',
  application: 'Application',
  reading: 'Lecture',
};

const MOCK_BADGES = [
  { id: '1', name: 'Premier pas', description: 'Première session complétée', icon: '🎯', category: 'learning' },
  { id: '2', name: 'Apprenti Statisticien', description: '5 concepts maîtrisés', icon: '📊', category: 'mastery' },
  { id: '3', name: 'Curieux', description: '3 jours de suite', icon: '🔥', category: 'streak' },
  { id: '4', name: 'Matheux', description: '100% en phase Math', icon: '∑', category: 'speed' },
  { id: '5', name: 'ML Pioneer', description: 'Bloc 3 commencé', icon: '🤖', category: 'special' },
  { id: '6', name: 'Data Explorer', description: 'Roadmap explorée', icon: '🗺️', category: 'learning' },
];

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  className = '',
}: {
  icon: React.ComponentType<{ size: number; style?: React.CSSProperties }>;
  label: string;
  value: string | number;
  color: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-4 flex items-center gap-4 ${className}`}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}30` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-slate-500 text-xs">{label}</p>
        <p className="text-white font-bold text-xl">{value}</p>
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { conceptProgress, loadProgress } = useProgressStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await loadProgress();
      const userStats = await progressApi.getUserStats();
      setStats(userStats);
    } catch {
      // Use computed stats from progress
    } finally {
      setIsLoading(false);
    }
  };

  const xpProgress = user ? getProgressToNextLevel(user.xp) : 0;
  const levelTitle = user ? getLevelTitle(user.xp) : '';
  const masteredCount = Object.values(conceptProgress).filter((p) => p.isValidated).length;
  const inProgressCount = Object.values(conceptProgress).filter(
    (p) => !p.isValidated && (p.phase1Done || p.phase2Done || p.phase3Done)
  ).length;

  // Error breakdown for chart
  const errorData = stats
    ? (Object.entries(stats.errorBreakdown) as [ErrorType, number][])
        .filter(([, v]) => v > 0)
        .map(([type, count]) => ({
          name: ERROR_LABELS[type],
          value: count,
          color: ERROR_COLORS[type],
        }))
    : [
        { name: 'Conceptuel', value: 40, color: '#7C3AED' },
        { name: 'Mathématique', value: 25, color: '#06B6D4' },
        { name: 'Application', value: 20, color: '#F59E0B' },
        { name: 'Lecture', value: 15, color: '#F43F5E' },
      ];

  // Radar data for skills — real data from backend, fallback to zeros
  const DEFAULT_SKILLS: SkillLevel[] = [
    { subject: 'Maths', value: 0 },
    { subject: 'Données', value: 0 },
    { subject: 'ML', value: 0 },
    { subject: 'Deep Learning', value: 0 },
    { subject: 'NLP / LLM', value: 0 },
    { subject: 'MLOps / BDD', value: 0 },
  ];
  const radarData: SkillLevel[] = stats?.skills && stats.skills.length > 0 ? stats.skills : DEFAULT_SKILLS;

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'DQ';
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })
    : 'Mars 2026';

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {/* Profile header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-900/15 to-indigo-900/10 pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-violet-900/50">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-bg-primary flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{user?.level}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
                  <Badge variant="violet" size="sm" dot>{levelTitle}</Badge>
                </div>
                <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                  <Calendar size={13} />
                  Membre depuis {joinDate}
                </p>

                {/* XP bar */}
                <div className="mt-3 max-w-xs">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Niveau {user?.level}</span>
                    <span className="text-violet-400">{formatXP(user?.xp || 0)} XP</span>
                  </div>
                  <ProgressBar value={xpProgress} gradient height={6} />
                  <p className="text-slate-600 text-xs mt-1">
                    {Math.round(xpProgress)}% vers le niveau {(user?.level || 1) + 1}
                  </p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex gap-3 flex-wrap">
                <div className="flex flex-col items-center p-3 glass-elevated rounded-xl">
                  <Flame size={18} className="text-orange-400 mb-1" />
                  <span className="text-white font-bold">{user?.streak || 0}</span>
                  <span className="text-slate-500 text-xs">Série</span>
                </div>
                <div className="flex flex-col items-center p-3 glass-elevated rounded-xl">
                  <Coins size={18} className="text-amber-400 mb-1" />
                  <span className="text-white font-bold">{user?.dataCoins || 0}</span>
                  <span className="text-slate-500 text-xs">Coins</span>
                </div>
                <div className="flex flex-col items-center p-3 glass-elevated rounded-xl">
                  <Star size={18} className="text-cyan-400 mb-1" />
                  <span className="text-white font-bold">{user?.eloRating || 1200}</span>
                  <span className="text-slate-500 text-xs">ELO</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Trophy} label="Concepts maîtrisés" value={masteredCount} color="#10B981" />
            <StatCard icon={TrendingUp} label="En cours" value={inProgressCount} color="#7C3AED" />
            <StatCard icon={Target} label="Précision moy." value={`${stats?.averageAccuracy ? Math.round(stats.averageAccuracy) : '—'}%`} color="#06B6D4" />
            <StatCard icon={Brain} label="Sessions" value={stats?.totalSessions || '—'} color="#F59E0B" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Error breakdown pie chart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-5"
            >
              <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                <Target size={15} className="text-rose-400" />
                Erreurs par type
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={errorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {errorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0E0E2C',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#E2E8F0',
                      }}
                    />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: '#94A3B8', fontSize: '12px' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Radar chart for skills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-5"
            >
              <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                <Brain size={15} className="text-violet-400" />
                Compétences
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#64748B', fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      domain={[0, 100]}
                      tick={{ fill: '#334155', fontSize: 9 }}
                    />
                    <Radar
                      name="Niveau"
                      dataKey="value"
                      stroke="#7C3AED"
                      fill="#7C3AED"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 mb-6"
          >
            <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <Award size={15} className="text-amber-400" />
              Badges obtenus
              <span className="text-slate-500 text-xs">({MOCK_BADGES.length})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {MOCK_BADGES.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="glass-elevated p-3 rounded-xl text-center cursor-default"
                  title={badge.description}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className="text-white text-xs font-medium leading-tight">{badge.name}</p>
                  <p className="text-slate-600 text-xs mt-1 leading-tight">{badge.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent activity */}
          {stats?.recentActivity && stats.recentActivity.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-card p-5"
            >
              <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                <Calendar size={15} className="text-cyan-400" />
                Activité récente
              </h3>
              <div className="space-y-2">
                {stats.recentActivity.slice(0, 5).map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-900/30 border border-violet-700/30 flex items-center justify-center flex-shrink-0">
                      <Brain size={14} className="text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-sm truncate">{activity.conceptLabel}</p>
                      <p className="text-slate-600 text-xs">
                        Phase {activity.phase} — {Math.round(activity.accuracy)}% précision
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-violet-400 text-xs font-medium">+{activity.xpEarned} XP</p>
                      <p className="text-slate-600 text-xs">
                        {new Date(activity.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
