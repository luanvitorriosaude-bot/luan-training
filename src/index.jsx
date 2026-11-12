import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Play, History, TrendingUp, Dumbbell, Check, Clock, Wand2, X, Loader2, Plus, Trash2, Edit3, Calendar as CalendarIcon, Flame, Search, Compass, BookmarkCheck, Share2, Download, Palette
} from 'lucide-react';

const SAVED_WORKOUT_TEMPLATES = [
  {
    id: 'modelo-1-3dias',
    name: 'Modelo 1: Treino de 3 Dias (Inferiores & Glúteos)',
    category: 'Plano de 3 Dias[cite: 5, 6, 7]',
    days: [
      {
        name: 'Treino A - Quadríceps e Posteriores[cite: 6]',
        exercises: [
          { name: 'Agachamento (barra)', sets: 3, reps: '8 reps' },
          { name: 'Leg Press Inclinado', sets: 3, reps: '12 reps' },
          { name: 'Extensão de Pernas (máquina)', sets: 4, reps: '6-12 reps' },
          { name: 'Levantamento Terra Com Pernas Estendidas - Stiff', sets: 3, reps: '8 reps' },
          { name: 'Flexão de Pernas Deitado (máquina)', sets: 3, reps: '8 reps' },
          { name: 'Flexão de Pernas em Pé', sets: 3, reps: '8 reps' },
          { name: 'Cadeira Adutora', sets: 3, reps: '10 reps' }
        ]
      },
      {
        name: 'Treino B - Membros Superiores[cite: 5]',
        exercises: [
          { name: 'Supino Reto (máquina)', sets: 3, reps: '3 séries' },
          { name: 'Crucifixo - voador (máquina)', sets: 3, reps: '6-10 reps' },
          { name: 'Remada (máquina)', sets: 3, reps: '3 séries' },
          { name: 'Puxada (polia alta)', sets: 3, reps: '12 reps' },
          { name: 'Extensão de Tríceps - com corda (polia)', sets: 3, reps: '8 reps' },
          { name: 'Elevação Frontal (halteres)', sets: 3, reps: '3 séries' },
          { name: 'Elevação Lateral (halteres)', sets: 3, reps: '10 reps' }
        ]
      },
      {
        name: 'Treino C - Glúteos Especializado[cite: 7]',
        exercises: [
          { name: 'Levantamento Terra Sumô (barra)', sets: 3, reps: '10 reps' },
          { name: 'Elevação de Quadril (barra)', sets: 3, reps: '8 reps' },
          { name: 'Extensão de Tríceps - com corda (polia)', sets: 3, reps: '8 reps' },
          { name: 'Cadeira Abdutora', sets: 4, reps: '6-12 reps' },
          { name: 'Extensão de Quadril no Solo', sets: 3, reps: '8 reps' },
          { name: 'Extensão de Quadril (polia baixa)', sets: 3, reps: '12 reps' },
          { name: 'Abdução de Quadril (polia)', sets: 3, reps: '8 reps' }
        ]
      }
    ]
  },
  {
    id: 'modelo-2-4dias',
    name: 'Modelo 2: Treino de 4 Dias (Completo / Avançado)',
    category: 'Plano de 4 Dias[cite: 8, 9, 10, 11, 12, 13, 14]',
    days: [
      {
        name: 'Treino A - Peito, Ombros e Tríceps[cite: 12, 13]',
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
        name: 'Treino B - Costas e Bíceps[cite: 11, 14]',
        exercises: [
          { name: 'Puxada - com triângulo (polia alta)', sets: 3, reps: '3 séries' },
          { name: 'Remada (máquina)', sets: 3, reps: '3 séries' },
          { name: 'Puxada Estendida (polia)', sets: 3, reps: '3 séries' },
          { name: 'Remada (barra)', sets: 3, reps: '3 séries' },
          { name: 'Rosca Alternada (halteres)', sets: 3, reps: '3 séries' },
          { name: 'Rosca Martelo (halteres)', sets: 3, reps: '3 séries' },
          { name: 'Rosca Direta (barra W)', sets: 3, reps: '3 séries' }
        ]
      },
      {
        name: 'Treino C - Inferiores & Glúteo[cite: 9]',
        exercises: [
          { name: 'Agachamento (barra)', sets: 3, reps: '3 séries' },
          { name: 'Leg Press Inclinado', sets: 3, reps: '3 séries' },
          { name: 'Extensão de Pernas (máquina)', sets: 3, reps: '3 séries' },
          { name: 'Levantamento Terra (barra)', sets: 3, reps: '3 séries' },
          { name: 'Elevação de Quadril (máquina)', sets: 3, reps: '3 séries' },
          { name: 'Cadeira Adutora', sets: 3, reps: '3 séries' }
        ]
      },
      {
        name: 'Treino D - Peito, Crossover e Ombros[cite: 8, 10]',
        exercises: [
          { name: 'Crossover (polia)', sets: 3, reps: '3 séries' },
          { name: 'Crucifixo Baixo (polia)', sets: 3, reps: '3 séries' },
          { name: 'Supino Declinado (barra)', sets: 3, reps: '3 séries' },
          { name: 'Tríceps Coice Unilateral (halteres)', sets: 3, reps: '3 séries' },
          { name: 'Desenvolvimento de Ombros Sentado (máquina)', sets: 3, reps: '3 séries' },
          { name: 'Remada Alta (halteres)', sets: 3, reps: '3 séries' }
        ]
      }
    ]
  }
];

