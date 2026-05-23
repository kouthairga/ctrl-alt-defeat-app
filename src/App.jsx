import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import CompanionMonitor from './components/CompanionMonitor';
import DoctorDashboard from './components/DoctorDashboard';
import { 
  Brain, User, ShieldAlert, Lock, Mail, Users, School, HeartPulse
} from 'lucide-react';

// 🔒 COMPOSANT DE CONNEXION & INSCRIPTION AVEC CONSENTEMENT
const LoginConsent = ({ onLoginSuccess, darkMode }) => {
  const [isSignUp, setIsSignUp] = useState(false); 
  const [role, setRole] = useState('parent'); // Ajout du sélecteur de rôle pour l'authentification
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hasConsented, setHasConsented] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!hasConsented) {
      setError("Vous devez explicitement accepter les conditions de traitement des données pour continuer.");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (email && password && (!isSignUp || name)) {
      setError('');
      // On passe le rôle choisi lors de la réussite de la connexion
      onLoginSuccess(role);
    } else {
      setError("Veuillez remplir tous les champs requis.");
    }
  };

  const handleOAuthConnect = async (provider) => {
    if (!hasConsented) {
      setError(`Veuillez accepter la clause de consentement avant de vous connecter avec ${provider}.`);
      return;
    }
    setError('');
    if (provider === 'Google') {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth-callback',
          queryParams: { prompt: 'select_account' }
        }
      });

      if (error) { 
        setError('Erreur Google Auth: ' + error.message); 
        return;
      }
      
      if (data?.url) {
        window.open(data.url, 'supabase_oauth', 'width=500,height=650');
        return;
      }
      return;
    }
    alert(`Connexion simulée via le protocole sécurisé ${provider}`);
    onLoginSuccess(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-lg bg-slate-950/60 animate-in fade-in duration-300 overflow-y-auto">
      <div className={`w-full max-w-md p-8 rounded-2xl border shadow-2xl my-auto transition-all duration-300 ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Brain className={`w-10 h-10 animate-pulse ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <h2 className="text-2xl font-black tracking-tight mb-1">
            {isSignUp ? "CRÉER UN COMPTE" : "HKEYA • حكاية"}
          </h2>
          <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
            {isSignUp ? "INSCRIPTION PASSERELLE SÉCURISÉE" : "PROTOCOLE DE CONNEXION SÉCURISÉ"}
          </p>
        </div>

        {/* 🎛️ SÉLECTEUR DE RÔLE (Crucial pour la démonstration Jury) */}
        <div className="space-y-2 mb-4">
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
                      ? 'bg-indigo-600 text-white shadow-md'
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

        <div className="grid grid-cols-1 gap-3 mb-5">
          <button
            type="button"
            onClick={() => {
              if (!isSupabaseConfigured) { setError('Supabase non configuré — OAuth désactivé en local'); return; }
              handleOAuthConnect('Google');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 border rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] ${
              darkMode ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Continuer avec Google
          </button>
        </div>

        <div className="flex items-center my-4">
          <div className={`h-px flex-1 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          <span className="px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Ou via identifiants</span>
          <div className={`h-px flex-1 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1 animate-in fade-in duration-200">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nom Complet</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmed Ben Ali"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                  }`}
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adresse Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                }`}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                }`}
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-1 animate-in fade-in duration-200">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                  }`}
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div className={`p-4 rounded-xl border text-xs space-y-3 ${
            darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-start gap-2 text-amber-500">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-bold uppercase tracking-wider text-[10px]">Clause de Consentement Explicite</span>
            </div>
            
            <label className="flex gap-3 cursor-pointer select-none text-slate-400 hover:text-slate-300 transition-colors">
              <input 
                type="checkbox" 
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
              />
              <span>
                J'accepte que mes données textuelles soient analysées à des fins de démonstration.
                <strong className={darkMode ? "text-slate-200" : "text-slate-800"}> Aucune donnée clinique réelle n'est stockée </strong> 
                et toutes les données de session seront explicitement détruites après le Hackathon.
              </span>
            </label>
          </div>

          {error && (
            <p className="text-xs text-rose-500 font-bold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 text-center animate-shake">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isSignUp ? "Créer mon compte" : "Accéder au Dashboard"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-500 underline transition-colors"
          >
            {isSignUp ? "Déjà inscrit ? Connectez-vous" : "Pas de compte ? Créez-en un ici"}
          </button>
        </div>

      </div>
    </div>
  );
};

function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState('parent');
  const [darkMode] = useState(true);

  useEffect(() => {
    if (window.location.pathname === '/auth-callback') {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (window.opener) {
          window.opener.postMessage({ type: 'supabase:auth', session }, window.location.origin);
          window.close();
        } else {
          setSession(session);
          window.location.replace('/');
        }
      });
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const listener = (e) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'supabase:auth') setSession(e.data.session);
    };
    
    window.addEventListener('message', listener);
    return () => { subscription.unsubscribe(); window.removeEventListener('message', listener); };
  }, []);

  return (
    <div className={`min-h-screen relative transition-all duration-300 font-sans overflow-x-hidden ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {!session ? (
        <LoginConsent
          darkMode={darkMode}
          onLoginSuccess={(role) => {
            setUserRole(role);
            setSession({ user: true });
          }}
        />
      ) : (
        <div className="relative min-h-screen flex flex-col animate-in fade-in duration-500">
          
          <nav className="border-b p-4 flex justify-between items-center bg-slate-950 border-slate-800">
            <span className="text-xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-pink-400">HKEYA • حكاية</span>
            <div className="flex gap-4 items-center">
              <span className="text-xs font-bold px-3 py-1 bg-slate-900 rounded-lg text-indigo-400 border border-slate-800 uppercase">
                Rôle : {userRole}
              </span>
              <button onClick={() => setSession(null)} className="text-xs bg-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white transition-colors px-3 py-1.5 rounded-lg font-bold border border-rose-500/30">
                Déconnexion
              </button>
            </div>
          </nav>

          {/* Main Content */}
          <main className="p-6">
            {userRole === 'healthcare' ? (
              <DoctorDashboard darkMode={darkMode} />
            ) : (
              <CompanionMonitor darkMode={darkMode} />
            )}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
