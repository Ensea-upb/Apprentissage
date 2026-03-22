import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronRight, Lock, Play, CheckCircle, RefreshCw,
  Map as MapIcon, Search, Filter, Loader2, type LucideIcon,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import { useProgressStore } from '../stores/progressStore';
import { conceptsApi } from '../api/concepts';
import { Concept, ConceptStatus } from '../types';
import { getDecayColor } from '../utils/decayUtils';

interface GroupedData {
  blockId: number;
  blockName: string;
  modules: {
    moduleId: string;
    moduleName: string;
    concepts: Concept[];
  }[];
}

const statusConfig: Record<ConceptStatus, {
  color: string;
  icon: LucideIcon;
  label: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
}> = {
  locked: {
    color: '#475569',
    icon: Lock,
    label: 'Verrouillé',
    bgClass: 'bg-slate-800/30',
    borderClass: 'border-white/5',
    textClass: 'text-slate-500',
  },
  available: {
    color: '#06B6D4',
    icon: Play,
    label: 'Disponible',
    bgClass: 'bg-cyan-900/10',
    borderClass: 'border-cyan-700/20',
    textClass: 'text-cyan-300',
  },
  in_progress: {
    color: '#7C3AED',
    icon: ChevronRight,
    label: 'En cours',
    bgClass: 'bg-violet-900/10',
    borderClass: 'border-violet-700/20',
    textClass: 'text-violet-300',
  },
  mastered: {
    color: '#10B981',
    icon: CheckCircle,
    label: 'Maîtrisé',
    bgClass: 'bg-emerald-900/10',
    borderClass: 'border-emerald-700/20',
    textClass: 'text-emerald-300',
  },
  decaying: {
    color: '#F97316',
    icon: RefreshCw,
    label: 'À réviser',
    bgClass: 'bg-orange-900/10',
    borderClass: 'border-orange-700/20',
    textClass: 'text-orange-300',
  },
};

const BLOCK_COLORS = [
  '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E',
  '#8B5CF6', '#0EA5E9', '#059669', '#D97706', '#E11D48',
];

