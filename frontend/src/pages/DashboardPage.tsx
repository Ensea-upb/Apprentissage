import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Trophy, Target, TrendingUp, BookOpen, Play, Flame, Coins,
  ChevronRight, RefreshCw, Star,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import SM2ReviewCard from '../components/dashboard/SM2ReviewCard';
import InsightOfDay from '../components/dashboard/InsightOfDay';
import ConceptCard from '../components/dashboard/ConceptCard';
import ProgressBar from '../components/common/ProgressBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import { useProgressStore } from '../stores/progressStore';
import { conceptsApi } from '../api/concepts';
import { Concept } from '../types';
import {
  getLevelTitle, getProgressToNextLevel, getXPForLevel, getXPRemainingForNextLevel,
  formatXP,
} from '../utils/levelUtils';

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: React.ComponentType<{ size: number; className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string | number;
  color: string;
  subtitle?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 flex items-center gap-4"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}30` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-slate-500 text-xs">{label}</p>
        <p className="text-white font-bold text-xl leading-tight">{value}</p>
        {subtitle && <p className="text-slate-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { conceptProgress, sm2Cards, dueTodayCount, loadProgress, loadSM2Cards } = useProgressStore();
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [availableConcepts, setAvailableConcepts] = useState<Concept[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getConceptStatus } = useProgressStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadProgress(), loadSM2Cards()]);
      const all = await conceptsApi.getAll();
      setConcepts(all);
      // Filter to available/in_progress concepts
      const avail = all.filter((c) => {
        const status = getConceptStatus(c.id);
        return status === 'available' || status === 'in_progress';
      });
      setAvailableConcepts(avail.slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const xpProgress = user ? getProgressToNextLevel(user.xp) : 0;
  const xpRemaining = user ? getXPRemainingForNextLevel(user.xp) : 0;
  const levelTitle = user ? getLevelTitle(user.xp) : '';
  const masteredCount = Object.values(conceptProgress).filter((p) => p.isValidated).length;
  const inProgressCount = Object.values(conceptProgress).filter(
    (p) => !p.isValidated && (p.phase1Done || p.phase2Done || p.phase3Done)
  ).length;
  const totalXP = Object.values(conceptProgress).reduce((sum, p) => sum + (p.xpEarned || 0), 0);

  // Next concept to learn (first available)
  const nextConcept = concepts.find((c) => getConceptStatus(c.id) === 'available');

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-white">
              Bonjour,{' '}
              <span className="text-violet-400">{user?.username}</span>
              {user?.streak && user.streak > 0 ? (
                <span className="text-orange-400 ml-2 text-xl">
                  🔥 {user.streak} jour{user.streak > 1 ? 's' : ''}
                </span>
              ) : null}
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              {levelTitle} — Niveau {user?.level}
            </p>
          </motion.div>

          {/* XP & Level Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="glass-card p-5 mb-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 to-indigo-900/10 pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-900/40 flex-shrink-0">
                {user?.username?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-white font-semibold">{levelTitle}</span>
                    <span className="text-slate-500 ml-2 text-sm">Niv. {user?.level}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap size={14} className="text-violet-400" />
                    <span className="text-violet-400 font-bold text-sm">
                      {formatXP(user?.xp || 0)} XP
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={xpProgress}
                  gradient
                  height={10}
                  animated
                />
                <p className="text-slate-500 text-xs mt-1.5">
                  Encore <span className="text-violet-400 font-medium">{formatXP(xpRemaining)} XP</span> pour le niveau suivant
                </p>
              </div>

              {/* Coins & Streak */}
              <div className="flex sm:flex-col gap-3 sm:items-end">
                <div className="flex items-center gap-1.5 bg-amber-900/20 border border-amber-700/30 px-3 py-1.5 rounded-full">
                  <Coins size={13} className="text-amber-400" />
                  <span className="text-amber-300 text-sm font-semibold">
                    {user?.dataCoins?.toLocaleString() || 0}
                  </span>
                </div>
                {user?.streak && user.streak > 0 ? (
                  <div className="flex items-center gap-1.5 bg-orange-900/20 border border-orange-700/30 px-3 py-1.5 rounded-full">
                    <Flame size={13} className="text-orange-400" />
                    <span className="text-orange-300 text-sm font-semibold">
                      {user.streak} jours
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Trophy}
              label="Concepts maîtrisés"
              value={masteredCount}
              color="#10B981"
              subtitle="sur tous les blocs"
            />
            <StatCard
              icon={TrendingUp}
              label="En cours"
              value={inProgressCount}
              color="#7C3AED"
              subtitle="concepts actifs"
            />
            <StatCard
              icon={RefreshCw}
              label="À réviser"
              value={dueTodayCount}
              color={dueTodayCount > 0 ? '#F97316' : '#10B981'}
              subtitle="aujourd'hui"
            />
            <StatCard
              icon={Star}
              label="ELO Rating"
              value={user?.eloRating || 1200}
              color="#06B6D4"
              subtitle="score adaptatif"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="xl:col-span-2 space-y-6">
              {/* SM2 Reviews Due */}
              {dueTodayCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <RefreshCw size={16} className="text-orange-400" />
                      <h2 className="text-white font-semibold">À réviser aujourd'hui</h2>
                      <span className="bg-orange-900/40 text-orange-300 text-xs px-2 py-0.5 rounded-full border border-orange-700/30 font-semibold">
                        {dueTodayCount}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {sm2Cards.slice(0, 5).map((card, i) => (
                      <SM2ReviewCard key={card.conceptId} card={card} index={i} />
                    ))}
                    {sm2Cards.length > 5 && (
                      <button
                        onClick={() => navigate('/roadmap')}
                        className="w-full text-center text-violet-400 text-sm py-2 hover:text-violet-300 transition-colors"
                      >
                        Voir les {sm2Cards.length - 5} autres →
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Available Concepts */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-cyan-400" />
                    <h2 className="text-white font-semibold">Prochains à apprendre</h2>
                  </div>
                  <button
                    onClick={() => navigate('/roadmap')}
                    className="text-slate-500 hover:text-slate-300 text-sm flex items-center gap-1 transition-colors"
                  >
                    Voir tout <ChevronRight size={14} />
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="md" label="Chargement des concepts..." />
                  </div>
                ) : availableConcepts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableConcepts.map((concept) => (
                      <ConceptCard
                        key={concept.id}
                        concept={concept}
                        status={getConceptStatus(concept.id)}
                        progress={conceptProgress[concept.id]}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-8 text-center">
                    <Trophy size={32} className="text-amber-400 mx-auto mb-3" />
                    <p className="text-white font-semibold">Tous les concepts sont maîtrisés !</p>
                    <p className="text-slate-400 text-sm mt-1">Revenez réviser vos connaissances</p>
                  </div>
                )}
              </motion.div>

              {/* CTA */}
              {nextConcept && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card p-5 bg-gradient-to-r from-violet-900/30 to-indigo-900/20 border-violet-700/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Continuer l'apprentissage</p>
                      <h3 className="text-white font-bold">{nextConcept.label}</h3>
                      <p className="text-slate-500 text-xs mt-1">
                        {nextConcept.blockName} / {nextConcept.moduleName}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => navigate(`/learn/${nextConcept.id}`)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary flex items-center gap-2 flex-shrink-0 ml-4"
                    >
                      <Play size={16} className="fill-white" />
                      Commencer
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <InsightOfDay />

              {/* Quick stats card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card p-4"
              >
                <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                  <Target size={15} className="text-violet-400" />
                  Progression globale
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: 'Concepts maîtrisés',
                      value: masteredCount,
                      total: concepts.length || 50,
                      color: '#10B981',
                    },
                    {
                      label: 'XP ce mois',
                      value: totalXP,
                      total: 5000,
                      color: '#7C3AED',
                    },
                    {
                      label: 'Streak actuel',
                      value: user?.streak || 0,
                      total: 30,
                      color: '#F97316',
                    },
                  ].map(({ label, value, total, color }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-400 text-xs">{label}</span>
                        <span className="text-xs font-medium" style={{ color }}>
                          {value}/{total}
                        </span>
                      </div>
                      <ProgressBar
                        value={value}
                        max={total}
                        color={color}
                        height={5}
                        animated
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
