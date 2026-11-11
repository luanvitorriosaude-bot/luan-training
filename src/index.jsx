import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Play, History, TrendingUp, Dumbbell, Check, Clock, Wand2, X, Loader2, Plus, Trash2, Edit3, Calendar as CalendarIcon, RotateCcw, Flame
} from 'lucide-react';

const WORKOUT_DATABASE = {
  Feminino: {
    Hipertrofia: [
      { name: "Inferiores A1: Foco Quadríceps & Glúteo", exercises: [{ name: "Agachamento Livre com Barra", sets: 4, reps: "8-10" }, { name: "Leg Press 45º (Pés Baixos)", sets: 4, reps: "10-12" }, { name: "Cadeira Extensora", sets: 3, reps: "12-15" }, { name: "Afundo com Halteres", sets: 3, reps: "10 por perna" }, { name: "Panturrilhas em Pé", sets: 4, reps: "20" }] },
      { name: "Inferiores B1: Foco Posterior & Glúteo Máximo", exercises: [{ name: "Elevação Pélvica com Barra", sets: 4, reps: "10-12" }, { name: "Stiff com Halteres", sets: 4, reps: "10-12" }, { name: "Mesa Flexora", sets: 3, reps: "12" }, { name: "Glúteo Coice na Polia", sets: 4, reps: "15" }, { name: "Cadeira Abdutora", sets: 4, reps: "15" }] },
      { name: "Inferiores C1: Unilateral & Búlgaro", exercises: [{ name: "Agachamento Búlgaro", sets: 4, reps: "10 por perna" }, { name: "Levantamento Terra Romeno", sets: 4, reps: "10" }, { name: "Leg Press Unilateral", sets: 3, reps: "12" }, { name: "Cadeira Extensora (Drop-set)", sets: 3, reps: "10" }, { name: "Elevação Pélvica Unilateral", sets: 3, reps: "12" }] },
      { name: "Inferiores D1: Volume Extremo de Glúteos", exercises: [{ name: "Sumô com Barra ou Halter", sets: 4, reps: "10-12" }, { name: "Elevação Pélvica (Pausa 2s no topo)", sets: 4, reps: "10" }, { name: "Cadeira Abdutora (Tronco Inclinado)", sets: 4, reps: "15" }, { name: "Extensão de Quadril no Solo", sets: 3, reps: "20" }, { name: "Panturrilhas Sentado", sets: 4, reps: "15" }] },
      { name: "Superiores A: Costas e Ombros", exercises: [{ name: "Puxada Alta na Polia", sets: 3, reps: "12" }, { name: "Remada Baixa", sets: 3, reps: "12" }, { name: "Desenvolvimento com Halteres", sets: 3, reps: "12" }, { name: "Elevação Lateral", sets: 3, reps: "15" }] }
    ],
    "Emagrecimento / Definição": [
      { name: "Full Body Definição A (HIIT Pernas)", exercises: [{ name: "Agachamento com Salto", sets: 4, reps: "15" }, { name: "Stiff com Halteres Leves", sets: 4, reps: "15" }, { name: "Afundo Dinâmico", sets: 3, reps: "12 por perna" }, { name: "Polichinelo", sets: 3, reps: "1 min" }] },
      { name: "Full Body Definição B (Resistência Glúteo)", exercises: [{ name: "Elevação Pélvica Rápida", sets: 4, reps: "20" }, { name: "Cadeira Extensora", sets: 3, reps: "15" }, { name: "Cadeira Flexora", sets: 3, reps: "15" }, { name: "Bicicleta no Solo", sets: 3, reps: "25" }] }
    ],
    "Força Pura": [
      { name: "Power Inferiores Pesado A", exercises: [{ name: "Agachamento Livre com Carga", sets: 5, reps: "5" }, { name: "Elevação Pélvica Pesada", sets: 5, reps: "6" }, { name: "Leg Press Pesado", sets: 4, reps: "6-8" }] }
    ]
  },
  Masculino: {
    Hipertrofia: [
      { name: "Treino A1: Peito, Tríceps e Ombro", exercises: [{ name: "Supino Reto com Barra", sets: 4, reps: "8-10" }, { name: "Supino Inclinado com Halteres", sets: 4, reps: "10" }, { name: "Crucifixo na Polia", sets: 3, reps: "12" }, { name: "Desenvolvimento Militar", sets: 3, reps: "10" }, { name: "Tríceps Corda", sets: 3, reps: "15" }] },
      { name: "Treino B1: Costas, Bíceps e Antebraço", exercises: [{ name: "Puxada Alta Frontal", sets: 4, reps: "10" }, { name: "Remada Curvada com Barra", sets: 4, reps: "8-10" }, { name: "Remada Baixa na Polia", sets: 3, reps: "12" }, { name: "Rosca Direta com Barra", sets: 3, reps: "10" }, { name: "Rosca Martelo", sets: 3, reps: "12" }] },
      { name: "Treino C1: Membros Inferiores Completo", exercises: [{ name: "Agachamento Livre", sets: 4, reps: "8-10" }, { name: "Leg Press 45º", sets: 4, reps: "10" }, { name: "Cadeira Extensora", sets: 3, reps: "12" }, { name: "Mesa Flexora", sets: 3, reps: "12" }, { name: "Panturrilhas em Pé", sets: 4, reps: "15" }] },
      { name: "Treino D1: Ombros, Trapézio e Abdômen", exercises: [{ name: "Desenvolvimento com Halteres", sets: 4, reps: "10" }, { name: "Elevação Lateral com Halteres", sets: 4, reps: "12-15" }, { name: "Abdominal Infra na Paralela", sets: 3, reps: "15" }] }
    ],
    "Emagrecimento / Definição": [
      { name: "Upper Body Definição A", exercises: [{ name: "Supino Reto com Halteres", sets: 4, reps: "12" }, { name: "Remada Baixa", sets: 4, reps: "12" }, { name: "Burpees", sets: 3, reps: "10" }] },
      { name: "Lower Body Definição B", exercises: [{ name: "Leg Press 45º", sets: 4, reps: "15" }, { name: "Cadeira Flexora", sets: 4, reps: "15" }, { name: "Prancha Abdominal", sets: 3, reps: "50 seg" }] }
    ],
    "Força Pura": [
      { name: "Powerbuilding A (Força Máxima)", exercises: [{ name: "Supino Reto Pesado", sets: 5, reps: "3-5" }, { name: "Agachamento Livre Pesado", sets: 5, reps: "3-5" }, { name: "Levantamento Terra", sets: 3, reps: "3" }] }
    ]
  }
};

