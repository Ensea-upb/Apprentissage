import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Zap
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface Validation {
  minLength: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
}

function validatePassword(password: string): Validation {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };
}

function ValidationItem({ valid, label }: { valid: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs ${valid ? 'text-emerald-400' : 'text-slate-500'}`}>
      <CheckCircle size={12} className={valid ? 'opacity-100' : 'opacity-30'} />
      {label}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validation = validatePassword(password);
  const isPasswordValid = Object.values(validation).every(Boolean);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const isFormValid = email && username && isPasswordValid && doPasswordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    clearError();
    try {
      await register(email, username, password);
      navigate('/dashboard');
    } catch {
      // error set in store
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      </div>
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-violet-900/60"
          >
            <Brain size={32} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white">
            DataQuest <span className="text-violet-400">AI</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Commencez votre voyage en Data Science</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 shadow-2xl shadow-black/40">
          <h2 className="text-xl font-bold text-white mb-6">Créer un compte</h2>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-rose-900/30 border border-rose-700/40 rounded-lg px-4 py-3 mb-6"
            >
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
              <p className="text-rose-300 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field pl-10"
                  placeholder="vous@exemple.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                  required
                  minLength={3}
                  maxLength={20}
                  className="input-field pl-10"
                  placeholder="datascientist42"
                  autoComplete="username"
                />
              </div>
              {username && username.length < 3 && (
                <p className="text-rose-400 text-xs mt-1">Minimum 3 caractères</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Validation pills */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 flex flex-wrap gap-3"
                >
                  <ValidationItem valid={validation.minLength} label="8 caractères min." />
                  <ValidationItem valid={validation.hasUppercase} label="1 majuscule" />
                  <ValidationItem valid={validation.hasNumber} label="1 chiffre" />
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`input-field pl-10 pr-10 ${
                    confirmPassword
                      ? doPasswordsMatch
                        ? 'border-emerald-500/50 focus:ring-emerald-500'
                        : 'border-rose-500/50 focus:ring-rose-500'
                      : ''
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && !doPasswordsMatch && (
                <p className="text-rose-400 text-xs mt-1">Les mots de passe ne correspondent pas</p>
              )}
              {confirmPassword && doPasswordsMatch && (
                <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
                  <CheckCircle size={12} /> Mots de passe identiques
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading || !isFormValid}
              whileHover={{ scale: isFormValid ? 1.02 : 1 }}
              whileTap={{ scale: isFormValid ? 0.98 : 1 }}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Création...
                </>
              ) : (
                <>
                  <Zap size={16} className="fill-white" />
                  Créer mon compte
                </>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-center text-slate-400 text-sm">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
