import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Play, History, TrendingUp, Dumbbell, Check, Clock, Share2, X, 
  Flame, Award, Settings, User, LogOut, Calendar, Plus, Wand2, Archive, Loader2 
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('treinos');
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('luan_training_routines');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Treino A - Hipertrofia (Peito e Tríceps)',
        days: [
          { day: 'Dia 1', focus: 'Membros Superiores', exercises: [
            { name: 'Supino Reto', sets: 4, reps: '10-12' },
            { name: 'Supino Inclinado com Halteres', sets: 3, reps: '10-12' },
            { name: 'Tríceps na Polia', sets: 3, reps: '12' }
          ]}
        ]
      }
    ];
  });
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('luan_training_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [prs, setPrs] = useState(() => {
    const saved = localStorage.getItem('luan_training_prs');
    return saved ? JSON.parse(saved) : { 'Supino Reto': '80kg', 'Agachamento': '100kg' };
  });

  const [activeSession, setActiveSession] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Inputs do gerador de IA
  const [age, setAge] = useState('25');
  const [weight, setWeight] = useState('70');
  const [gender, setGender] = useState('Masculino');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [goal, setGoal] = useState('Hipertrofia (Ganho de Massa)');

  // Salvar automaticamente no localStorage
  useEffect(() => {
    localStorage.setItem('luan_training_routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('luan_training_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('luan_training_prs', JSON.stringify(prs));
  }, [prs]);

  // Gerador de Treino IA Offline
  const handleGenerateAIWorkout = () => {
    setLoadingAI(true);
    setTimeout(() => {
      const newRoutine = {
        id: Date.now().toString(),
        name: `Treino IA (${goal.split(' ')[0]}) - ${daysPerWeek}x/sem`,
        days: [
          { day: 'Dia 1', focus: 'Peito e Tríceps', exercises: [{ name: 'Supino Reto', sets: 4, reps: '10' }, { name: 'Crucifixo', sets: 3, reps: '12' }] },
          { day: 'Dia 2', focus: 'Costas e Bíceps', exercises: [{ name: 'Puxada Alta', sets: 4, reps: '10' }, { name: 'Rosca Direta', sets: 3, reps: '12' }] },
          { day: 'Dia 3', focus: 'Pernas Completo', exercises: [{ name: 'Agachamento Livre', sets: 4, reps: '8' }, { name: 'Leg Press', sets: 3, reps: '12' }] },
        ]
      };
      setRoutines([newRoutine, ...routines]);
      setLoadingAI(false);
      setActiveTab('treinos');
      alert('Treino gerado e salvo com sucesso no seu dispositivo!');
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-900 text-slate-100 flex flex-col shadow-2xl relative pb-20">
      {/* Header */}
      <header className="p-4 bg-slate-900/80 backdrop-blur sticky top-0 z-10 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Dumbbell className="text-lime-400 w-6 h-6" />
          <h1 className="font-bold text-lg text-lime-400 tracking-wide">LUAN TRAINING</h1>
        </div>
        <span className="text-xs bg-lime-500/10 text-lime-400 border border-lime-500/20 px-2 py-1 rounded-full font-medium">Offline Mode</span>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'ia' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="text-lime-400 w-5 h-5" />
              <h2 className="text-xl font-bold">Gerador de Treino IA</h2>
            </div>
            <p className="text-sm text-slate-400">Preencha seus dados para montarmos sua rotina personalizada instantaneamente.</p>
            
            <div className="space-y-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Idade</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-lime-400 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Peso (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-lime-400 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Sexo</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-lime-400 outline-none">
                  <option>Masculino</option>
                  <option>Feminino</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Dias por Semana</label>
                <input type="number" value={daysPerWeek} onChange={e => setDaysPerWeek(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-lime-400 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Objetivo</label>
                <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:border-lime-400 outline-none">
                  <option>Hipertrofia (Ganho de Massa)</option>
                  <option>Emagrecimento / Definição</option>
                  <option>Força Pura</option>
                </select>
              </div>
              
              <button 
                onClick={handleGenerateAIWorkout} 
                disabled={loadingAI}
                className="w-full mt-4 bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20"
              >
                {loadingAI ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                {loadingAI ? 'Criando Treino...' : 'GERAR MEU TREINO'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'treinos' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Dumbbell className="text-lime-400 w-5 h-5" /> Minhas Rotinas
              </h2>
              <button onClick={() => setActiveTab('ia')} className="text-xs bg-slate-800 hover:bg-slate-700 text-lime-400 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium">
                <Plus className="w-4 h-4" /> Novo Treino IA
              </button>
            </div>

            {routines.length === 0 ? (
              <div className="text-center py-12 text-slate-500">Nenhum treino cadastrado. Use a IA para criar o primeiro!</div>
            ) : (
              routines.map(routine => (
                <div key={routine.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
                  <h3 className="font-bold text-base text-lime-400">{routine.name}</h3>
                  <div className="space-y-2">
                    {routine.days.map((d, idx) => (
                      <div key={idx} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                        <div className="text-xs font-bold text-slate-400 uppercase">{d.day} — {d.focus}</div>
                        <div className="mt-2 space-y-1">
                          {d.exercises.map((ex, i) => (
                            <div key={i} className="text-sm flex justify-between text-slate-300">
                              <span>{ex.name}</span>
                              <span className="text-xs text-slate-500">{ex.sets} séries × {ex.reps}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'progresso' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-lime-400 w-5 h-5" /> Recordes Pessoais (PRs)
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(prs).map(([exercise, weight], idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-medium">{exercise}</span>
                  <span className="text-2xl font-black text-lime-400 mt-2">{weight}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Barra de Navegação Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/90 backdrop-blur border-t border-slate-800 p-3 flex justify-around items-center z-20">
        <button onClick={() => setActiveTab('treinos')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'treinos' ? 'text-lime-400' : 'text-slate-500'}`}>
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] font-bold">Treinos</span>
        </button>
        <button onClick={() => setActiveTab('ia')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'ia' ? 'text-lime-400' : 'text-slate-500'}`}>
          <Wand2 className="w-5 h-5" />
          <span className="text-[10px] font-bold">Gerar IA</span>
        </button>
        <button onClick={() => setActiveTab('progresso')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'progresso' ? 'text-lime-400' : 'text-slate-500'}`}>
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-bold">PRs</span>
        </button>
      </nav>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
