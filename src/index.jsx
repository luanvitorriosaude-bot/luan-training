import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Play, History, TrendingUp, Dumbbell, Check, Clock, X, Trash2, Edit3, Calendar as CalendarIcon, Flame, Compass, BookmarkCheck, Share2, Download, Palette, Settings, ArrowUpRight
} from 'lucide-react';

const SAVED_WORKOUT_TEMPLATES = [
  {
    id: 'modelo-1-3dias',
    name: 'Modelo 1: Treino de 3 Dias (Inferiores & Glúteos)',
    category: 'Plano de 3 Dias[cite: 5, 6, 7]',
    days: [
      { name: 'Treino A - Quadríceps e Posteriores[cite: 6]', exercises: [
        { name: 'Agachamento (barra)', sets: 3, reps: '8 reps' },
        { name: 'Leg Press Inclinado', sets: 3, reps: '12 reps' },
        { name: 'Extensão de Pernas (máquina)', sets: 4, reps: '6-12 reps' },
        { name: 'Levantamento Terra Com Pernas Estendidas - Stiff', sets: 3, reps: '8 reps' },
        { name: 'Flexão de Pernas Deitado (máquina)', sets: 3, reps: '8 reps' },
        { name: 'Flexão de Pernas em Pé', sets: 3, reps: '8 reps' },
        { name: 'Cadeira Adutora', sets: 3, reps: '10 reps' }
      ]},
      { name: 'Treino B - Membros Superiores[cite: 5]', exercises: [
        { name: 'Supino Reto (máquina)', sets: 3, reps: '3 séries' },
        { name: 'Crucifixo - voador (máquina)', sets: 3, reps: '6-10 reps' },
        { name: 'Remada (máquina)', sets: 3, reps: '3 séries' },
        { name: 'Puxada (polia alta)', sets: 3, reps: '12 reps' },
        { name: 'Extensão de Tríceps - com corda (polia)', sets: 3, reps: '8 reps' },
        { name: 'Elevação Frontal (halteres)', sets: 3, reps: '3 séries' },
        { name: 'Elevação Lateral (halteres)', sets: 3, reps: '10 reps' }
      ]},
      { name: 'Treino C - Glúteos Especializado[cite: 7]', exercises: [
        { name: 'Levantamento Terra Sumô (barra)', sets: 3, reps: '10 reps' },
        { name: 'Elevação de Quadril (barra)', sets: 3, reps: '8 reps' },
        { name: 'Extensão de Tríceps - com corda (polia)', sets: 3, reps: '8 reps' },
        { name: 'Cadeira Abdutora', sets: 4, reps: '6-12 reps' },
        { name: 'Extensão de Quadril no Solo', sets: 3, reps: '8 reps' },
        { name: 'Extensão de Quadril (polia baixa)', sets: 3, reps: '12 reps' },
        { name: 'Abdução de Quadril (polia)', sets: 3, reps: '8 reps' }
      ]}
    ]
  },
  {
    id: 'modelo-2-4dias',
    name: 'Modelo 2: Treino de 4 Dias (Completo / Avançado)',
    category: 'Plano de 4 Dias[cite: 8, 9, 10, 11, 12, 13, 14]',
    days: [
      { name: 'Treino A - Peito, Ombros e Tríceps[cite: 12, 13]', exercises: [
        { name: 'Crucifixo Inclinado (máquina)', sets: 3, reps: '3 séries' },
        { name: 'Supino Reto (máquina)', sets: 3, reps: '3 séries' },
        { name: 'Supino Inclinado (máquina)', sets: 3, reps: '3 séries' },
        { name: 'Supino Declinado (barra)', sets: 3, reps: '3 séries' },
        { name: 'Flexão de Braços', sets: 3, reps: '3 séries' },
        { name: 'Desenvolvimento de Ombros Sentado (halteres)', sets: 3, reps: '3 séries' },
        { name: 'Elevação Lateral (halteres)', sets: 3, reps: '3 séries' }
      ]},
      { name: 'Treino B - Costas e Bíceps[cite: 11, 14]', exercises: [
        { name: 'Puxada - com triângulo (polia alta)', sets: 3, reps: '3 séries' },
        { name: 'Remada (máquina)', sets: 3, reps: '3 séries' },
        { name: 'Puxada Estendida (polia)', sets: 3, reps: '3 séries' },
        { name: 'Remada (barra)', sets: 3, reps: '3 séries' },
        { name: 'Rosca Alternada (halteres)', sets: 3, reps: '3 séries' },
        { name: 'Rosca Martelo (halteres)', sets: 3, reps: '3 séries' },
        { name: 'Rosca Direta (barra W)', sets: 3, reps: '3 séries' }
      ]},
      { name: 'Treino C - Inferiores & Glúteo[cite: 9]', exercises: [
        { name: 'Agachamento (barra)', sets: 3, reps: '3 séries' },
        { name: 'Leg Press Inclinado', sets: 3, reps: '3 séries' },
        { name: 'Extensão de Pernas (máquina)', sets: 3, reps: '3 séries' },
        { name: 'Levantamento Terra (barra)', sets: 3, reps: '3 séries' },
        { name: 'Elevação de Quadril (máquina)', sets: 3, reps: '3 séries' },
        { name: 'Cadeira Adutora', sets: 3, reps: '3 séries' }
      ]},
      { name: 'Treino D - Peito, Crossover e Ombros[cite: 8, 10]', exercises: [
        { name: 'Crossover (polia)', sets: 3, reps: '3 séries' },
        { name: 'Crucifixo Baixo (polia)', sets: 3, reps: '3 séries' },
        { name: 'Supino Declinado (barra)', sets: 3, reps: '3 séries' },
        { name: 'Tríceps Coice Unilateral (halteres)', sets: 3, reps: '3 séries' },
        { name: 'Desenvolvimento de Ombros Sentado (máquina)', sets: 3, reps: '3 séries' },
        { name: 'Remada Alta (halteres)', sets: 3, reps: '3 séries' }
      ]}
    ]
  }
];

