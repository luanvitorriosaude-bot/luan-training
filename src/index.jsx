import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Play, History, TrendingUp, Dumbbell, Check, Clock, Wand2, X, Loader2, Plus, Trash2, Edit3, Calendar as CalendarIcon, Flame, Search, Compass, BookmarkCheck
} from 'lucide-react';

// --- BIBLIOTECA COMPLETA COM OS MODELOS DAS IMAGENS ---
const SAVED_WORKOUT_TEMPLATES = [
  {
    id: 'template-completo-1',
    name: 'Treino A & C - Membros Inferiores (Quadríceps, Posteriores e Glúteos)',
    category: 'Inferiores 🍑',
    exercises: [
      { name: 'Agachamento (barra)', sets: 3, reps: '8 reps' },
      { name: 'Leg Press Inclinado', sets: 3, reps: '12 reps' },
      { name: 'Extensão de Pernas (máquina)', sets: 3, reps: '3 séries' },
      { name: 'Levantamento Terra (barra)', sets: 3, reps: '3 séries' },
      { name: 'Elevação de Quadril (máquina)', sets: 3, reps: '3 séries' },
      { name: 'Cadeira Adutora', sets: 3, reps: '3 séries' },
      { name: 'Levantamento Terra Sumô (barra)', sets: 3, reps: '10 reps' },
      { name: 'Cadeira Abdutora', sets: 4, reps: '6-12 reps' },
      { name: 'Extensão de Quadril no Solo', sets: 3, reps: '8 reps' }
    ]
  },
  {
    id: 'template-superior-peito',
    name: 'Treino A - Peito e Ombros',
    category: 'Superiores - Peito ⚡',
    exercises: [
      { name: 'Crucifixo Inclinado (máquina)', sets: 3, reps: '3 séries' },
      { name: 'Supino Reto (máquina)', sets: 3, reps: '3 séries' },
      { name: 'Supino Inclinado (máquina)', sets: 3, reps: '3 séries' },
      { name: 'Supino Declinado (barra)', sets: 3, reps: '3 séries' },
      { name: 'Flexão de Braços', sets: 3, reps: '3 séries' },
      { name: 'Desenvolvimento de Ombros Sentado (halteres)', sets: 3, reps: '3 séries' },
      { name: 'Elevação Lateral (halteres)', sets: 3, reps: '3 séries' }
    ]
  },
  {
    id: 'template-superior-costas',
    name: 'Treino B - Costas e Bíceps',
    category: 'Superiores - Costas ⚡',
    exercises: [
      { name: 'Puxada - com triângulo (polia alta)', sets: 3, reps: '3 séries' },
      { name: 'Remada (máquina)', sets: 3, reps: '3 séries' },
      { name: 'Puxada Estendida (polia)', sets: 3, reps: '3 séries' },
      { name: 'Puxada - pegada aberta neutra (polia)', sets: 3, reps: '3 séries' },
      { name: 'Puxada com Pegada Fechada (barra fixa)', sets: 3, reps: '3 séries' },
      { name: 'Remada (barra)', sets: 3, reps: '3 séries' },
      { name: 'Rosca Alternada (halteres)', sets: 3, reps: '3 séries' },
      { name: 'Rosca Martelo (halteres)', sets: 3, reps: '3 séries' },
      { name: 'Rosca Direta (barra W)', sets: 3, reps: '3 séries' }
    ]
  },
  {
    id: 'template-superior-ombros-triceps',
    name: 'Treino D - Ombros, Tríceps e Peito',
    category: 'Superiores - Ombros & Tríceps ⚡',
    exercises: [
      { name: 'Desenvolvimento de Ombros Sentado (máquina)', sets: 3, reps: '3 séries' },
      { name: 'Rotação de Ombros Externa (polia)', sets: 3, reps: '3 séries' },
      { name: 'Remada Alta (halteres)', sets: 3, reps: '3 séries' },
      { name: 'Desenvolvimento de Ombros Arnold (halteres)', sets: 3, reps: '3 séries' },
      { name: 'Elevação Lateral Unilateral (polia)', sets: 3, reps: '3 séries' },
      { name: 'Supino Inclinado (halteres)', sets: 3, reps: '3 séries' },
      { name: 'Crossover (polia)', sets: 3, reps: '3 séries' },
      { name: 'Tríceps Coice Unilateral (halteres)', sets: 3, reps: '3 séries' },
      { name: 'Extensão de Tríceps (polia)', sets: 3, reps: '3 séries' }
    ]
  }
];

