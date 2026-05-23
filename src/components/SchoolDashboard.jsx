import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const SchoolDashboard = ({ darkMode }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated school data
  const mockStudents = [
    { id: 1, name: 'Ahmed Ben Ali', anxiety_trend: 'stable', last_update: '2026-05-23', status: 'normal' },
    { id: 2, name: 'Fatima Karimi', anxiety_trend: 'improved', last_update: '2026-05-22', status: 'normal' },
    { id: 3, name: 'Karim Mansouri', anxiety_trend: 'alert', last_update: '2026-05-21', status: 'vigilance' }
  ];

  const trendData = [
    { week: 'Sem 1', attendance: 92, engagement: 85 },
    { week: 'Sem 2', attendance: 88, engagement: 78 },
    { week: 'Sem 3', attendance: 95, engagement: 92 },
    { week: 'Sem 4', attendance: 91, engagement: 88 }
  ];

  useEffect(() => {
    setStudents(mockStudents);
    setLoading(false);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-black">Tableau de Bord Établissement</h1>
        </div>
        <p className="text-sm text-slate-400">Suivi du bien-être et de l'engagement des élèves</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <label className="text-xs font-bold text-slate-400 uppercase">Élèves Suivis</label>
          <p className="text-3xl font-black mt-2 text-indigo-400">{students.length}</p>
        </div>
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <label className="text-xs font-bold text-slate-400 uppercase">Statut Normal</label>
          <p className="text-3xl font-black mt-2 text-emerald-400">
            {students.filter(s => s.status === 'normal').length}
          </p>
        </div>
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <label className="text-xs font-bold text-slate-400 uppercase">Vigilance Requise</label>
          <p className="text-3xl font-black mt-2 text-amber-400">
            {students.filter(s => s.status === 'vigilance').length}
          </p>
        </div>
      </div>

      {/* Attendance & Engagement Trend */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold">Tendances Hebdomadaires</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
            <XAxis stroke={darkMode ? '#64748b' : '#94a3b8'} />
            <YAxis stroke={darkMode ? '#64748b' : '#94a3b8'} />
            <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: '1px solid #e2e8f0' }} />
            <Legend />
            <Line type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={2} name="Assiduité %" />
            <Line type="monotone" dataKey="engagement" stroke="#a855f7" strokeWidth={2} name="Engagement %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Students List */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <h2 className="text-xl font-bold mb-4">Liste des Élèves Suivis</h2>
        <div className="space-y-2 overflow-y-auto max-h-96">
          {students.map((student) => (
            <div
              key={student.id}
              className={`p-4 rounded-lg border flex justify-between items-center transition-all ${
                student.status === 'vigilance'
                  ? darkMode ? 'bg-amber-950/30 border-amber-700/30' : 'bg-amber-50 border-amber-200'
                  : darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                {student.status === 'vigilance' ? (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                )}
                <div>
                  <p className="font-bold">{student.name}</p>
                  <p className="text-xs text-slate-400">Mis à jour le {student.last_update}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                student.status === 'vigilance'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {student.status === 'vigilance' ? 'Vigilance' : 'Normal'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className={`p-4 rounded-xl border ${darkMode ? 'bg-indigo-950/20 border-indigo-900/50' : 'bg-indigo-50 border-indigo-100'}`}>
        <p className="text-xs text-slate-400">
          💡 <strong>Conseil :</strong> Surveillez l'engagement et l'assiduité de chaque élève. 
          Utilisez les données pour identifier rapidement les élèves ayant besoin d'un soutien supplémentaire.
        </p>
      </div>
    </div>
  );
};

export default SchoolDashboard;