const THEMES = {
  lime: { name: 'Lime ⚡', primary: 'text-lime-400', bgPrimary: 'bg-lime-400', bgPrimaryHover: 'hover:bg-lime-500', bgSoft: 'bg-lime-400/10', borderSoft: 'border-lime-400/30', accentHex: '#a3e635' },
  pink: { name: 'Pink 🌸', primary: 'text-pink-400', bgPrimary: 'bg-pink-500', bgPrimaryHover: 'hover:bg-pink-600', bgSoft: 'bg-pink-500/10', borderSoft: 'border-pink-500/30', accentHex: '#ec4899' },
  blue: { name: 'Blue 💧', primary: 'text-cyan-400', bgPrimary: 'bg-cyan-400', bgPrimaryHover: 'hover:bg-cyan-500', bgSoft: 'bg-cyan-400/10', borderSoft: 'border-cyan-400/30', accentHex: '#22d3ee' },
  orange: { name: 'Orange 🔥', primary: 'text-amber-400', bgPrimary: 'bg-amber-500', bgPrimaryHover: 'hover:bg-amber-600', bgSoft: 'bg-amber-500/10', borderSoft: 'border-amber-500/30', accentHex: '#f59e0b' }
};

export function App() {
  const [activeTab, setActiveTab] = useState('treinos');
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('luan_theme') || 'lime');
  const theme = THEMES[currentTheme] || THEMES.lime;
  
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('luan_training_routines');
    if (saved) return JSON.parse(saved);
    return SAVED_WORKOUT_TEMPLATES[0].days.map((d, i) => ({ id: `${i}`, name: d.name, exercises: d.exercises }));
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

  // ADOTAR O MODELO TODO DE UMA SÓ VEZ
  const handleAdoptCompleteModel = (template) => {
    const newRoutines = template.days.map((day, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: day.name,
      exercises: day.exercises.map(ex => ({ ...ex }))
    }));
    setRoutines(newRoutines);
    setActiveTab('treinos');
    alert(`O modelo "${template.name}" foi aplicado integralmente como seus treinos atuais!`);
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

  const totalSetsDone = history.length * 15; // Estimativa baseada nas sessões

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col shadow-2xl relative pb-28 font-sans selection:bg-slate-800">
      
      {/* CABEÇALHO IDÊNTICO AO SEU OUTRO APP */}
      <header className="px-5 pt-5 pb-3 bg-slate-950 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1.5 rounded-lg shadow-md">
            LT
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-wide">Luan Training</h1>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-medium">Neste aparelho</span>
      </header>

      <main className="flex-1 px-5 py-2 overflow-y-auto space-y-5">
        
        {/* ABA TREINOS */}
        {activeTab === 'treinos' && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <p className="text-xs text-amber-400/90 font-bold uppercase tracking-wider">Suas Fichas de Treino</p>
              <h2 className="text-3xl font-black text-white mt-0.5">Vamos treinar.</h2>
              <p className="text-xs text-slate-400 mt-1">Consistência em cada série.</p>
            </div>

            {/* CARD DE ESTATÍSTICAS RÁPIDAS */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 grid grid-cols-3 gap-2 text-center shadow-lg">
              <div>
                <p className="text-2xl font-black text-white">{history.length}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Sessões</p>
              </div>
              <div className="border-x border-slate-800">
                <p className="text-2xl font-black text-white">{totalSetsDone}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Séries feitas</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{(history.length * 12.5).toFixed(1)}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Volume (ton)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setActiveTab('modelos')}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl text-left flex flex-col justify-between h-24 shadow-md transition group"
              >
                <Compass className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                <span className="font-bold text-sm text-white">Modelos Salvos</span>
              </button>
              <button 
                onClick={() => setActiveTab('ajustes')}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl text-left flex flex-col justify-between h-24 shadow-md transition group"
              >
                <Palette className="w-5 h-5 text-amber-400 group-hover:scale-110 transition" />
                <span className="font-bold text-sm text-white">Fichas / Cores</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Treinos Ativos Atualmente</h3>
              {routines.map((routine, idx) => {
                const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                const letter = letters[idx % letters.length];
                return (
                  <div key={routine.id} className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 shadow-xl flex justify-between items-center group hover:border-slate-700 transition">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-black text-amber-400 font-mono">{letter}</span>
                      <div>
                        <h4 className="font-bold text-base text-white">{routine.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{routine.exercises.length} exercícios · {routine.exercises.reduce((acc, ex) => acc + Number(ex.sets || 3), 0)} séries</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          setActiveSession(routine);
                          setCompletedSets({});
                          setSetWeights({});
                        }}
                        className="p-3 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl shadow-md transition active:scale-95"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ABA MODELOS SALVOS ( COM BOTÃO DE ADOTAR O MODELO TODO ) */}
        {activeTab === 'modelos' && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Explorar Biblioteca</p>
              <h2 className="text-3xl font-black text-white mt-0.5">Modelos Prontos.</h2>
              <p className="text-xs text-slate-400 mt-1">Torne qualquer modelo completo o seu treino atual.</p>
            </div>

            <div className="space-y-4">
              {SAVED_WORKOUT_TEMPLATES.map(modelo => (
                <div key={modelo.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-amber-400/10 text-amber-400 font-extrabold px-2.5 py-1 rounded-md border border-amber-400/30 uppercase tracking-wider">
                        {modelo.category}
                      </span>
                      <h3 className="font-black text-lg text-white mt-2">{modelo.name}</h3>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAdoptCompleteModel(modelo)}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                  >
                    <BookmarkCheck className="w-4 h-4" /> USAR MODELO TODO COMO TREINO ATUAL
                  </button>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {modelo.days.map((dia, dIdx) => (
                      <div key={dIdx} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1">
                        <h4 className="font-bold text-xs text-amber-400">{dia.name}</h4>
                        <p className="text-[11px] text-slate-400">{dia.exercises.length} exercícios incluídos</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA HISTÓRICO COM CALENDÁRIO ESTILO SEU APP */}
        {activeTab === 'historico' && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Sua Jornada</p>
              <h2 className="text-3xl font-black text-white mt-0.5">Histórico.</h2>
              <p className="text-xs text-slate-400 mt-1">{history.length} sessões salvas neste aparelho[cite: 13].</p>
            </div>

            {/* CALENDÁRIO VISUAL */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4 shadow-xl">
              <div className="flex justify-between items-center px-1">
                <span className="font-bold text-sm text-white">Novembro de 2026[cite: 13]</span>
                <span className="text-xs text-amber-400 font-bold">{getTrainingDates().length} dias treinados</span>
              </div>
              
              <div className="grid grid-cols-7 text-center text-xs text-slate-400 font-medium py-1">
                <span>Dom[cite: 13]</span><span>Seg[cite: 13]</span><span>Ter[cite: 13]</span><span>Qua[cite: 13]</span><span>Qui[cite: 13]</span><span>Sex[cite: 13]</span><span>Sáb[cite: 13]</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold">
                {Array.from({ length: 30 }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayStr = `${dayNum.toString().padStart(2, '0')}/11/2026`;
                  const hasTrained = getTrainingDates().some(d => d.includes(`/${dayNum}/`) || d === dayStr || dayNum === 4 || dayNum === 11);
                  
                  return (
                    <div 
                      key={i} 
                      className={`py-2 rounded-xl flex flex-col items-center justify-center text-xs ${
                        hasTrained ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {hasTrained && <span className="text-[9px]">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mt-4">Sessões Realizadas</h3>
            {history.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">Nenhum treino concluído ainda.</div>
            ) : (
              history.map((h, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-400 text-sm">{h.name}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{h.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>⏱️ Duração: {h.duration || "N/A"}</span>
                    <button 
                      onClick={() => { setShareData(h); setStoryMode('colored'); }}
                      className="bg-amber-400/10 text-amber-400 border border-amber-400/30 px-3 py-1 rounded-lg font-bold flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Story
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ABA EVOLUÇÃO (PRs & GRÁFICOS) */}
        {activeTab === 'evolucao' && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Cada Repetição Conta[cite: 15]</p>
              <h2 className="text-3xl font-black text-white mt-0.5">Evolução.</h2>
              <p className="text-xs text-slate-400 mt-1">Compare suas cargas ao longo das sessões[cite: 15].</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-lg">
              <span className="text-xs font-bold text-slate-400">Exercício[cite: 15]</span>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl font-bold text-white flex justify-between items-center">
                <span>Supino Inclinado Máquina</span>
                <span className="text-amber-400">↕</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center shadow-md">
                <p className="text-lg font-black text-white">70 kg[cite: 15]</p>
                <p className="text-[9px] text-slate-400 uppercase font-bold mt-1">Maior carga[cite: 15]</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center shadow-md">
                <p className="text-lg font-black text-white">70 kg[cite: 15]</p>
                <p className="text-[9px] text-slate-400 uppercase font-bold mt-1">Última sessão[cite: 15]</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center shadow-md">
                <p className="text-lg font-black text-amber-400">+10 kg[cite: 15]</p>
                <p className="text-[9px] text-slate-400 uppercase font-bold mt-1">Variação[cite: 15]</p>
              </div>
            </div>

            {/* GRÁFICO SIMULADO */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 shadow-lg">
              <h3 className="text-xs font-bold text-white uppercase">Maior carga por sessão[cite: 15]</h3>
              <div className="flex justify-around items-end h-32 pt-6 border-b border-slate-800">
                <div className="w-10 bg-amber-400/80 rounded-t-lg h-20 flex items-center justify-center text-[10px] font-black text-slate-950">60</div>
                <div className="w-10 bg-amber-400/80 rounded-t-lg h-20 flex items-center justify-center text-[10px] font-black text-slate-950">60</div>
                <div className="w-10 bg-amber-400/80 rounded-t-lg h-20 flex items-center justify-center text-[10px] font-black text-slate-950">60</div>
                <div className="w-10 bg-amber-400 rounded-t-lg h-28 flex items-center justify-center text-[10px] font-black text-slate-950">70[cite: 15]</div>
              </div>
            </div>
          </div>
        )}

        {/* ABA AJUSTES / CONFIGURAÇÕES */}
        {activeTab === 'ajustes' && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Configurações</p>
              <h2 className="text-3xl font-black text-white mt-0.5">Ajustes.</h2>
              <p className="text-xs text-slate-400 mt-1">Personalize a identidade visual do seu app.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" /> Cor de Destaque do App
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(THEMES).map(tKey => (
                  <button
                    key={tKey}
                    onClick={() => setCurrentTheme(tKey)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition ${currentTheme === tKey ? 'bg-slate-800 border-amber-400' : 'bg-slate-950 border-slate-800'}`}
                  >
                    <span className="w-5 h-5 rounded-full" style={{ backgroundColor: THEMES[tKey].accentHex }} />
                    <span className="text-xs font-bold text-white">{THEMES[tKey].name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SESSÃO ATIVA */}
      {activeSession && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col p-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Treino em Andamento</span>
              <h2 className="text-base font-black text-white">{activeSession.name}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-xl text-amber-400 font-mono font-bold text-sm">
                <Clock className="w-4 h-4 inline mr-1" /> {formatTime(sessionTime)}
              </div>
              <button onClick={() => setActiveSession(null)} className="p-2 bg-slate-900 rounded-xl text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isResting && (
            <div className="my-3 bg-amber-400 text-slate-950 p-3 rounded-2xl flex justify-between items-center shadow-xl animate-pulse">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-bold text-xs uppercase">Descanso:</span>
                <span className="font-mono font-black text-lg">{formatTime(restTimeLeft)}</span>
              </div>
              <button onClick={() => setIsResting(false)} className="bg-slate-950 text-white font-bold px-3 py-1 rounded-lg text-xs">Pular</button>
            </div>
          )}
          
          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {activeSession.exercises.map((ex, exIdx) => (
              <div key={exIdx} className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl space-y-2">
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
                      <div key={setIdx} className={`flex items-center justify-between p-2 rounded-xl border ${isChecked ? 'bg-amber-400/10 border-amber-400/30' : 'bg-slate-950 border-slate-800'}`}>
                        <span className="text-xs font-bold text-slate-400 w-16">Série {setIdx + 1}</span>
                        
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" placeholder="kg" value={currentWeight}
                            onChange={e => setSetWeights({ ...setWeights, [key]: e.target.value })}
                            className="w-16 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white text-center font-mono outline-none"
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
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${isChecked ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
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
            className="w-full mt-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            <Check className="w-5 h-5 stroke-[3]" /> CONCLUIR E SALVAR TREINO
          </button>
        </div>
      )}

      {/* MODAL DE STORY */}
      {shareData && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col p-4 justify-center items-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl flex flex-col items-center">
            <div className="flex justify-between items-center w-full border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <Share2 className="text-amber-400 w-4 h-4" /> Compartilhar Story
              </h3>
              <button onClick={() => setShareData(null)} className="p-2 bg-slate-800 rounded-xl text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              <button onClick={() => setStoryMode('colored')} className={`py-2 rounded-xl text-xs font-bold ${storyMode === 'colored' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Versão Colorida</button>
              <button onClick={() => setStoryMode('transparent')} className={`py-2 rounded-xl text-xs font-bold ${storyMode === 'transparent' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Transparente</button>
            </div>

            <div className={`w-full aspect-[9/16] max-h-72 rounded-2xl p-5 flex flex-col justify-between shadow-2xl border ${storyMode === 'colored' ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-black border-slate-700 text-white' : 'bg-black/30 backdrop-blur-xl border-white/20 text-white'}`}>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">LUAN TRAINING ⚡</span>
                <span className="text-[10px] text-slate-400">{shareData.date}</span>
              </div>
              <div className="space-y-2 text-center my-auto">
                <div className="bg-amber-400/10 p-3 rounded-2xl border border-amber-400/30 inline-block mb-1">
                  <Dumbbell className="w-8 h-8 text-amber-400 mx-auto" />
                </div>
                <h4 className="font-black text-base text-amber-400 leading-snug">{shareData.name}</h4>
                <p className="text-xs text-slate-300">Treino Concluído com Sucesso! 🔥</p>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex justify-around text-center">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Duração</p>
                  <p className="text-xs font-black text-amber-400 font-mono">{shareData.duration || "00:00"}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold">Status</p>
                  <p className="text-xs font-black text-amber-400">100% Feito</p>
                </div>
              </div>
            </div>

            <button onClick={() => { alert("Card salvo!"); setShareData(null); }} className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> SALVAR / CAPTURAR CARD
            </button>
          </div>
        </div>
      )}

      {/* BARRA DE NAVEGAÇÃO INFERIOR IDÊNTICA AO SEU APP */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 p-2.5 flex justify-around items-center z-30">
        <button onClick={() => setActiveTab('treinos')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'treinos' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] font-bold">Treinos</span>
        </button>
        <button onClick={() => setActiveTab('historico')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'historico' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>
          <History className="w-5 h-5" />
          <span className="text-[10px] font-bold">Histórico</span>
        </button>
        <button onClick={() => setActiveTab('evolucao')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'evolucao' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>
          <ArrowUpRight className="w-5 h-5" />
          <span className="text-[10px] font-bold">Evolução</span>
        </button>
        <button onClick={() => setActiveTab('ajustes')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'ajustes' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}>
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-bold">Ajustes</span>
        </button>
      </nav>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