function ConceptRow({ concept, status }: { concept: Concept; status: ConceptStatus }) {
  const navigate = useNavigate();
  const config = statusConfig[status];
  const Icon = config.icon;
  const isClickable = status !== 'locked';

  return (
    <motion.div
      onClick={isClickable ? () => navigate(`/learn/${concept.id}`) : undefined}
      whileHover={isClickable ? { x: 4, scale: 1.005 } : {}}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-150
        ${config.bgClass} ${config.borderClass}
        ${isClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-default opacity-60'}
      `}
    >
      <Icon size={14} className={config.textClass} />
      <span className={`text-sm flex-1 ${isClickable ? 'text-slate-200' : 'text-slate-500'}`}>
        {concept.label}
      </span>
      {concept.paperRef && (
        <span className="text-slate-600 text-xs hidden sm:block italic">{concept.paperRef}</span>
      )}
      <Badge
        variant={
          status === 'mastered' ? 'emerald' :
          status === 'available' ? 'cyan' :
          status === 'in_progress' ? 'violet' :
          status === 'decaying' ? 'orange' : 'slate'
        }
        size="xs"
      >
        {config.label}
      </Badge>
    </motion.div>
  );
}

function ModuleSection({
  moduleId,
  moduleName,
  concepts,
  getStatus,
}: {
  moduleId: string;
  moduleName: string;
  concepts: Concept[];
  getStatus: (id: string) => ConceptStatus;
}) {
  const [expanded, setExpanded] = useState(true);

  const statuses = concepts.map((c) => getStatus(c.id));
  const masteredCount = statuses.filter((s) => s === 'mastered').length;
  const progress = concepts.length > 0 ? (masteredCount / concepts.length) * 100 : 0;

  const hasAvailable = statuses.some((s) => s === 'available' || s === 'in_progress');

  return (
    <div className="ml-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-all group"
      >
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform duration-200 ${expanded ? '' : '-rotate-90'}`}
        />
        <span className="text-slate-300 text-sm font-medium flex-1 text-left">{moduleName}</span>
        <div className="flex items-center gap-3">
          {hasAvailable && (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          )}
          <span className="text-slate-500 text-xs">{masteredCount}/{concepts.length}</span>
          <div className="w-20 hidden sm:block">
            <ProgressBar value={progress} height={4} color="#10B981" animated={false} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-1 space-y-1.5 mb-3">
              {concepts.map((concept) => (
                <ConceptRow
                  key={concept.id}
                  concept={concept}
                  status={getStatus(concept.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BlockSection({
  block,
  index,
  getStatus,
}: {
  block: GroupedData;
  index: number;
  getStatus: (id: string) => ConceptStatus;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const blockColor = BLOCK_COLORS[index % BLOCK_COLORS.length];

  const allConcepts = block.modules.flatMap((m) => m.concepts);
  const statuses = allConcepts.map((c) => getStatus(c.id));
  const masteredCount = statuses.filter((s) => s === 'mastered').length;
  const inProgressCount = statuses.filter((s) => s === 'in_progress').length;
  const availableCount = statuses.filter((s) => s === 'available').length;
  const progress = allConcepts.length > 0
    ? (masteredCount / allConcepts.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card overflow-hidden"
    >
      {/* Block header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 hover:bg-white/5 transition-all text-left"
      >
        {/* Color indicator */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: `${blockColor}25`, border: `2px solid ${blockColor}50` }}
        >
          <span style={{ color: blockColor }}>{block.blockId}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-semibold">{block.blockName}</h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              {masteredCount > 0 && (
                <Badge variant="emerald" size="xs" dot>{masteredCount} maîtrisé{masteredCount > 1 ? 's' : ''}</Badge>
              )}
              {inProgressCount > 0 && (
                <Badge variant="violet" size="xs" dot>{inProgressCount} en cours</Badge>
              )}
              {availableCount > 0 && (
                <Badge variant="cyan" size="xs" dot>{availableCount} disponible{availableCount > 1 ? 's' : ''}</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 max-w-xs">
              <ProgressBar
                value={progress}
                height={5}
                color={blockColor}
                animated={false}
              />
            </div>
            <span className="text-slate-500 text-xs whitespace-nowrap">
              {masteredCount}/{allConcepts.length} concepts
            </span>
          </div>
        </div>

        <ChevronDown
          size={18}
          className={`text-slate-500 transition-transform duration-200 flex-shrink-0 ${expanded ? '' : '-rotate-90'}`}
        />
      </button>

      {/* Modules */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="border-t border-white/5 pb-4 pt-2"
              style={{ borderColor: `${blockColor}20` }}
            >
              {block.modules.map((mod) => (
                <ModuleSection
                  key={mod.moduleId}
                  moduleId={mod.moduleId}
                  moduleName={mod.moduleName}
                  concepts={mod.concepts}
                  getStatus={getStatus}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RoadmapPage() {
  const { getConceptStatus, loadProgress, loadSM2Cards } = useProgressStore();
  const [grouped, setGrouped] = useState<GroupedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ConceptStatus | 'all'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadProgress(), loadSM2Cards()]);
      const concepts = await conceptsApi.getAll();
      const groupedData = groupConcepts(concepts);
      setGrouped(groupedData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const groupConcepts = (concepts: Concept[]): GroupedData[] => {
    const blockMap = new Map<number, GroupedData>();

    concepts.forEach((concept) => {
      if (!blockMap.has(concept.blockId)) {
        blockMap.set(concept.blockId, {
          blockId: concept.blockId,
          blockName: concept.blockName,
          modules: [],
        });
      }
      const block = blockMap.get(concept.blockId)!;
      let module = block.modules.find((m) => m.moduleId === concept.moduleId);
      if (!module) {
        module = {
          moduleId: concept.moduleId,
          moduleName: concept.moduleName,
          concepts: [],
        };
        block.modules.push(module);
      }
      module.concepts.push(concept);
    });

    return Array.from(blockMap.values()).sort((a, b) => a.blockId - b.blockId);
  };

  const filteredGroups = grouped.map((block) => ({
    ...block,
    modules: block.modules.map((mod) => ({
      ...mod,
      concepts: mod.concepts.filter((concept) => {
        const matchesSearch = search === '' ||
          concept.label.toLowerCase().includes(search.toLowerCase());
        const status = getConceptStatus(concept.id);
        const matchesFilter = filter === 'all' || status === filter;
        return matchesSearch && matchesFilter;
      }),
    })).filter((mod) => mod.concepts.length > 0),
  })).filter((block) => block.modules.length > 0);

  const totalConcepts = grouped.reduce(
    (sum, b) => sum + b.modules.reduce((ms, m) => ms + m.concepts.length, 0), 0
  );
  const allConcepts = grouped.flatMap((b) => b.modules.flatMap((m) => m.concepts));
  const masteredTotal = allConcepts.filter((c) => getConceptStatus(c.id) === 'mastered').length;

  const FILTER_OPTIONS: { value: ConceptStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'available', label: 'Disponibles' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'mastered', label: 'Maîtrisés' },
    { value: 'decaying', label: 'À réviser' },
    { value: 'locked', label: 'Verrouillés' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between mb-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <MapIcon size={20} className="text-violet-400" />
                <h1 className="text-2xl font-bold text-white">Roadmap</h1>
              </div>
              <p className="text-slate-500 text-sm">
                {masteredTotal}/{totalConcepts} concepts maîtrisés — 10 blocs thématiques
              </p>
            </div>
          </motion.div>

          {/* Overall progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Progression globale</span>
              <span className="text-violet-400 text-sm font-semibold">
                {totalConcepts > 0 ? Math.round((masteredTotal / totalConcepts) * 100) : 0}%
              </span>
            </div>
            <ProgressBar
              value={masteredTotal}
              max={totalConcepts || 1}
              gradient
              height={8}
            />
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un concept..."
                className="input-field pl-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter size={14} className="text-slate-500 flex-shrink-0" />
              {FILTER_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`
                    flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all duration-150
                    ${filter === value
                      ? 'bg-violet-600 text-white border-violet-500'
                      : 'bg-bg-elevated text-slate-400 border-white/10 hover:border-white/20 hover:text-slate-200'
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner label="Chargement de la roadmap..." />
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Search size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Aucun concept ne correspond à votre recherche</p>
              <button
                onClick={() => { setSearch(''); setFilter('all'); }}
                className="text-violet-400 text-sm mt-2 hover:text-violet-300"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGroups.map((block, index) => (
                <BlockSection
                  key={block.blockId}
                  block={block}
                  index={index}
                  getStatus={getConceptStatus}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={32} className="text-violet-400 animate-spin" />
      {label && <p className="text-slate-400 text-sm">{label}</p>}
    </div>
  );
}
