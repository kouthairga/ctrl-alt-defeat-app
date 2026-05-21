import { useState } from 'react';
import { Brain, Activity, Sparkles } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-indigo-400 animate-pulse" />
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            CTRL_ALT_DEFEAT
          </span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('assistant')}
            className={`px-4 py-2 rounded-lg transition ${activeTab === 'assistant' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Assistant IA
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 mt-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="text-2xl font-bold">Système Opérationnel</h2>
          </div>
          <p className="text-slate-400 mb-6">
            Votre environnement React + Tailwind v4 + Lucide React est configuré et prêt pour le début du hackathon à The Dot. 
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border border-slate-800 bg-slate-950/50 p-4 rounded-xl flex items-center gap-4">
              <Activity className="w-10 h-10 text-emerald-400" />
              <div>
                <h4 className="font-semibold text-sm text-slate-400">Statut de la Stack</h4>
                <p className="text-lg font-bold text-emerald-400">Prêt à coder (100%)</p>
              </div>
            </div>
            <div className="border border-slate-800 bg-slate-950/50 p-4 rounded-xl flex items-center gap-4">
              <Brain className="w-10 h-10 text-purple-400" />
              <div>
                <h4 className="font-semibold text-sm text-slate-400">Composants IA</h4>
                <p className="text-lg font-bold text-purple-400">Gemini Key en attente</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;