export function App() {
  const [activeTab, setActiveTab] = useState('treinos');
  
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('luan_training_routines');
    if (saved) return JSON.parse(saved);
    return [{
      id: '1',
      name: 'Treino Inicial',
      exercises: [{ name: 'Agachamento Livre', sets: 4, reps: '10-12' }]
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

  // Estados do Motor Inteligente
  const [age, setAge] = useState('25');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');
  const [gender, setGender] = useState('Feminino');
  const [daysPerWeek, setDaysPerWeek] = useState('4');
  const [goal, setGoal] = useState('Hipertrofia (Ganho de Massa)');
  const [generating, setGenerating] = useState(false);

  // Estados de Edição e Sessão Ativa
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState(4);
  const [newExReps, setNewExReps] = useState('10-12');

  const [activeSession, setActiveSession] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [completedSets, setCompletedSets] = useState({}); // { "exIdx-setIdx": true }
  const [setWeights, setSetWeights] = useState({});       // { "exIdx-setIdx": "75kg" }

  // Timers de Descanso
  const [restTimeLeft, setRestTimeLeft] = useState(null);
  const [isResting, setIsResting] = useState(false);
  const [defaultRestSeconds, setDefaultRestSeconds] = useState(60);

  useEffect(() => localStorage.setItem('luan_training_routines', JSON.stringify(routines)), [routines]);
  useEffect(() => localStorage.setItem('luan_training_history', JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem('luan_training_prs', JSON.stringify(prs)), [prs]);

  // Cronômetro total do treino
  useEffect(() => {
    let timer;
    if (activeSession) {
      timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    } else {
      setSessionTime(0);
    }
    return () => clearInterval(timer);
  }, [activeSession]);

  // Contagem decrescente do descanso
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

  const handleSmartGenerateWorkout = () => {
    if (!age || !weight || !height || !gender) return alert("Preencha todos os campos do perfil!");
    setGenerating(true);

    setTimeout(() => {
      let targetGoal = "Hipertrofia";
      if (goal.includes("Emagrecimento")) targetGoal = "Emagrecimento / Definição";
      if (goal.includes("Força")) targetGoal = "Força Pura";

      const categoryPool = WORKOUT_DATABASE[gender]?.[targetGoal] || WORKOUT_DATABASE["Masculino"]["Hipertrofia"];
      const qtyToSelect = Math.min(parseInt(daysPerWeek) || 3, categoryPool.length);
      
      const generatedRoutines = [];
      for (let i = 0; i < qtyToSelect; i++) {
        const baseRoutine = categoryPool[i % categoryPool.length];
        generatedRoutines.push({
          id: `${Date.now()}-${i}`,
          name: baseRoutine.name,
          exercises: [...baseRoutine.exercises]
        });
      }

      setRoutines([...generatedRoutines, ...routines]);
      setActiveTab('treinos');
      setGenerating(false);
      alert(`Criador Pro gerou ${generatedRoutines.length} fichas com sucesso!`);
    }, 400);
  };

  const handleAddExerciseToRoutine = (routineId) => {
    if (!newExName) return alert("Digite o nome do exercício!");
    setRoutines(routines.map(r => {
      if (r.id === routineId) {
        return { ...r, exercises: [...r.exercises, { name: newExName, sets: Number(newExSets), reps: newExReps }] };
      }
      return r;
    }));
    setNewExName('');
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

  // Cálculo de fadiga muscular com base no histórico e 48h/72h de recuperação
  const calculateMuscleFatigue = () => {
    const now = new Date().getTime();
    const muscleMap = {
      "Inferiores": { name: "Membros Inferiores / Glúteos", recoveryHours: 72, lastTrained: null },
      "Superiores": { name: "Membros Superiores / Core", recoveryHours: 48, lastTrained: null }
    };

    history.forEach(item => {
      const itemDate = new Date(item.rawDate || item.date).getTime();
      const routineName = (item.name || "").toLowerCase();
      if (routineName.includes("inferiores") || routineName.includes("glúteo") || routineName.includes("pernas")) {
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
        
        {/* ABA TREINOS */}
        {activeTab === 'treinos' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-white">Meus Treinos</h2>
                <p className="text-xs text-slate-400">Escolha sua rotina para iniciar com timer</p>
              </div>
              <button onClick={() => setActiveTab('gerador')} className="bg-lime-400 hover:bg-lime-500 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-lime-400/10">
                <Wand2 className="w-4 h-4" /> Criador Pro
              </button>
            </div>

            {routines.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">Nenhum treino salvo. Use o Criador Pro!</div>
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
                        <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">{ex.sets}x{ex.reps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA GERADOR */}
        {activeTab === 'gerador' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-lime-400/10 p-2 rounded-xl border border-lime-400/20">
                <Wand2 className="text-lime-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Criador Profissional</h2>
                <p className="text-xs text-slate-400">Gere fichas baseadas em modelos avançados</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Idade</label>
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Peso (kg)</label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Altura (cm)</label>
                  <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Sexo</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none">
                    <option value="Feminino">Feminino (Foco Inferiores)</option>
                    <option value="Masculino">Masculino (Padrão Equilibrado)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Dias/Semana</label>
                  <input type="number" value={daysPerWeek} onChange={e => setDaysPerWeek(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase">Objetivo Principal</label>
                <select value={goal} onChange={e => setGoal(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none">
                  <option>Hipertrofia (Ganho de Massa)</option>
                  <option>Emagrecimento / Definição</option>
                  <option>Força Pura</option>
                </select>
              </div>
              
              <button 
                onClick={handleSmartGenerateWorkout} disabled={generating}
                className="w-full mt-3 bg-lime-400 hover:bg-lime-500 text-slate-950 font-black py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg text-sm"
              >
                {generating ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                {generating ? 'GERANDO...' : 'GERAR MEU TREINO PRO'}
              </button>
            </div>
          </div>
        )}

        {/* ABA HISTÓRICO COM CALENDÁRIO E FADIGA */}
        {activeTab === 'historico' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <CalendarIcon className="text-lime-400 w-5 h-5" /> Calendário & Fadiga Muscular
            </h2>

            {/* Painel de Status de Fadiga */}
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

        {/* ABA PROGRESSO */}
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

      {/* SESSÃO ATIVA (COM TIMER TOTAL, TIMER DE DESCANSO E CHECK POR SÉRIE) */}
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

          {/* TIMER DE DESCANSO FLUTUANTE */}
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
                  <span className="text-xs text-slate-400">{ex.sets} séries × {ex.reps}</span>
                </div>

                {/* SÉRIES INDIVIDUAIS COM CHECK E PESO */}
                <div className="space-y-1.5 mt-2">
                  {Array.from({ length: Number(ex.sets) || 4 }).map((_, setIdx) => {
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
                    <p className="text-xs text-slate-400">{ex.sets} séries × {ex.reps}</p>
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

            <div className="border-t border-slate-800 pt-3 space-y-2">
              <p className="text-xs text-lime-400 font-bold">Adicionar Novo Exercício:</p>
              <input 
                type="text" placeholder="Nome do exercício" 
                value={newExName} onChange={e => setNewExName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold">Séries</label>
                  <input type="number" value={newExSets} onChange={e => setNewExSets(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-sm text-white outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold">Repetições</label>
                  <input type="text" value={newExReps} onChange={e => setNewExReps(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-sm text-white outline-none" />
                </div>
              </div>
              <button onClick={() => {
                handleAddExerciseToRoutine(editingRoutine.id);
                const updatedRoutine = routines.find(r => r.id === editingRoutine.id);
                if(updatedRoutine) setEditingRoutine({...updatedRoutine});
              }} className="w-full mt-2 bg-slate-800 hover:bg-slate-700 text-lime-400 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700">
                <Plus className="w-4 h-4" /> ADICIONAR NA FICHA
              </button>
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
        <button onClick={() => setActiveTab('gerador')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'gerador' ? 'text-lime-400' : 'text-slate-500'}`}>
          <Wand2 className="w-5 h-5" />
          <span className="text-[10px] font-bold">Criador Pro</span>
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
