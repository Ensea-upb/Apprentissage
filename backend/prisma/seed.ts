import { PrismaClient } from '@prisma/client';
import { CONCEPTS } from '../src/data/concepts';

const prisma = new PrismaClient();

const BADGES = [
  { id: 'first_concept', name: 'Premier Pas', description: 'Valider votre premier concept', icon: '🎯', category: 'progression', xpReward: 50 },
  { id: 'streak_3', name: 'En Feu', description: '3 jours consécutifs d\'apprentissage', icon: '🔥', category: 'streak', xpReward: 100 },
  { id: 'streak_7', name: 'Semaine Parfaite', description: '7 jours consécutifs', icon: '⚡', category: 'streak', xpReward: 200 },
  { id: 'streak_30', name: 'Mois Implacable', description: '30 jours consécutifs', icon: '🏆', category: 'streak', xpReward: 500 },
  { id: 'block_0', name: 'Mathématicien', description: 'Terminer le bloc Math Fondamentaux', icon: '📐', category: 'block', xpReward: 300 },
  { id: 'block_1', name: 'Pythoniste', description: 'Terminer le bloc Python & Outils', icon: '🐍', category: 'block', xpReward: 300 },
  { id: 'block_2', name: 'Data Wrangler', description: 'Terminer le bloc Préparation des Données', icon: '🔧', category: 'block', xpReward: 300 },
  { id: 'block_3', name: 'ML Practitioner', description: 'Terminer le bloc ML Classique', icon: '🤖', category: 'block', xpReward: 500 },
  { id: 'block_4', name: 'Deep Learner', description: 'Terminer le bloc Deep Learning', icon: '🧠', category: 'block', xpReward: 500 },
  { id: 'block_5', name: 'NLP Expert', description: 'Terminer le bloc NLP', icon: '💬', category: 'block', xpReward: 500 },
  { id: 'block_6', name: 'Vision Master', description: 'Terminer le bloc Computer Vision', icon: '👁️', category: 'block', xpReward: 500 },
  { id: 'block_7', name: 'MLOps Engineer', description: 'Terminer le bloc MLOps', icon: '⚙️', category: 'block', xpReward: 500 },
  { id: 'block_8', name: 'LLM Whisperer', description: 'Terminer le bloc LLMs & Agents', icon: '🌐', category: 'block', xpReward: 700 },
  { id: 'block_9', name: 'RL Champion', description: 'Terminer le bloc Reinforcement Learning', icon: '🎮', category: 'block', xpReward: 700 },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Valider 5 concepts en une journée', icon: '💨', category: 'performance', xpReward: 150 },
  { id: 'perfectionist', name: 'Perfectionniste', description: '10 sessions consécutives sans erreur', icon: '💎', category: 'performance', xpReward: 250 },
  { id: 'battler', name: 'Gladiateur', description: 'Gagner votre premier duel', icon: '⚔️', category: 'social', xpReward: 100 },
  { id: 'champion', name: 'Champion', description: 'Gagner 10 duels', icon: '👑', category: 'social', xpReward: 500 },
  { id: 'sm2_master', name: 'Maître de la Mémoire', description: 'Réviser 50 cartes SM-2', icon: '🃏', category: 'review', xpReward: 200 },
  { id: 'all_blocks', name: 'DataQuest Master', description: 'Terminer tous les blocs', icon: '🌟', category: 'ultimate', xpReward: 2000 },
];

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
