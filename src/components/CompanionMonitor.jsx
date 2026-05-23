import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { ShieldCheck, ShieldAlert, Activity, FileText, Save, CheckCircle, BellRing, History } from 'lucide-react';

const CompanionMonitor = ({ darkMode }) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // SIMULATION : Le bilan du médecin à la fin de la dernière consultation
  const baselineClinicalState = {
    date: "12 Mai 2026",
    anxiety_score: 25,
    notes: "Fin de cycle TCC. L'enfant a retrouvé un sommeil complet. Anxiété sociale très diminuée. Objectif de maintien : stabilité de l'humeur et retour progressif aux activités de groupe."
  };

  const demoPrompts = [
    "Il a bien dormi, il est parti à l'école avec le sourire et a parlé de son match de foot.", 
    "Il recommence à faire des cauchemars depuis deux nuits. Ce matin, il avait mal au ventre avant de partir à l'école.",
    "Il s'enferme dans sa chambre dès le retour de l'école. Il refuse de manger avec nous et semble très irritable."
  ];

  const handleAnalyze = async () => {
    if (!inputText) return;
    setIsAnalyzing(true);
    setSaveSuccess(false);

    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
      
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Clé d’API Gemini manquante. Ajoute VITE_GEMINI_API_KEY dans ton .env.');
      }

      const prompt = `Tu es le "Compagnon IA", un système de télésurveillance psychiatrique.
      Voici l'état clinique de l'enfant à la sortie de sa dernière consultation médicale : 
      "Score d'anxiété : ${baselineClinicalState.anxiety_score}/100. Notes du médecin : ${baselineClinicalState.notes}"
      
      Voici la nouvelle observation remontée aujourd'hui par l'entourage : "${inputText}".
      
      Compare cette nouvelle observation avec l'état clinique de sortie. Détecte s'il y a un risque de rechute ou un signal d'alerte.
      Renvoie UNIQUEMENT un objet JSON strict avec cette structure exacte :
      {
        "current_anxiety_score": <nombre entier 0-100>,
        "emotion": "Joie | Tristesse | Peur | Colère | Neutre",
        "alert_level": "NORMAL" | "VIGILANCE" | "CRITIQUE",
        "relapse_warning": <true ou false>,
        "clinical_analysis": "<Explication du delta par rapport à la dernière consultation (2 phrases max)>"
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const result = JSON.parse(response.text);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Erreur Gemini:', error);
      alert(`Erreur lors de l'analyse IA : ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToSupabase = async () => {
    if (!analysisResult) return;
    setIsSaving(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase.from('assessments').insert([{
        user_id: user.id, 
        input_text: inputText,
        emotion: analysisResult.emotion,
        anxiety_score: parseInt(analysisResult.current_anxiety_score),
        clinical_analysis: analysisResult.clinical_analysis,
        // Si tu as ajouté les colonnes :
        // alert_level: analysisResult.alert_level,
        // relapse_warning: analysisResult.relapse_warning
      }]);

      if (error) throw error;
      setSaveSuccess(true);
    } catch (error) {
      alert("Erreur de sauvegarde : " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getAlertUI = (level) => {
    switch(level) {
      case 'CRITIQUE': return { color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/50', icon: BellRing, text: 'ALERTE : RISQUE DE RECHUTE' };
      case 'VIGILANCE': return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/50', icon: Activity, text: 'VIGILANCE REQUISE' };
      default: return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', icon: ShieldCheck, text: 'STATUT STABLE' };
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* 1. RAPPEL DU BILAN CLINIQUE (Baseline) */}
      <div className={`p-4 rounded-xl border flex gap-4 items-start ${darkMode ? 'bg-indigo-950/20 border-indigo-900/50 text-indigo-200' : 'bg-indigo-50 border-indigo-100 text-indigo-900'}`}>
        <History className="w-6 h-6 mt-1 shrink-0" />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">Référence : Bilan médical du {baselineClinicalState.date}</h4>
          <p className="text-sm font-medium">"{baselineClinicalState.notes}"</p>
          <div className="mt-2 text-xs font-bold bg-indigo-500/20 inline-block px-2 py-1 rounded">
            Anxiété de sortie : {baselineClinicalState.anxiety_score}/100
          </div>
        </div>
      </div>

      {/* 2. NOUVELLE OBSERVATION */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-indigo-400" />
          <h3 className="text-lg font-bold">Compte-rendu du jour</h3>
        </div>
        
        <textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Comportement observé aujourd'hui..."
          className={`w-full p-4 rounded-xl border mb-4 focus:ring-2 focus:ring-indigo-500 transition-all ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
          rows="3"
        />

        <div className="flex flex-col gap-2 mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase">Tester un scénario :</span>
          <div className="flex flex-wrap gap-2">
            {demoPrompts.map((demo, idx) => (
              <button 
                key={idx} onClick={() => setInputText(demo)}
                className={`text-left text-xs px-3 py-2 rounded-lg border transition-all ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'}`}
              >
                {demo}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || !inputText}
          className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl disabled:opacity-50"
        >
          {isAnalyzing ? <Activity className="w-5 h-5 animate-pulse" /> : <ShieldAlert className="w-5 h-5" />}
          {isAnalyzing ? 'Analyse du risque en cours...' : 'Vérifier la stabilité clinique'}
        </button>
      </div>

      {/* 3. RESULTAT : LE RADAR A RECHUTE */}
      {analysisResult && (() => {
        const ui = getAlertUI(analysisResult.alert_level);
        const AlertIcon = ui.icon;
        
        return (
          <div className={`p-6 rounded-2xl border-2 ${ui.border} ${darkMode ? 'bg-slate-900' : 'bg-white'} animate-in fade-in slide-in-from-bottom-4`}>
            
            <div className={`p-4 rounded-xl mb-6 flex items-center justify-between ${ui.bg} ${ui.color}`}>
              <div className="flex items-center gap-3">
                <AlertIcon className="w-6 h-6" />
                <h3 className="text-lg font-black tracking-wide">{ui.text}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase opacity-80 block">Score Actuel</span>
                <span className="text-2xl font-black">{analysisResult.current_anxiety_score}/100</span>
              </div>
            </div>

            <div className="space-y-4 px-2">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Émotion Dominante</label>
                <p className="text-lg font-bold mt-1">{analysisResult.emotion}</p>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Analyse Différentielle (IA)</label>
                <p className="text-sm mt-1 leading-relaxed border-l-2 border-indigo-500 pl-3 py-1">
                  {analysisResult.clinical_analysis}
                </p>
              </div>
            </div>

            <button 
              onClick={handleSaveToSupabase}
              disabled={isSaving || saveSuccess}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-3 border font-bold rounded-xl transition-all ${
                saveSuccess 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 cursor-not-allowed'
                  : 'border-indigo-600/30 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20'
              }`}
            >
              {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : saveSuccess ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saveSuccess ? 'Enregistré dans l\'historique' : 'Consigner cette observation'}
            </button>
          </div>
        );
      })()}
    </div>
  );
};

export default CompanionMonitor;