import { useState } from 'react';
import { Mail, Lock, Users, School, HeartPulse, Brain, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './supabaseClient';

export default function HkeyaAuth({ onAuthSuccess, darkMode }) {
  const [role, setRole] = useState('parent');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useEmail, setUseEmail] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginWithGoogle = async () => {
    if (role === 'parent' && !consent) { alert('Consentement parental requis'); return; }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth-callback',
        queryParams: { prompt: 'select_account' }
      }
    });
    if (error) return alert('Erreur Google Auth: ' + error.message);
    if (data?.url) {
      window.open(data.url, 'supabase_oauth', 'width=500,height=650');
    }
  };

  const loginWithEmail = async (e) => {
    e.preventDefault();
    if (role === 'parent' && !consent) { alert('Consentement parental requis'); return; }
    if (!email || !password) { alert('Veuillez saisir email et mot de passe.'); return; }
    setIsLoading(true);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      setIsLoading(false);
      if (error) return alert('Erreur inscription : ' + error.message);
      if (data?.session || data?.user) {
        if (onAuthSuccess) onAuthSuccess(role);
      } else {
        alert('Compte créé. Vérifiez votre email pour confirmer votre inscription.');
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) return alert('Erreur Auth: ' + error.message);
    if (onAuthSuccess) onAuthSuccess(role);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className={`w-full max-w-md p-8 rounded-2xl border shadow-2xl space-y-6 transition-all ${
        darkMode ? 'bg-slate-900/50 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-200'
      }`}>
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg animate-pulse">
            <Brain className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">HKEYA • حكاية</h1>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Plateforme Tripartite Sécurisée</p>
        </div>

          <div className="space-y-4">
            {!isSupabaseConfigured && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                Supabase non configuré — les connexions OAuth sont désactivées en local. Ajoutez <strong>VITE_SUPABASE_URL</strong> et <strong>VITE_SUPABASE_ANON_KEY</strong> dans votre fichier d'environnement pour activer.
              </div>
            )}
          <div>
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Sélectionnez votre profil :</label>
            <div className={`p-1 rounded-xl border flex gap-1 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              {[
                { id: 'parent', label: 'Parent', icon: Users },
                { id: 'school', label: 'École', icon: School },
                { id: 'healthcare', label: 'Médecin', icon: HeartPulse }
              ].map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setRole(p.id)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      role === p.id
                        ? (darkMode ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-600 shadow-sm border border-slate-200')
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Connexion via :</label>
            <div className={`p-1 rounded-xl border flex gap-1 ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <button
                type="button"
                onClick={() => {
                  if (!isSupabaseConfigured) return alert('Supabase non configuré. Voir la console ou .env');
                  return loginWithGoogle();
                }}
                disabled={!isSupabaseConfigured}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all ${isSupabaseConfigured ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-600 text-slate-300 cursor-not-allowed opacity-60'}`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => setUseEmail(!useEmail)}
                className={`ml-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
              >
                {useEmail ? 'Cacher' : 'Se connecter par e-mail'}
              </button>
            </div>
          </div>

          {role === 'parent' && (
            <div className={`p-3.5 rounded-xl border transition-all animate-in slide-in-from-top-2 ${
              consent ? 'bg-indigo-500/10 border-indigo-500/30' : (darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200')
            }`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-slate-950"
                />
                <span className="text-[11px] leading-tight text-slate-400">
                  <strong className={darkMode ? "text-slate-200" : "text-slate-700"}>Consentement Parental Explicite :</strong> En cochant cette case, j'autorise le traitement sécurisé des données vocales (IA) et biométriques (Rythme Cardiaque Smartwatch) de mon enfant à des fins exclusives d'analyse clinique.
                </span>
              </label>
            </div>
          )}

          {useEmail && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-mono uppercase tracking-widest">Mode Email</span>
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-200"
                >
                  {isSignUp ? "J'ai déjà un compte" : "Je n’ai pas de compte"}
                </button>
              </div>
              <form onSubmit={loginWithEmail} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || (role === 'parent' && !consent)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : isSignUp ? 'Créer un compte' : 'Se connecter'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm text-slate-400">Connectez-vous via Google ou Apple, ou utilisez un compte Email/Mot de passe.</p>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-mono text-slate-500 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" /> Powered by Supabase Auth & JWT Encryption
          </p>
        </div>
      </div>
    </div>
  );
}
