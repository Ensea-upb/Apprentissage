import { PrismaClient } from '@prisma/client';
import { CONCEPTS } from '../src/data/concepts';
import { BADGE_DEFINITIONS } from '../src/services/badges.service';

const prisma = new PrismaClient();

// Additional badges not checked automatically (future/manual awards)
const EXTRA_BADGES = [
  { id: 'block_0',     name: 'Mathématicien',    description: 'Terminer le bloc Math Fondamentaux',     icon: '📐', category: 'block',       xpReward: 300  },
  { id: 'block_1',     name: 'Data Wrangler',    description: 'Terminer le bloc Données',               icon: '🔧', category: 'block',       xpReward: 300  },
  { id: 'block_2',     name: 'Statisticien',     description: 'Terminer le bloc Stats & Proba',         icon: '📊', category: 'block',       xpReward: 300  },
  { id: 'block_3',     name: 'ML Practitioner',  description: 'Terminer le bloc ML Classique',          icon: '🤖', category: 'block',       xpReward: 500  },
  { id: 'block_4',     name: 'Deep Learner',     description: 'Terminer le bloc Deep Learning',         icon: '🧠', category: 'block',       xpReward: 500  },
  { id: 'block_5',     name: 'Vision Master',    description: 'Terminer le bloc Computer Vision',       icon: '👁️', category: 'block',       xpReward: 500  },
  { id: 'block_6',     name: 'NLP Expert',       description: 'Terminer le bloc NLP',                   icon: '💬', category: 'block',       xpReward: 500  },
  { id: 'block_7',     name: 'MLOps Engineer',   description: 'Terminer le bloc MLOps',                 icon: '⚙️', category: 'block',       xpReward: 500  },
  { id: 'block_8',     name: 'LLM Whisperer',   description: 'Terminer le bloc LLMs & Agents',         icon: '🌐', category: 'block',       xpReward: 700  },
  { id: 'block_9',     name: 'RL Champion',      description: 'Terminer le bloc RL',                    icon: '🎮', category: 'block',       xpReward: 700  },
  { id: 'speed_demon', name: 'Speed Demon',      description: 'Valider 5 concepts en une journée',      icon: '💨', category: 'performance', xpReward: 150  },
  { id: 'battler',     name: 'Gladiateur',       description: 'Gagner votre premier duel',              icon: '⚔️', category: 'special',     xpReward: 100  },
  { id: 'champion',    name: 'Champion',         description: 'Gagner 10 duels',                        icon: '👑', category: 'special',     xpReward: 500  },
  { id: 'sm2_master',  name: 'Mémoire de fer',  description: 'Réviser 50 cartes SM-2',                 icon: '🃏', category: 'learning',    xpReward: 200  },
  { id: 'all_blocks',  name: 'DataQuest Master', description: 'Terminer tous les blocs',                icon: '🌟', category: 'special',     xpReward: 2000 },
];

// Merge both lists (BADGE_DEFINITIONS wins on id conflicts)
type BadgeDef = { id: string; name: string; description: string; icon: string; category: string; xpReward: number };
const badgeMap = new Map<string, BadgeDef>();
for (const b of EXTRA_BADGES) badgeMap.set(b.id, b);
for (const b of BADGE_DEFINITIONS) badgeMap.set(b.id, b);
const BADGES = [...badgeMap.values()];

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed badges
  console.log(`  Seeding ${BADGES.length} badges...`);
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: badge,
      create: badge,
    });
  }
  console.log(`  ✅ ${BADGES.length} badges seeded`);

  // Log concept summary (concepts are stored in-memory in src/data/concepts.ts)
  const blockCounts: Record<number, number> = {};
  for (const c of CONCEPTS) {
    blockCounts[c.blockId] = (blockCounts[c.blockId] || 0) + 1;
  }

  console.log(`\n  📚 Concepts summary (${CONCEPTS.length} total):`);
  for (const [blockId, count] of Object.entries(blockCounts)) {
    const blockName = CONCEPTS.find((c) => c.blockId === Number(blockId))?.blockName;
    console.log(`    Block ${blockId} – ${blockName}: ${count} concepts`);
  }

  console.log('\n✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
