import { useState } from 'react';
import { 
  Brain, Activity, Sparkles, Sun, Moon, Menu, X, Cpu, Settings, 
  Globe, User, Bell, Eye, Info, RefreshCw, LogOut 
} from 'lucide-react';

function App() {
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
      quitBtn: "Quitter",
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
      alertReset: "Réinitialisation de la session de démonstration..."
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
      alertReset: "Resetting demonstration session..."
    }
  };

  const t = translations[language];

  const getTextSize = (type) => {
    const scales = {
      small:  { xs: 'text-[9px]',  sm: 'text-xs',   base: 'text-sm',   lg: 'text-base',  xl: 'text-lg',   title: 'text-xl' },
      medium: { xs: 'text-[10px]', sm: 'text-sm',   base: 'text-base', lg: 'text-lg',    xl: 'text-xl',   title: 'text-2xl' },
      large:  { xs: 'text-sm',     sm: 'text-base', base: 'text-lg',   lg: 'text-xl',    xl: 'text-2xl',  title: 'text-3xl' }
    };
    return scales[fontSize][type];
  };

  return (
    <div className={`min-h-screen relative transition-all duration-300 font-sans overflow-x-hidden ${
      highContrast 
        ? 'bg-black text-white' 
        : darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Conteneur global du contenu */}
      <div className="relative min-h-screen flex flex-col">
        
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
                CTRL_ALT_DEFEAT
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
              CTRL_ALT_DEFEAT // ENGINE_V1.0
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
                     
                     {/* 1. Compte & Session */}
                     <div className={`border p-4 rounded-xl flex items-center justify-between ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-4">
                           <div className="p-2.5 bg-indigo-500/10 rounded-full text-indigo-400">
                              <User className="w-6 h-6" />
                           </div>
                           <div>
                              <p className={`${getTextSize('sm')} font-bold`}>{t.userSession}</p>
                              <p className={`${getTextSize('xs')} text-slate-400 font-mono`}>Admin_Ctrl_Alt_Defeat (Lead)</p>
                           </div>
                        </div>
                        <button 
                           onClick={() => alert(t.alertReset)}
                           className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getTextSize('xs')} font-bold border-rose-500/20 text-rose-500 hover:bg-rose-600 hover:text-white transition-all`}
                        >
                           <LogOut className="w-3 h-3" /> {t.quitBtn}
                        </button>
                     </div>

                     {/* 2. Langue */}
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

                     {/* 3. Notifications & Alertes */}
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

                     {/* 4. Accessibilité visuelle */}
                     <div className={`border p-5 rounded-xl space-y-4 ${darkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <h3 className={`font-mono font-black uppercase text-indigo-400 flex items-center gap-2 ${getTextSize('xs')}`}>
                           <Eye className="w-4 h-4" /> {t.accessHeading}
                        </h3>
                        
                        {/* Taille Police */}
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

                        {/* Mode Contraste élevé */}
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
    </div>
  );
}

export default App;
hii