// Dicionário de Temas de Cores Modernos
const THEMES = {
  lime: {
    name: 'Lime ⚡',
    primary: 'text-lime-400',
    bgPrimary: 'bg-lime-400',
    bgPrimaryHover: 'hover:bg-lime-500',
    bgSoft: 'bg-lime-400/10',
    borderSoft: 'border-lime-400/30',
    accentHex: '#a3e635'
  },
  pink: {
    name: 'Pink 🌸',
    primary: 'text-pink-400',
    bgPrimary: 'bg-pink-500',
    bgPrimaryHover: 'hover:bg-pink-600',
    bgSoft: 'bg-pink-500/10',
    borderSoft: 'border-pink-500/30',
    accentHex: '#ec4899'
  },
  blue: {
    name: 'Blue 💧',
    primary: 'text-cyan-400',
    bgPrimary: 'bg-cyan-400',
    bgPrimaryHover: 'hover:bg-cyan-500',
    bgSoft: 'bg-cyan-400/10',
    borderSoft: 'border-cyan-400/30',
    accentHex: '#22d3ee'
  },
  orange: {
    name: 'Orange 🔥',
    primary: 'text-amber-400',
    bgPrimary: 'bg-amber-500',
    bgPrimaryHover: 'hover:bg-amber-600',
    bgSoft: 'bg-amber-500/10',
    borderSoft: 'border-amber-500/30',
    accentHex: '#f59e0b'
  }
};

