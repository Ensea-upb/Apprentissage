import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

// ─── Dynamic import helpers (content package is outside backend/) ──────────

async function loadContentPackage() {
  // Resolve path to content package relative to this seed file
  const contentPath = path.resolve(__dirname, '../../packages/content');
  const conceptsModule = await import(path.join(contentPath, 'concepts'));
  const questionsModule = await import(path.join(contentPath, 'questions/index'));
  return {
    CONCEPTS: conceptsModule.CONCEPTS as Record<string, {
      id: string; name: string; shortName: string; block: number; module: string;
      prerequisites: string[]; unlocks: string[]; estimatedMinutes: number;
      questionFile: string; paper: string | null; kaggle: string | null; tags: string[];
    }>,
    topologicalSort: conceptsModule.topologicalSort as (c: Record<string, unknown>) => string[],
    getAllQuestionSets: questionsModule.getAllQuestionSets as () => Array<{
      conceptId: string;
      phase1?: { questions: unknown[] };
      phase2?: { questions: unknown[] };
      phase3?: { questions: unknown[] };
      phase4?: { questions: unknown[] };
      phase5?: { questions: unknown[] };
      phase6?: { questions: unknown[] };
    }>,
  };
}

// ─── Badge definitions ────────────────────────────────────────────────────

const BADGES = [
  // Block completion
  { id: 'block_0', name: 'Mathématicien',    description: 'Terminer le bloc Math Fondamentaux',     icon: '📐', category: 'block',       xpReward: 300,  dcReward: 50  },
  { id: 'block_1', name: 'Data Wrangler',    description: 'Terminer le bloc Python & Outils',       icon: '🔧', category: 'block',       xpReward: 300,  dcReward: 50  },
  { id: 'block_2', name: 'Statisticien',     description: 'Terminer le bloc Préparation Données',   icon: '📊', category: 'block',       xpReward: 300,  dcReward: 50  },
  { id: 'block_3', name: 'ML Practitioner',  description: 'Terminer le bloc ML Classique',          icon: '🤖', category: 'block',       xpReward: 500,  dcReward: 100 },
  { id: 'block_4', name: 'Deep Learner',     description: 'Terminer le bloc Deep Learning',         icon: '🧠', category: 'block',       xpReward: 500,  dcReward: 100 },
  { id: 'block_5', name: 'Vision Master',    description: 'Terminer le bloc Computer Vision',       icon: '👁️', category: 'block',       xpReward: 500,  dcReward: 100 },
  { id: 'block_6', name: 'NLP Expert',       description: 'Terminer le bloc NLP',                   icon: '💬', category: 'block',       xpReward: 500,  dcReward: 100 },
  { id: 'block_7', name: 'MLOps Engineer',   description: 'Terminer le bloc MLOps',                 icon: '⚙️', category: 'block',       xpReward: 500,  dcReward: 100 },
  { id: 'block_8', name: 'LLM Whisperer',    description: 'Terminer le bloc LLMs & Agents',         icon: '🌐', category: 'block',       xpReward: 700,  dcReward: 150 },
  { id: 'block_9', name: 'RL Champion',      description: 'Terminer le bloc RL',                    icon: '🎮', category: 'block',       xpReward: 700,  dcReward: 150 },
  // Streak
  { id: 'streak_3',  name: 'Régulier',       description: 'Maintenir une série de 3 jours',         icon: '🔥', category: 'streak',      xpReward: 50,   dcReward: 10  },
  { id: 'streak_7',  name: 'Assidu',         description: 'Maintenir une série de 7 jours',         icon: '⚡', category: 'streak',      xpReward: 100,  dcReward: 25  },
  { id: 'streak_30', name: 'Invincible',     description: 'Maintenir une série de 30 jours',        icon: '💎', category: 'streak',      xpReward: 500,  dcReward: 100 },
  // Learning
  { id: 'first_concept',   name: 'Premier Pas',    description: 'Valider votre premier concept',       icon: '🌱', category: 'learning',    xpReward: 50,   dcReward: 10  },
  { id: 'ten_concepts',    name: 'Explorateur',     description: 'Valider 10 concepts',                 icon: '🗺️', category: 'learning',    xpReward: 200,  dcReward: 40  },
  { id: 'fifty_concepts',  name: 'Chercheur',       description: 'Valider 50 concepts',                 icon: '🔬', category: 'learning',    xpReward: 1000, dcReward: 200 },
  { id: 'sm2_master',      name: 'Mémoire de fer',  description: 'Réviser 50 cartes SM-2',             icon: '🃏', category: 'learning',    xpReward: 200,  dcReward: 40  },
  // Mastery
  { id: 'first_mastery',   name: 'Maîtrise',        description: 'Atteindre la phase 6 d\'un concept', icon: '🎓', category: 'mastery',     xpReward: 300,  dcReward: 75  },
  { id: 'perfect_session', name: 'Parfait',          description: 'Terminer une session avec 100%',     icon: '⭐', category: 'mastery',     xpReward: 100,  dcReward: 20  },
  // Speed
  { id: 'speed_demon',     name: 'Speed Demon',      description: 'Valider 5 concepts en une journée',  icon: '💨', category: 'speed',       xpReward: 150,  dcReward: 30  },
  // Special
  { id: 'battler',         name: 'Gladiateur',       description: 'Gagner votre premier duel',           icon: '⚔️', category: 'special',     xpReward: 100,  dcReward: 25  },
  { id: 'champion',        name: 'Champion',         description: 'Gagner 10 duels',                     icon: '👑', category: 'special',     xpReward: 500,  dcReward: 100 },
  { id: 'all_blocks',      name: 'DataQuest Master', description: 'Terminer tous les blocs',             icon: '🌟', category: 'special',     xpReward: 2000, dcReward: 500 },
  // Research
  { id: 'first_paper',     name: 'Lecteur',          description: 'Compléter une phase 6 (paper)',       icon: '📄', category: 'learning',    xpReward: 200,  dcReward: 50  },
  { id: 'recovery_hero',   name: 'Résilient',        description: 'Réussir après le système de récupération 3 erreurs', icon: '💪', category: 'learning', xpReward: 75, dcReward: 15 },
];

