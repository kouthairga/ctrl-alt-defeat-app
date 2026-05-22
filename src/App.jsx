import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { 
  Brain, Activity, Sparkles, Sun, Moon, Menu, X, Cpu, Settings, 
  Globe, User, Bell, Eye, Info, RefreshCw, LogOut, ShieldAlert, Lock, Mail,
  Users, School, HeartPulse
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
          <div className={`h-[1px] flex-1 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
          <span className="px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">Ou via identifiants</span>
          <div className={`h-[1px] flex-1 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
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
              <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
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
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm rounded-xl uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [language, setLanguage] = useState('fr'); 
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('medium');

  const translations = {
    fr: {
      statusTab: "Status",
      configTab: "Config",
      dashboardTitle: "Tableau de Bord",
      settingsTitle: "Paramètres Système",
      appStatus: "Système Opérationnel",
      coreApp: "Application",
      readyToCode: "PRÊT À CODER",
      interfaceCard: "Interface",
      mockupOk: "MAQUETTE_OK",
      configHeading: "Configuration de l'Application",
      userSession: "Session Utilisateur",
      quitBtn: "Déconnexion",
      geoHeading: "Préférences Régionales",
      langLabel: "Langue du Système",
      alertTitle: "Alertes Sonores Système",
      alertDesc: "Émettre un signal sonore lors de la validation des calculs",
      accessHeading: "Accessibilité Visuelle",
      textSizeTitle: "Taille du texte global",
      textSizeDesc: "Adapter l'échelle de lecture de l'interface",
      contrastTitle: "Mode Contraste Élevé",
      contrastDesc: "Forcer un fond noir pur et du texte blanc haute visibilité",
      versionLabel: "Version",
      storageLabel: "Stockage local",
      storageOk: "Opérationnel",
      alertReset: "Fermeture de la session sécurisée..."
    },
    en: {
      statusTab: "Status",
      configTab: "Settings",
      dashboardTitle: "Dashboard",
      settingsTitle: "System Settings",
      appStatus: "Operational System",
      coreApp: "Core Engine",
      readyToCode: "READY TO CODE",
      interfaceCard: "Interface Layer",
      mockupOk: "MOCKUP_OK",
      configHeading: "Application Configuration",
      userSession: "User Session",
      quitBtn: "Logout",
      geoHeading: "Regional Preferences",
      langLabel: "System Language",
      alertTitle: "System Audio Alerts",
      alertDesc: "Emit a technological beep upon calculation validation",
      accessHeading: "Visual Accessibility",
      textSizeTitle: "Global Text Size",
      textSizeDesc: "Scale the interface readability dynamically",
      contrastTitle: "High Contrast Mode",
      contrastDesc: "Force pure black background and high-visibility white text",
      versionLabel: "Version",
      storageLabel: "Local Storage",
      storageOk: "Operational",
      alertReset: "Closing secured session..."
    }
  };

  const t = translations[language];
  const roleLabels = {
    parent: 'Parent',
    school: 'École',
    healthcare: 'Médecin',
  };

  const getTextSize = (type) => {
    const scales = {
      small:  { xs: 'text-[9px]',  sm: 'text-xs',   base: 'text-sm',   lg: 'text-base',  xl: 'text-lg',   title: 'text-xl' },
      medium: { xs: 'text-[10px]', sm: 'text-sm',   base: 'text-base', lg: 'text-lg',    xl: 'text-xl',   title: 'text-2xl' },
      large:  { xs: 'text-sm',     sm: 'text-base', base: 'text-lg',   lg: 'text-xl',    xl: 'text-2xl',  title: 'text-3xl' }
    };
    return scales[fontSize][type];
  };

  const handleLogout = () => {
    alert(t.alertReset);
    setSession(null);
    setActiveTab('dashboard');
  };

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
      highContrast 
        ? 'bg-black text-white' 
        : darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {!session ? (
        <LoginConsent
          darkMode={darkMode}
          onLoginSuccess={async (role) => {
            setUserRole(role);
            const { data } = await supabase.auth.getSession();
            setSession(data.session || { user: true }); // Simulation fall-back si pas encore de backend Supabase actif pour la démo immédiate
          }}
        />
      ) : (
        <div className="relative min-h-screen flex flex-col animate-in fade-in duration-500">
          
          {/* Navbar */}
          <nav className={`border-b px-6 py-4 flex justify-between items-center backdrop-blur-md transition-all duration-500 sticky top-0 z-40 ${
            highContrast 
              ? 'border-white bg-black' 
              : darkMode ? 'border-slate-800/80 bg-slate-950/70' : 'border-slate-200 bg-white/80'
          }`}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className={`p-2 rounded-lg transition-all duration-300 relative group ${
                  darkMode ? 'hover:bg-slate-900 text-slate-300 hover:text-indigo-400' : 'hover:bg-slate-100 text-slate-600 hover:text-indigo-600'
                }`}
              >
                <Menu className="w-6 h-6 relative z-10" />
                <span className="absolute inset-0 w-full h-full bg-indigo-500/10 scale-0 rounded-lg group-hover:scale-100 transition-transform duration-300"></span>
              </button>

              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                <div className="relative">
                  <Brain className={`w-8 h-8 relative z-10 transition-transform duration-500 group-hover:rotate-[360deg] ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  <span className="absolute -inset-1 bg-indigo-500/30 rounded-full blur-sm animate-ping opacity-70"></span>
                </div>
                <span className={`${getTextSize('xl')} font-black tracking-widest bg-gradient-to-r bg-clip-text text-transparent ${
                  darkMode ? 'from-indigo-400 via-purple-400 to-pink-400' : 'from-indigo-600 via-purple-600 to-pink-600'
                }`}>
                  HKEYA • حكاية
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex gap-3">
                {['dashboard', 'settings'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-5 py-2 rounded-lg ${getTextSize('xs')} font-black uppercase tracking-widest overflow-hidden transition-all duration-300 ${
                      activeTab === tab 
                        ? 'text-white bg-indigo-600 shadow-lg shadow-indigo-600/30' 
                        : (darkMode ? 'text-slate-400 hover:text-slate-100 bg-slate-900/40' : 'text-slate-600 hover:text-slate-900 bg-slate-100')
                    }`}
                  >
                    <span className="relative z-10">
                      {tab === 'dashboard' ? t.statusTab : t.configTab}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl border transition-all duration-300 hover:scale-110 ${
                  darkMode 
                    ? 'bg-slate-900 border-slate-800 text-amber-400 hover:border-amber-400/50' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500/50'
                }`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </nav>

          {/* Sidebar */}
          <div className={`fixed inset-0 z-50 transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}>
            <div onClick={() => setIsMenuOpen(false)} className={`absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} />
            <aside className={`absolute top-0 left-0 h-full w-80 p-6 shadow-2xl transition-transform duration-500 flex flex-col justify-between border-r ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } ${darkMode ? 'bg-slate-900/95 border-slate-800/80 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-900'}`}>
              
              <div>
                <div className={`flex items-center justify-between mb-10 text-indigo-400 ${getTextSize('xs')}`}>
                  <span className="font-mono tracking-[0.2em] font-black uppercase">CORE_NAVIGATOR</span>
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:rotate-90 transition-transform">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'dashboard', label: t.dashboardTitle, icon: Activity },
                    { id: 'settings', label: t.settingsTitle, icon: Settings }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }}
                        className={`w-full text-left px-4 py-3.5 rounded-xl font-bold ${getTextSize('sm')} transition-all duration-300 flex items-center gap-4 border ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg shadow-indigo-600/20 translate-x-2'
                            : (darkMode ? 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700 hover:bg-slate-800/50 text-slate-400' : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100 text-slate-600')
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={`pt-4 border-t text-center font-mono ${getTextSize('xs')} tracking-widest ${darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'}`}>
                HKEYA PROTOCLE // ENGINE_V1.0
              </div>
            </aside>
          </div>

          {/* Main Content */}
          <main className="max-w-4xl mx-auto p-6 mt-6 flex-1 w-full relative">
            
            {/* TAB 1 : DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-indigo-500 opacity-50"></div>
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span className={`${getTextSize('xs')} font-mono font-black uppercase text-slate-500 tracking-[0.2em]`}>Live_Status</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-indigo-500 opacity-50"></div>
                </div>

                <div className={`border rounded-2xl p-8 shadow-xl transition-all duration-500 border-slate-800/80 ${darkMode ? 'bg-slate-900/75 backdrop-blur-md' : 'bg-white/75 backdrop-blur-md'}`}>
                  <h2 className={`${getTextSize('title')} font-black mb-8 tracking-tight`}>{t.appStatus}</h2>
                  <p className="mb-4 text-sm text-slate-400">Espace connecté avec succès en tant que : <strong className="text-indigo-400">{roleLabels[userRole]}</strong></p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`border p-5 rounded-xl flex items-center gap-4 ${darkMode ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-50/80 border-slate-200'}`}>
                        <Activity className="w-6 h-6 text-emerald-400" />
                        <div>
                            <h4 className={`font-mono ${getTextSize('xs')} uppercase text-slate-500 tracking-wider`}>{t.coreApp}</h4>
                            <p className={`${getTextSize('base')} font-black ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{t.readyToCode}</p>
                        </div>
                    </div>
                    <div className={`border p-5 rounded-xl flex items-center gap-4 ${darkMode ? 'bg-slate-950/50 border-slate-800/80' : 'bg-slate-50/80 border-slate-200'}`}>
                        <Cpu className="w-6 h-6 text-purple-400" />
                        <div>
                            <h4 className={`font-mono ${getTextSize('xs')} uppercase text-slate-500 tracking-wider`}>{t.interfaceCard}</h4>
                            <p className={`${getTextSize('base')} font-black ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{t.mockupOk}</p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2 : PARAMÈTRES */}
            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                 <div className={`border rounded-2xl p-8 shadow-xl ${darkMode ? 'bg-slate-900/75 border-slate-800 backdrop-blur-md' : 'bg-white/75 border-slate-200 backdrop-blur-md'}`}>
                    <h2 className={`${getTextSize('title')} font-black mb-8 flex items-center gap-3`}>
                       <Settings className="w-6 h-6 text-indigo-500" />
                       {t.configHeading}
                    </h2>
                    
                    <div className="space-y-6">
                       <div className={`border p-4 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-center gap-4">
                             <div className="p-2.5 bg-indigo-500/10 rounded-full text-indigo-400">
                                <User className="w-6 h-6" />
                             </div>
                             <div>
                                <p className={`${getTextSize('sm')} font-bold`}>{t.userSession}</p>
                                <p className={`${getTextSize('xs')} text-slate-400 font-mono`}>{roleLabels[userRole]} • Session active</p>
                             </div>
                          </div>
                          <button 
                             onClick={handleLogout}
                             className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getTextSize('xs')} font-bold border-rose-500/20 text-rose-500 hover:bg-rose-600 hover:text-white transition-all`}
                          >
                             <LogOut className="w-3 h-3" /> {t.quitBtn}
                          </button>
                       </div>

                       <div className={`border p-5 rounded-xl space-y-4 ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <h3 className={`text-xs font-mono font-black uppercase text-indigo-400 flex items-center gap-2 ${getTextSize('xs')}`}>
                             <Globe className="w-4 h-4" /> {t.geoHeading}
                          </h3>
                          <div className="flex flex-col gap-2 max-w-xs">
                             <label className={`${getTextSize('xs')} text-slate-400`}>{t.langLabel}</label>
                             <select 
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className={`p-2.5 rounded-lg ${getTextSize('xs')} font-mono border outline-none ${darkMode ? 'bg-slate-900 border-slate-800 text-white focus:border-indigo-500' : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600'}`}
                             >
                                <option value="fr">Français (FR)</option>
                                <option value="en">English (EN)</option>
                             </select>
                          </div>
                       </div>

                       <div className={`border p-4 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex items-center gap-3">
                             <Bell className="w-5 h-5 text-indigo-400" />
                             <div>
                                <p className={`${getTextSize('sm')} font-bold`}>{t.alertTitle}</p>
                                <p className={`${getTextSize('xs')} text-slate-500`}>{t.alertDesc}</p>
                             </div>
                          </div>
                          <div 
                             onClick={() => setSoundAlerts(!soundAlerts)}
                             className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${soundAlerts ? 'bg-indigo-600' : 'bg-slate-700'}`}
                          >
                             <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${soundAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                          </div>
                       </div>

                       <div className={`border p-5 rounded-xl space-y-4 ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <h3 className={`font-mono font-black uppercase text-indigo-400 flex items-center gap-2 ${getTextSize('xs')}`}>
                             <Eye className="w-4 h-4" /> {t.accessHeading}
                          </h3>
                          <div className="flex items-center justify-between">
                             <div>
                                <p className={`${getTextSize('sm')} font-bold`}>{t.textSizeTitle}</p>
                                <p className={`${getTextSize('xs')} text-slate-500`}>{t.textSizeDesc}</p>
                             </div>
                             <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                                {['small', 'medium', 'large'].map((size) => (
                                   <button
                                      key={size}
                                      onClick={() => setFontSize(size)}
                                      className={`px-3 py-1 rounded text-xs font-bold uppercase transition-all ${fontSize === size ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                   >
                                      {size === 'small' ? 'A' : size === 'medium' ? 'A+' : 'A++'}
                                   </button>
                                ))}
                             </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">
                             <div>
                                <p className={`${getTextSize('sm')} font-bold`}>{t.contrastTitle}</p>
                                <p className={`${getTextSize('xs')} text-slate-500`}>{t.contrastDesc}</p>
                             </div>
                             <div 
                                onClick={() => setHighContrast(!highContrast)}
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${highContrast ? 'bg-indigo-600' : 'bg-slate-700'}`}
                             >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${highContrast ? 'translate-x-6' : 'translate-x-0'}`} />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Pied de page technique */}
                 <div className={`border rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono ${getTextSize('xs')} ${
                    darkMode ? 'bg-slate-950/60 border-slate-800 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
                 }`}>
                    <div className="flex items-center gap-2">
                       <Info className="w-4 h-4 text-indigo-400" />
                       <span>{t.versionLabel} : <strong className={darkMode ? 'text-slate-300' : 'text-slate-700'}>1.0.0 (Build Hackathon)</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                       <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                       <span>{t.storageLabel} : <strong className="text-emerald-500">{t.storageOk}</strong></span>
                    </div>
                    <div>
                       <span>Licence : <strong>MIT</strong></span>
                    </div>
                 </div>

              </div>
            )}

          </main>
        </div>
      )}
    </div>
  );
}

export default App;