export function App() {
  const [activeTab, setActiveTab] = useState('treinos');
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('luan_theme') || 'lime');
  const theme = THEMES[currentTheme] || THEMES.lime;
  
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('luan_training_routines');
    if (saved) return JSON.parse(saved);
    return [{
      id: '1',
      name: SAVED_WORKOUT_TEMPLATES[0].days[0].name,
      exercises: [...SAVED_WORKOUT_TEMPLATES[0].days[0].exercises]
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

  const [shareData, setShareData] = useState(null);
  const [storyMode, setStoryMode] = useState('colored');

  useEffect(() => localStorage.setItem('luan_training_routines', JSON.stringify(routines)), [routines]);
  useEffect(() => localStorage.setItem('luan_training_history', JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem('luan_training_prs', JSON.stringify(prs)), [prs]);
  useEffect(() => localStorage.setItem('luan_theme', currentTheme), [currentTheme]);

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

  const handleAdoptDayRoutine = (dayData) => {
    const newRoutine = {
      id: `${Date.now()}`,
      name: dayData.name,
      exercises: dayData.exercises.map(ex => ({ ...ex }))
    };
    setRoutines([newRoutine, ...routines]);
    setActiveTab('treinos');
    alert(`O treino "${dayData.name}" foi adicionado aos seus treinos ativos!`);
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

  const getTrainingDates = () => {
    const datesSet = new Set();
    history.forEach(h => {
      if (h.date) datesSet.add(h.date);
    });
    return Array.from(datesSet);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col shadow-2xl relative pb-24 font-sans selection:bg-slate-800">
      
      {/* HEADER SUPERIOR MODERNO COM SELETOR DE CORES */}
      <header className="px-4 py-3 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-800/80 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className={`${theme.bgSoft} p-2 rounded-2xl border ${theme.borderSoft} shadow-sm`}>
            <Dumbbell className={`${theme.primary} w-5 h-5`} />
          </div>
          <div>
            <h1 className={`font-black text-sm ${theme.primary} tracking-wider`}>LUAN TRAINING</h1>
            <p className="text-[9px] text-slate-400 font-medium">Performance Pro</p>
          </div>
        </div>

        {/* SELETOR DE TEMAS */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 p-1.5 rounded-2xl">
          <Palette className="w-3.5 h-3.5 text-slate-400 ml-1" />
          {Object.keys(THEMES).map(tKey => (
            <button
              key={tKey}
              onClick={() => setCurrentTheme(tKey)}
              className={`w-5 h-5 rounded-full transition-transform ${currentTheme === tKey ? 'scale-125 ring-2 ring-white/50' : 'opacity-60 hover:opacity-100'}`}
              style={{ backgroundColor: THEMES[tKey].accentHex }}
              title={THEMES[tKey].name}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        
        {/* ABA TREINOS */}
        {activeTab === 'treinos' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60">
              <div>
                <h2 className="text-lg font-black text-white">Meus Treinos</h2>
                <p className="text-xs text-slate-400">Rotinas ativas no seu plano</p>
              </div>
              <button 
                onClick={() => setActiveTab('modelos')} 
                className={`${theme.bgPrimary} ${theme.bgPrimaryHover} text-slate-950 text-xs font-black px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-black/20 transition-all active:scale-95`}
              >
                <Compass className="w-4 h-4" /> Modelos Salvos
              </button>
            </div>

            {routines.length === 0 && (
              <div className="text-center py-16 text-slate-500 text-sm bg-slate-900/30 rounded-2xl border border-slate-800/50 p-6">
                Nenhum treino ativo. Vá na aba "Modelos Salvos" para explorar fichas profissionais!
              </div>
            )}

            <div className="space-y-3">
              {routines.map(routine => (
                <div key={routine.id} className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3 hover:border-slate-700 transition">
                  <div className="flex justify-between items-center">
                    <h3 className={`font-black text-base ${theme.primary}`}>{routine.name}</h3>
                    <div className="flex gap-1.5">
                      <button onClick={() => setEditingRoutine(routine)} className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition" title="Editar">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteRoutine(routine.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs transition" title="Apagar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setActiveSession(routine);
                          setCompletedSets({});
                          setSetWeights({});
                        }} 
                        className={`${theme.bgPrimary} ${theme.bgPrimaryHover} text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Iniciar
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/50 space-y-2">
                    {routine.exercises.map((ex, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-slate-300 py-1 border-b border-slate-900/50 last:border-0">
                        <span className="font-medium">• {ex.name}</span>
                        <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800 font-mono">{ex.sets}s × {ex.reps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA MODELOS SALVOS */}
        {activeTab === 'modelos' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2.5 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/60">
              <div className={`${theme.bgSoft} p-2.5 rounded-xl border ${theme.borderSoft}`}>
                <Compass className={`${theme.primary} w-5 h-5`} />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Modelos Salvos</h2>
                <p className="text-xs text-slate-400">Fichas profissionais prontas a usar</p>
              </div>
            </div>

            {SAVED_WORKOUT_TEMPLATES.map(modelo => (
              <div key={modelo.id} className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-4">
                <div>
                  <span className={`text-[10px] ${theme.bgSoft} ${theme.primary} font-extrabold px-2.5 py-1 rounded-md border ${theme.borderSoft} uppercase tracking-wider`}>
                    {modelo.category}
                  </span>
                  <h3 className="font-black text-base text-white mt-2">{modelo.name}</h3>
                </div>

                <div className="space-y-3">
                  {modelo.days.map((dia, dIdx) => (
                    <div key={dIdx} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <h4 className={`font-bold text-xs ${theme.primary}`}>{dia.name}</h4>
                        <button 
                          onClick={() => handleAdoptDayRoutine(dia)}
                          className={`${theme.bgPrimary} ${theme.bgPrimaryHover} text-slate-950 font-black px-3 py-1.5 rounded-lg text-[11px] flex items-center gap-1 shadow transition active:scale-95`}
                        >
                          <BookmarkCheck className="w-3.5 h-3.5" /> Usar como Treino Atual
                        </button>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-slate-900">
                        {dia.exercises.map((ex, exIdx) => (
                          <div key={exIdx} className="flex justify-between items-center text-[11px] text-slate-300 py-0.5">
                            <span>• {ex.name}</span>
                            <span className="text-slate-400 bg-slate-900 px-2 py-0.5 rounded font-mono">{ex.sets}s × {ex.reps}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA HISTÓRICO COM CALENDÁRIO VISUAL */}
        {activeTab === 'historico' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <CalendarIcon className={`${theme.primary} w-5 h-5`} /> Calendário & Histórico
            </h2>

            {/* Calendário Visual Compacto */}
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl space-y-3 shadow-xl">
              <div className="flex justify-between items-center">
                <span className={`text-xs font-black ${theme.primary} uppercase tracking-wider`}>Dias com Treinos Registados</span>
                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{history.length} sessões</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {getTrainingDates().length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">Nenhum dia registrado no calendário ainda.</p>
                ) : (
                  getTrainingDates().map((dateStr, idx) => (
                    <div key={idx} className={`${theme.bgSoft} border ${theme.borderSoft} ${theme.primary} px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm`}>
                      <CalendarIcon className="w-3.5 h-3.5" /> {dateStr}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Painel de Fadiga Muscular */}
            <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl space-y-3 shadow-xl">
              <h3 className={`text-xs font-black ${theme.primary} uppercase tracking-wider flex items-center gap-1.5`}>
                <Flame className="w-4 h-4" /> Recuperação Fisiológica dos Músculos
              </h3>
              <div className="space-y-2">
                {calculateMuscleFatigue().map((m, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>{m.name}</span>
                      <span className="text-[11px] text-slate-400">{m.status}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className={`${theme.bgPrimary} h-full transition-all duration-500`} style={{ width: `${m.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mt-4">Lista de Sessões Realizadas</h3>
            {history.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">Nenhum treino concluído ainda.</div>
            ) : (
              history.map((h, i) => (
                <div key={i} className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl space-y-2 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className={`font-bold ${theme.primary} text-sm`}>{h.name}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{h.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>⏱️ Duração: {h.duration || "N/A"}</span>
                    <button 
                      onClick={() => {
                        setShareData(h);
                        setStoryMode('colored');
                      }}
                      className={`${theme.bgSoft} hover:opacity-80 ${theme.primary} border ${theme.borderSoft} px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95`}
                    >
                      <Share2 className="w-3.5 h-3.5" /> Story
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'progresso' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <TrendingUp className={`${theme.primary} w-5 h-5`} /> Recordes (PRs)
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(prs).map(([ex, val], idx) => (
                <div key={idx} className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between shadow-xl">
                  <span className="text-xs text-slate-400 font-semibold">{ex}</span>
                  <span className={`text-2xl font-black ${theme.primary} mt-3`}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* SESSÃO ATIVA */}
      {activeSession && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col p-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className={`text-xs ${theme.primary} font-bold uppercase tracking-wider`}>Treino em Andamento</span>
              <h2 className="text-base font-black text-white">{activeSession.name}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className={`${theme.bgSoft} border ${theme.borderSoft} px-3 py-1 rounded-xl flex items-center gap-1.5 ${theme.primary} font-mono font-bold text-sm shadow-sm`}>
                <Clock className="w-4 h-4" /> {formatTime(sessionTime)}
              </div>
              <button onClick={() => setActiveSession(null)} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isResting && (
            <div className={`my-3 ${theme.bgPrimary} text-slate-950 p-3 rounded-2xl flex justify-between items-center shadow-xl animate-pulse`}>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-bold text-xs uppercase">Descanso:</span>
                <span className="font-mono font-black text-lg">{formatTime(restTimeLeft)}</span>
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setRestTimeLeft(p => p + 15)} className="bg-slate-950 text-white font-bold px-2 py-1 rounded-lg text-xs">+15s</button>
                <button onClick={() => setIsResting(false)} className="bg-slate-950 text-white font-bold px-2 py-1 rounded-lg text-xs">Pular</button>
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {activeSession.exercises.map((ex, exIdx) => (
              <div key={exIdx} className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl space-y-2 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-sm">{ex.name}</span>
                  <span className="text-xs text-slate-400 font-mono">{ex.sets}s × {ex.reps}</span>
                </div>

                <div className="space-y-1.5 mt-2">
                  {Array.from({ length: Number(ex.sets) || 3 }).map((_, setIdx) => {
                    const key = `${exIdx}-${setIdx}`;
                    const isChecked = completedSets[key];
                    const currentWeight = setWeights[key] || '';

                    return (
                      <div key={setIdx} className={`flex items-center justify-between p-2 rounded-xl border transition ${isChecked ? `${theme.bgSoft} ${theme.borderSoft}` : 'bg-slate-950 border-slate-800/80'}`}>
                        <span className="text-xs font-bold text-slate-400 w-16">Série {setIdx + 1}</span>
                        
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" placeholder="Peso (kg)" value={currentWeight}
                            onChange={e => setSetWeights({ ...setWeights, [key]: e.target.value })}
                            className="w-20 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white text-center outline-none font-mono focus:border-slate-600"
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
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-sm ${isChecked ? `${theme.bgPrimary} text-slate-950` : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
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
              const newRecord = { 
                name: activeSession.name, 
                date: new Date().toLocaleDateString(), 
                rawDate: new Date().toISOString(),
                duration: formatTime(sessionTime) 
              };
              setHistory([newRecord, ...history]);
              setActiveSession(null);
              setShareData(newRecord);
              setStoryMode('colored');
              setActiveTab('historico');
            }} 
            className={`w-full mt-2 ${theme.bgPrimary} ${theme.bgPrimaryHover} text-slate-950 font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition`}
          >
            <Check className="w-5 h-5 stroke-[3]" /> CONCLUIR E SALVAR TREINO
          </button>
        </div>
      )}

      {/* MODAL DE COMPARTILHAMENTO DE STORY (COLORIDO / TRANSPARENTE) */}
      {shareData && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col p-4 justify-center items-center animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl flex flex-col items-center">
            
            <div className="flex justify-between items-center w-full border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <Share2 className={`${theme.primary} w-4 h-4`} /> Compartilhar Story
              </h3>
              <button onClick={() => setShareData(null)} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alternar Versão (Colorido ou Transparente) */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <button 
                onClick={() => setStoryMode('colored')}
                className={`py-2 rounded-xl text-xs font-bold transition ${storyMode === 'colored' ? `${theme.bgPrimary} text-slate-950 shadow-md` : 'bg-slate-800 text-slate-300'}`}
              >
                Versão Colorida
              </button>
              <button 
                onClick={() => setStoryMode('transparent')}
                className={`py-2 rounded-xl text-xs font-bold transition ${storyMode === 'transparent' ? `${theme.bgPrimary} text-slate-950 shadow-md` : 'bg-slate-800 text-slate-300'}`}
              >
                Transparente
              </button>
            </div>

            {/* PREVIEW DO CARD PARA STORY (FORMATO 9:16) */}
            <div className={`w-full aspect-[9/16] max-h-72 rounded-2xl p-5 flex flex-col justify-between shadow-2xl border transition-all ${
              storyMode === 'colored' 
                ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-black border-slate-700 text-white' 
                : 'bg-black/30 backdrop-blur-xl border-white/20 text-white'
            }`}>
              <div className="flex justify-between items-center">
                <span className={`text-[10px] font-black tracking-widest ${theme.primary} uppercase`}>LUAN TRAINING ⚡</span>
                <span className="text-[10px] text-slate-400">{shareData.date}</span>
              </div>

              <div className="space-y-2 text-center my-auto">
                <div className={`${theme.bgSoft} p-3 rounded-2xl border ${theme.borderSoft} inline-block mb-1 shadow-sm`}>
                  <Dumbbell className={`w-8 h-8 ${theme.primary} mx-auto`} />
                </div>
                <h4 className={`font-black text-base ${theme.primary} leading-snug`}>{shareData.name}</h4>
                <p className="text-xs text-slate-300">Treino Concluído com Sucesso! 🔥</p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex justify-around text-center">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Duração</p>
                  <p className={`text-xs font-black ${theme.primary} font-mono`}>{shareData.duration || "00:00"}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Status</p>
                  <p className={`text-xs font-black ${theme.primary}`}>100% Feito</p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              {storyMode === 'colored' ? 'Fundo estilizado moderno.' : 'Fundo translúcido ideal para sobreposição em fotos dos Stories.'}
            </p>

            <button 
              onClick={() => {
                alert("Card pronto! Tire um print ou salve a imagem para postar nos Stories.");
                setShareData(null);
              }} 
              className={`w-full ${theme.bgPrimary} ${theme.bgPrimaryHover} text-slate-950 font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition`}
            >
              <Download className="w-4 h-4" /> SALVAR / CAPTURAR CARD
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO */}
      {editingRoutine && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col p-4 justify-center animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-md w-full mx-auto space-y-4 max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className={`text-[10px] ${theme.primary} font-bold uppercase tracking-wider`}>Personalizar Ficha</span>
                <h3 className="font-black text-white text-base">{editingRoutine.name}</h3>
              </div>
              <button onClick={() => setEditingRoutine(null)} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <p className="text-xs text-slate-400 font-semibold mb-2">Exercícios Atuais:</p>
              {editingRoutine.exercises.map((ex, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm text-white">{ex.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{ex.sets}s × {ex.reps}</p>
                  </div>
                  <button onClick={() => {
                    handleRemoveExercise(editingRoutine.id, idx);
                    setEditingRoutine({
                      ...editingRoutine,
                      exercises: editingRoutine.exercises.filter((_, i) => i !== idx)
                    });
                  }} className="text-red-400 p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => setEditingRoutine(null)} className={`w-full ${theme.bgPrimary} ${theme.bgPrimaryHover} text-slate-950 font-black py-3 rounded-xl text-sm shadow-lg`}>
              CONCLUIR EDIÇÃO
            </button>
          </div>
        </div>
      )}

      {/* Navegação Inferior Moderna */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 p-2.5 flex justify-around items-center z-30">
        <button onClick={() => setActiveTab('treinos')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'treinos' ? `${theme.primary}` : 'text-slate-500 hover:text-slate-300'}`}>
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] font-bold">Treinos</span>
        </button>
        <button onClick={() => setActiveTab('modelos')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'modelos' ? `${theme.primary}` : 'text-slate-500 hover:text-slate-300'}`}>
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-bold">Modelos</span>
        </button>
        <button onClick={() => setActiveTab('historico')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'historico' ? `${theme.primary}` : 'text-slate-500 hover:text-slate-300'}`}>
          <CalendarIcon className="w-5 h-5" />
          <span className="text-[10px] font-bold">Histórico</span>
        </button>
        <button onClick={() => setActiveTab('progresso')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'progresso' ? `${theme.primary}` : 'text-slate-500 hover:text-slate-300'}`}>
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-bold">PRs</span>
        </button>
      </nav>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