// ─── Main seed ────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting DataQuest v3 database seed...');

  // 1. Load content package
  const { CONCEPTS, topologicalSort, getAllQuestionSets } = await loadContentPackage();

  // 2. Seed badges
  console.log(`\n  🏅 Seeding ${BADGES.length} badges...`);
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: badge,
      create: badge,
    });
  }
  console.log(`  ✅ ${BADGES.length} badges seeded`);

  // 3. Compute topological order and seed concepts
  console.log(`\n  📚 Seeding ${Object.keys(CONCEPTS).length} concepts...`);
  const sortedIds = topologicalSort(CONCEPTS);

  for (let i = 0; i < sortedIds.length; i++) {
    const id = sortedIds[i];
    const meta = CONCEPTS[id];
    if (!meta) continue;

    await prisma.concept.upsert({
      where: { id },
      create: {
        id,
        name: meta.name,
        shortName: meta.shortName,
        block: meta.block,
        module: meta.module,
        prerequisites: meta.prerequisites,
        unlocks: meta.unlocks,
        estimatedMinutes: meta.estimatedMinutes,
        paperId: meta.paper,
        kaggleId: meta.kaggle,
        tags: meta.tags,
        order: i,
      },
      update: {
        name: meta.name,
        shortName: meta.shortName,
        prerequisites: meta.prerequisites,
        unlocks: meta.unlocks,
        estimatedMinutes: meta.estimatedMinutes,
        order: i,
      },
    });
  }
  console.log(`  ✅ ${sortedIds.length} concepts seeded (topological order)`);

  // 4. Seed static questions
  console.log('\n  📝 Seeding static questions...');
  const questionSets = getAllQuestionSets();
  let totalQuestions = 0;

  for (const qs of questionSets) {
    // Check the concept exists in our CONCEPTS map (skip orphans)
    const conceptExists = sortedIds.includes(qs.conceptId);
    if (!conceptExists) {
      console.warn(`  ⚠️  Concept ${qs.conceptId} not in concepts registry — skipping questions`);
      continue;
    }

    for (let phase = 1; phase <= 6; phase++) {
      const phaseKey = `phase${phase}` as keyof typeof qs;
      const phaseData = qs[phaseKey] as { questions?: unknown[] } | undefined;
      const questions = phaseData?.questions ?? [];

      for (const q of questions) {
        const question = q as { id: string; type: string; difficulty?: number };
        await prisma.question.upsert({
          where: { id: question.id },
          create: {
            id: question.id,
            conceptId: qs.conceptId,
            phase,
            type: question.type,
            difficulty: question.difficulty ?? 3,
            content: question as object,
            isStatic: true,
          },
          update: {
            content: question as object,
            type: question.type,
            difficulty: question.difficulty ?? 3,
          },
        });
        totalQuestions++;
      }
    }
  }

  console.log(`  ✅ ${totalQuestions} static questions seeded`);
  console.log(`\n✅ Seed completed: ${sortedIds.length} concepts, ${totalQuestions} questions, ${BADGES.length} badges`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
