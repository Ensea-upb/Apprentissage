/**
 * env.ts — Validation stricte des variables d'environnement au démarrage.
 * Aucune valeur par défaut pour les secrets.
 * Si la validation échoue → exception immédiate, app ne démarre pas.
 */

import { z } from 'zod';

const EnvSchema = z.object({
  // Base de données — obligatoire
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // JWT — doit être une chaîne d'au moins 64 caractères aléatoires
  JWT_SECRET: z
    .string()
    .min(64, 'JWT_SECRET must be at least 64 characters')
    .refine(
      (s) => s !== 'change-this' && !s.includes('example') && !s.includes('secret'),
      'JWT_SECRET must not be a placeholder or contain "example"/"secret"',
    ),

  // IA — au moins l'une des deux sources doit être configurée
  ANTHROPIC_API_KEY: z.string().optional(),
  OLLAMA_HOST: z.string().url().optional(),
  OLLAMA_MODEL: z.string().optional(),

  // Serveur
  PORT: z.string().transform(Number).default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // CORS — obligatoire en production
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Redis — optionnel (rate limiting avancé)
  REDIS_URL: z.string().url().optional(),
  REDIS_PASSWORD: z.string().optional(),

  // Frontend URL (utilisé par le backend pour les cookies/redirections)
  FRONTEND_URL: z.string().url().optional(),
  BACKEND_URL: z.string().url().optional(),
});

function validateEnv() {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    for (const error of result.error.errors) {
      console.error(`  • ${error.path.join('.')}: ${error.message}`);
    }
    process.exit(1);
  }

  const env = result.data;

  // Warning si ni Anthropic ni Ollama ne sont configurés
  if (!env.ANTHROPIC_API_KEY && !env.OLLAMA_HOST) {
    console.warn(
      '⚠️  Neither ANTHROPIC_API_KEY nor OLLAMA_HOST is set. ' +
      'AI features (evaluation, socratic dialogue) will use fallback responses.',
    );
  }

  return env;
}

export const env = validateEnv();
export type Env = z.infer<typeof EnvSchema>;
