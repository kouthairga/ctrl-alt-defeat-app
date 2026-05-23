// src/components/DoctorDashboard.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Activity, Clock } from 'lucide-react';

const DoctorDashboard = ({ darkMode }) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAssessments() {
    try {
      // Récupère les analyses triées de la plus récente à la plus ancienne
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error) {
      console.error("Erreur Fetch:", error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadAssessments = async () => {
      await fetchAssessments();
    };
    loadAssessments();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black">Tableau de Bord Médical</h2>
          <p className="text-sm text-slate-400 mt-1">Supervision des signaux d'alerte et suivi thérapeutique</p>
        </div>
        <button onClick={fetchAssessments} className="text-xs px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500">
          Actualiser les données
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Activity className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : assessments.length === 0 ? (
        <div className={`p-8 text-center rounded-xl border ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
          Aucune donnée clinique remontée pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((item) => (
            <div key={item.id} className={`p-5 rounded-xl border flex flex-col md:flex-row gap-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              
              {/* Score et Alerte */}
              <div className="shrink-0 flex flex-col items-center justify-center w-24 border-r border-slate-800/50 pr-6">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-2">Anxiété</span>
                <span className={`text-3xl font-black ${item.anxiety_score >= 70 ? 'text-rose-500' : item.anxiety_score >= 40 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {item.anxiety_score}
                </span>
              </div>

              {/* Contenu */}
              <div className="grow space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" /> 
                  {new Date(item.created_at).toLocaleString('fr-FR')} 
                  <span className="px-2 py-0.5 rounded bg-slate-800 ml-2">{item.emotion}</span>
                </div>
                
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">Observation Entourage :</span>
                  <p className="text-sm italic mt-1">"{item.input_text}"</p>
                </div>

                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase flex items-center gap-1 mb-1">
                    <Activity className="w-3 h-3" /> Analyse IA Différentielle :
                  </span>
                  <p className="text-sm font-medium">{item.clinical_analysis}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;