export function App() {
  const [activeTab, setActiveTab] = useState('treinos');
  
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('luan_training_routines');
    if (saved) return JSON.parse(saved);
    return [{
      id: '1',
      name: SAVED_WORKOUT_TEMPLATES[0].name,
      exercises: [...SAVED_WORKOUT_TEMPLATES[0].exercises]
    }];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('luan_training_history');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [prs, setPrs] = useState(() => {
    const saved = localStorage.getItem('luan_training_prs');
    return saved ? JSON.parse(saved) : { 'Supino Reto': '80kg', 'Agachamento': '100kg' };
  });

  const [editingRoutine, setEditingRoutine] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [setWeights, setSetWeights] = useState({});

  const [restTimeLeft, setRestTimeLeft] = useState(null);
  const [isResting, setIsResting] = useState(false);
  const defaultRestSeconds = 60;

  useEffect(() => localStorage.setItem('luan_training_routines', JSON.stringify(routines)), [routines]);
  useEffect(() => localStorage.setItem('luan_training_history', JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem('luan_training_prs', JSON.stringify(prs)), [prs]);

  useEffect(() => {
    let timer;
    if (activeSession) {
      timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    } else {
      setSessionTime(0);
    }
    return () => clearInterval(timer);
  }, [activeSession]);

  useEffect(() => {
    let restTimer;
    if (isResting && restTimeLeft > 0) {
      restTimer = setInterval(() => setRestTimeLeft(prev => prev - 1), 1000);
    } else if (restTimeLeft === 0) {
      setIsResting(false);
      setRestTimeLeft(null);
    }
    return () => clearInterval(restTimer);
  }, [isResting, restTimeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAdoptTemplate = (template) => {
    const newRoutine = {
      id: `${Date.now()}`,
      name: template.name,
      exercises: template.exercises.map(ex => ({ ...ex }))
    };
    setRoutines([newRoutine, ...routines]);
    setActiveTab('treinos');
    alert(`O modelo "${template.name}" foi adicionado aos seus treinos ativos!`);
  };

  const handleRemoveExercise = (routineId, index) => {
    setRoutines(routines.map(r => {
      if (r.id === routineId) {
        const updatedExs = [...r.exercises];
        updatedExs.splice(index, 1);
        return { ...r, exercises: updatedExs };
      }
      return r;
    }));
  };

  const handleDeleteRoutine = (routineId) => {
    if (confirm("Deseja mesmo apagar este treino?")) {
      setRoutines(routines.filter(r => r.id !== routineId));
    }
  };

  const calculateMuscleFatigue = () => {
    const now = new Date().getTime();
    const muscleMap = {
      "Inferiores": { name: "Membros Inferiores / Glúteos", recoveryHours: 72, lastTrained: null },
      "Superiores": { name: "Membros Superiores / Core", recoveryHours: 48, lastTrained: null }
    };

    history.forEach(item => {
      const itemDate = new Date(item.rawDate || item.date).getTime();
      const routineName = (item.name || "").toLowerCase();
      if (routineName.includes("inferiores") || routineName.includes("glúteo") || routineName.includes("pernas") || routineName.includes("quadríceps")) {
        if (!muscleMap["Inferiores"].lastTrained || itemDate > muscleMap["Inferiores"].lastTrained) {
          muscleMap["Inferiores"].lastTrained = itemDate;
        }
      } else {
        if (!muscleMap["Superiores"].lastTrained || itemDate > muscleMap["Superiores"].lastTrained) {
          muscleMap["Superiores"].lastTrained = itemDate;
        }
      }
    });

    return Object.values(muscleMap).map(m => {
      if (!m.lastTrained) return { ...m, status: "Totalmente Recuperado 🟢", percent: 100 };
      const hoursPassed = (now - m.lastTrained) / (1000 * 60 * 60);
      if (hoursPassed >= m.recoveryHours) return { ...m, status: "Totalmente Recuperado 🟢", percent: 100 };
      const percent = Math.floor((hoursPassed / m.recoveryHours) * 100);
      return { ...m, status: `Em Recuperação (${Math.floor(m.recoveryHours - hoursPassed)}h restantes) 🟡`, percent };
    });
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col shadow-2xl relative pb-24 font-sans">
      
      <header className="px-4 py-3 bg-slate-900/90 backdrop-blur sticky top-0 z-20 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-lime-400/10 p-2 rounded-xl border border-lime-400/20">
            <Dumbbell className="text-lime-400 w-5 h-5" />
          </div>
          <h1 className="font-black text-base text-lime-400 tracking-wider">LUAN TRAINING</h1>
        </div>
        <span className="text-[10px] bg-lime-400/10 text-lime-400 border border-lime-400/20 px-2 py-1 rounded-full font-bold">Offline Pro ⚡</span>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        
        {activeTab === 'treinos' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-white">Meus Treinos</h2>
                <p className="text-xs text-slate-400">Rotinas ativas no seu plano</p>
              </div>
              <button onClick={() => setActiveTab('modelos')} className="bg-lime-400 hover:bg-lime-500 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-lime-400/10">
                <Compass className="w-4 h-4" /> Modelos Salvos
              </button>
            </div>

            {routines.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">Nenhum treino ativo. Vá na aba "Modelos Salvos"!</div>
            )}

            <div className="space-y-3 mt-4">
              {routines.map(routine => (
                <div key={routine.id} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-md space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-lime-400">{routine.name}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingRoutine(routine)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs" title="Editar">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteRoutine(routine.id)} className="p-2 bg-red-500/10 text-red-400 rounded-xl text-xs" title="Apagar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => {
                        setActiveSession(routine);
                        setCompletedSets({});
                        setSetWeights({});
                      }} className="bg-lime-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5">
                        <Play className="w-3.5 h-3.5 fill-current" /> Iniciar
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50 space-y-2">
                    {routine.exercises.map((ex, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm text-slate-300">
                        <span className="font-medium">• {ex.name}</span>
                        <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">{ex.sets}s × {ex.reps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'modelos' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-lime-400/10 p-2 rounded-xl border border-lime-400/20">
                <Compass className="text-lime-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Modelos Salvos</h2>
                <p className="text-xs text-slate-400">Biblioteca de fichas profissionais baseada nas suas imagens</p>
              </div>
            </div>

            <div className="space-y-4 mt-3">
              {SAVED_WORKOUT_TEMPLATES.map(template => (
                <div key={template.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-lime-400/10 text-lime-400 font-bold px-2 py-0.5 rounded border border-lime-400/20 uppercase">{template.category}</span>
                      <h3 className="font-bold text-base text-white mt-1.5">{template.name}</h3>
                    </div>
                    <button 
                      onClick={() => handleAdoptTemplate(template)}
                      className="bg-lime-400 hover:bg-lime-500 text-slate-950 font-black px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
                    >
                      <BookmarkCheck className="w-4 h-4" /> Usar como Treino Atual
                    </button>
                  </div>

                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 space-y-1.5 max-h-60 overflow-y-auto">
                    {template.exercises.map((ex, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-slate-300">
                        <span>• {ex.name}</span>
                        <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded">{ex.sets}s × {ex.reps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'historico' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <CalendarIcon className="text-lime-400 w-5 h-5" /> Calendário & Fadiga Muscular
            </h2>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-lime-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> Recuperação Fisiológica dos Músculos
              </h3>
              <div className="space-y-2">
                {calculateMuscleFatigue().map((m, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl space-y-1">
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>{m.name}</span>
                      <span className="text-[11px] text-slate-400">{m.status}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-lime-400 h-full transition-all duration-500" style={{ width: `${m.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mt-4">Histórico de Sessões</h3>
            {history.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">Nenhum treino concluído ainda.</div>
            ) : (
              history.map((h, i) => (
                <div key={i} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lime-400 text-sm">{h.name}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{h.date}</span>
                  </div>
                  <p className="text-xs text-slate-400">⏱️ Duração: {h.duration || "N/A"}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'progresso' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <TrendingUp className="text-lime-400 w-5 h-5" /> Recordes (PRs)
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(prs).map(([ex, val], idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-md">
                  <span className="text-xs text-slate-400 font-semibold">{ex}</span>
                  <span className="text-2xl font-black text-lime-400 mt-3">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* SESSÃO ATIVA */}
      {activeSession && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col p-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs text-lime-400 font-bold uppercase tracking-wider">Treino em Andamento</span>
              <h2 className="text-base font-black text-white">{activeSession.name}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-lime-400/10 border border-lime-400/20 px-3 py-1 rounded-xl flex items-center gap-1.5 text-lime-400 font-mono font-bold text-sm">
                <Clock className="w-4 h-4" /> {formatTime(sessionTime)}
              </div>
              <button onClick={() => setActiveSession(null)} className="p-2 bg-slate-900 rounded-xl text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isResting && (
            <div className="my-3 bg-lime-400 text-slate-950 p-3 rounded-2xl flex justify-between items-center shadow-lg animate-pulse">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-bold text-xs uppercase">Descanso:</span>
                <span className="font-mono font-black text-lg">{formatTime(restTimeLeft)}</span>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setRestTimeLeft(p => p + 15)} className="bg-slate-950 text-lime-400 font-bold px-2 py-1 rounded-lg text-xs">+15s</button>
                <button onClick={() => setIsResting(false)} className="bg-slate-950 text-white font-bold px-2 py-1 rounded-lg text-xs">Pular</button>
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto py-3 space-y-4">
            {activeSession.exercises.map((ex, exIdx) => (
              <div key={exIdx} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{ex.name}</span>
                  <span className="text-xs text-slate-400">{ex.sets}s × {ex.reps}</span>
                </div>

                <div className="space-y-1.5 mt-2">
                  {Array.from({ length: Number(ex.sets) || 3 }).map((_, setIdx) => {
                    const key = `${exIdx}-${setIdx}`;
                    const isChecked = completedSets[key];
                    const currentWeight = setWeights[key] || '';

                    return (
                      <div key={setIdx} className={`flex items-center justify-between p-2 rounded-xl border ${isChecked ? 'bg-lime-400/10 border-lime-400/30' : 'bg-slate-950 border-slate-800'}`}>
                        <span className="text-xs font-bold text-slate-400 w-16">Série {setIdx + 1}</span>
                        
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" placeholder="Peso (kg)" value={currentWeight}
                            onChange={e => setSetWeights({ ...setWeights, [key]: e.target.value })}
                            className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white text-center outline-none"
                          />
                          <button 
                            onClick={() => {
                              const nextState = !isChecked;
                              setCompletedSets({ ...completedSets, [key]: nextState });
                              if (nextState) {
                                setRestTimeLeft(defaultRestSeconds);
                                setIsResting(true);
                              }
                            }}
                            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${isChecked ? 'bg-lime-400 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> {isChecked ? 'Feito' : 'Check'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => {
              setHistory([{ 
                name: activeSession.name, 
                date: new Date().toLocaleDateString(), 
                rawDate: new Date().toISOString(),
                duration: formatTime(sessionTime) 
              }, ...history]);
              setActiveSession(null);
              setActiveTab('historico');
            }} 
            className="w-full mt-2 bg-lime-400 text-slate-950 font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Check className="w-5 h-5 stroke-[3]" /> CONCLUIR E SALVAR TREINO
          </button>
        </div>
      )}

      {/* MODAL DE EDIÇÃO */}
      {editingRoutine && (
        <div className="fixed inset-0 bg-slate-950/90 z-50 flex flex-col p-4 justify-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full mx-auto space-y-4 max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-lime-400 font-bold uppercase tracking-wider">Personalizar Ficha</span>
                <h3 className="font-black text-white text-base">{editingRoutine.name}</h3>
              </div>
              <button onClick={() => setEditingRoutine(null)} className="p-2 bg-slate-800 rounded-xl text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <p className="text-xs text-slate-400 font-semibold mb-2">Exercícios Atuais:</p>
              {editingRoutine.exercises.map((ex, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-white">{ex.name}</p>
                    <p className="text-xs text-slate-400">{ex.sets}s × {ex.reps}</p>
                  </div>
                  <button onClick={() => {
                    handleRemoveExercise(editingRoutine.id, idx);
                    setEditingRoutine({
                      ...editingRoutine,
                      exercises: editingRoutine.exercises.filter((_, i) => i !== idx)
                    });
                  }} className="text-red-400 p-1.5 bg-red-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => setEditingRoutine(null)} className="w-full bg-lime-400 text-slate-950 font-black py-3 rounded-xl text-sm">
              CONCLUIR EDIÇÃO
            </button>
          </div>
        </div>
      )}

      {/* Navegação Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/95 backdrop-blur border-t border-slate-800 p-2.5 flex justify-around items-center z-20">
        <button onClick={() => setActiveTab('treinos')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'treinos' ? 'text-lime-400' : 'text-slate-500'}`}>
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] font-bold">Treinos</span>
        </button>
        <button onClick={() => setActiveTab('modelos')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'modelos' ? 'text-lime-400' : 'text-slate-500'}`}>
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-bold">Modelos</span>
        </button>
        <button onClick={() => setActiveTab('historico')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'historico' ? 'text-lime-400' : 'text-slate-500'}`}>
          <CalendarIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold">Histórico</span>
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
