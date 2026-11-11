import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Play, History, TrendingUp, Dumbbell, Check, Clock, Wand2, X, Loader2, Plus, Trash2, Edit3 
} from 'lucide-react';

const WORKOUT_DATABASE = {
  Feminino: {
    Hipertrofia: [
      { name: "Inferiores A1: Foco Quadríceps & Glúteo", exercises: [{ name: "Agachamento Livre com Barra", sets: 4, reps: "8-10" }, { name: "Leg Press 45º (Pés Baixos)", sets: 4, reps: "10-12" }, { name: "Cadeira Extensora", sets: 3, reps: "12-15" }, { name: "Afundo com Halteres", sets: 3, reps: "10 por perna" }, { name: "Panturrilhas em Pé", sets: 4, reps: "20" }] },
      { name: "Inferiores B1: Foco Posterior & Glúteo Máximo", exercises: [{ name: "Elevação Pélvica com Barra", sets: 4, reps: "10-12" }, { name: "Stiff com Halteres", sets: 4, reps: "10-12" }, { name: "Mesa Flexora", sets: 3, reps: "12" }, { name: "Glúteo Coice na Polia", sets: 4, reps: "15" }, { name: "Cadeira Abdutora", sets: 4, reps: "15" }] },
      { name: "Inferiores C1: Unilateral & Búlgaro", exercises: [{ name: "Agachamento Búlgaro", sets: 4, reps: "10 por perna" }, { name: "Levantamento Terra Romeno", sets: 4, reps: "10" }, { name: "Leg Press Unilateral", sets: 3, reps: "12" }, { name: "Cadeira Extensora (Drop-set)", sets: 3, reps: "10" }, { name: "Elevação Pélvica Unilateral", sets: 3, reps: "12" }] },
      { name: "Inferiores D1: Volume Extremo de Glúteos", exercises: [{ name: "Sumô com Barra ou Halter", sets: 4, reps: "10-12" }, { name: "Elevação Pélvica (Pausa 2s no topo)", sets: 4, reps: "10" }, { name: "Cadeira Abdutora (Tronco Inclinado)", sets: 4, reps: "15" }, { name: "Extensão de Quadril no Solo", sets: 3, reps: "20" }, { name: "Panturrilhas Sentado", sets: 4, reps: "15" }] },
      { name: "Inferiores E1: Força e Punição de Posteriores", exercises: [{ name: "Good Morning (Bom Dia) Leve", sets: 3, reps: "12" }, { name: "Flexor Vertical", sets: 3, reps: "12" }, { name: "Agachamento Sumô no Smith", sets: 4, reps: "10" }, { name: "Glúteo na Máquina", sets: 4, reps: "15" }] },
      { name: "Superiores A: Costas e Ombros (Manutenção)", exercises: [{ name: "Puxada Alta na Polia", sets: 3, reps: "12" }, { name: "Remada Baixa", sets: 3, reps: "12" }, { name: "Desenvolvimento com Halteres", sets: 3, reps: "12" }, { name: "Elevação Lateral", sets: 3, reps: "15" }] },
      { name: "Superiores B: Core e Braços", exercises: [{ name: "Tríceps na Polia", sets: 3, reps: "15" }, { name: "Rosca Direta com Halteres", sets: 3, reps: "12" }, { name: "Prancha Abdominal", sets: 3, reps: "45 seg" }, { name: "Abdominal Infra no Solo", sets: 3, reps: "20" }] }
    ],
    "Emagrecimento / Definição": [
      { name: "Full Body Definição A (HIIT Pernas)", exercises: [{ name: "Agachamento com Salto", sets: 4, reps: "15" }, { name: "Stiff com Halteres Leves", sets: 4, reps: "15" }, { name: "Afundo Dinâmico", sets: 3, reps: "12 por perna" }, { name: "Polichinelo", sets: 3, reps: "1 min" }] },
      { name: "Full Body Definição B (Resistência Glúteo)", exercises: [{ name: "Elevação Pélvica Rápida", sets: 4, reps: "20" }, { name: "Cadeira Extensora", sets: 3, reps: "15" }, { name: "Cadeira Flexora", sets: 3, reps: "15" }, { name: "Bicicleta no Solo", sets: 3, reps: "25" }] },
      { name: "Full Body Definição C (Cardio & Core)", exercises: [{ name: "Leg Press 45º", sets: 3, reps: "15" }, { name: "Abdução de Quadril na Polia", sets: 3, reps: "20" }, { name: "Prancha com Toque no Ombro", sets: 3, reps: "40 seg" }, { name: "Esteira (HIIT)", sets: 1, reps: "20 min" }] },
      { name: "Circuito Queima Total Inferiores", exercises: [{ name: "Sumô sem Carga (Ritmo Forte)", sets: 4, reps: "20" }, { name: "Agachamento Livre", sets: 3, reps: "15" }, { name: "Elevação Pélvica Solo", sets: 4, reps: "20" }, { name: "Abdominal Supra", sets: 3, reps: "25" }] },
      { name: "Metabólico Superior & Core", exercises: [{ name: "Flexão de Joelhos no Solo", sets: 3, reps: "12" }, { name: "Puxada Aberta", sets: 3, reps: "15" }, { name: "Mountain Climber", sets: 3, reps: "40 seg" }, { name: "Pular Corda", sets: 3, reps: "1 min" }] }
    ],
    "Força Pura": [
      { name: "Power Inferiores Pesado A", exercises: [{ name: "Agachamento Livre com Carga", sets: 5, reps: "5" }, { name: "Elevação Pélvica Pesada", sets: 5, reps: "6" }, { name: "Leg Press Pesado", sets: 4, reps: "6-8" }] },
      { name: "Power Inferiores Pesado B", exercises: [{ name: "Levantamento Terra Romeno Pesado", sets: 5, reps: "5" }, { name: "Agachamento Búlgaro com Carga", sets: 4, reps: "6" }, { name: "Mesa Flexora Pesada", sets: 4, reps: "6-8" }] }
    ]
  },
  Masculino: {
    Hipertrofia: [
      { name: "Treino A1: Peito, Tríceps e Ombro (Foco Supino)", exercises: [{ name: "Supino Reto com Barra", sets: 4, reps: "8-10" }, { name: "Supino Inclinado com Halteres", sets: 4, reps: "10" }, { name: "Crucifixo na Polia", sets: 3, reps: "12" }, { name: "Desenvolvimento Militar", sets: 3, reps: "10" }, { name: "Tríceps Testa", sets: 3, reps: "12" }, { name: "Tríceps Corda", sets: 3, reps: "15" }] },
      { name: "Treino B1: Costas, Bíceps e Antebraço", exercises: [{ name: "Puxada Alta Frontal", sets: 4, reps: "10" }, { name: "Remada Curvada com Barra", sets: 4, reps: "8-10" }, { name: "Remada Baixa na Polia", sets: 3, reps: "12" }, { name: "Pulldown", sets: 3, reps: "15" }, { name: "Rosca Direta com Barra", sets: 3, reps: "10" }, { name: "Rosca Martelo", sets: 3, reps: "12" }] },
      { name: "Treino C1: Membros Inferiores Completo", exercises: [{ name: "Agachamento Livre", sets: 4, reps: "8-10" }, { name: "Leg Press 45º", sets: 4, reps: "10" }, { name: "Cadeira Extensora", sets: 3, reps: "12" }, { name: "Mesa Flexora", sets: 3, reps: "12" }, { name: "Stiff", sets: 3, reps: "10" }, { name: "Panturrilhas em Pé", sets: 4, reps: "15" }] },
      { name: "Treino D1: Ombros, Trapézio e Abdômen", exercises: [{ name: "Desenvolvimento com Halteres", sets: 4, reps: "10" }, { name: "Elevação Lateral com Halteres", sets: 4, reps: "12-15" }, { name: "Crucifixo Inverso", sets: 3, reps: "12" }, { name: "Encolhimento com Halteres", sets: 3, reps: "12" }, { name: "Abdominal Infra na Paralela", sets: 3, reps: "15" }] },
      { name: "Treino E1: Peito & Costas (Supersets)", exercises: [{ name: "Supino Reto", sets: 4, reps: "10" }, { name: "Barra Fixa ou Puxada", sets: 4, reps: "10" }, { name: "Supino Inclinado", sets: 3, reps: "12" }, { name: "Remada Cavalinho", sets: 3, reps: "12" }] },
      { name: "Treino F1: Braços Completo (Specialization)", exercises: [{ name: "Rosca Direta Scott", sets: 4, reps: "10" }, { name: "Rosca Concentrada", sets: 3, reps: "12" }, { name: "Tríceps Coice na Polia", sets: 4, reps: "12" }, { name: "Tríceps Francês com Halter", sets: 4, reps: "10" }] }
    ],
    "Emagrecimento / Definição": [
      { name: "Upper Body Definição A", exercises: [{ name: "Supino Reto com Halteres", sets: 4, reps: "12" }, { name: "Remada Baixa", sets: 4, reps: "12" }, { name: "Desenvolvimento Arnold", sets: 3, reps: "12" }, { name: "Burpees", sets: 3, reps: "10" }] },
      { name: "Lower Body Definição B", exercises: [{ name: "Leg Press 45º", sets: 4, reps: "15" }, { name: "Cadeira Flexora", sets: 4, reps: "15" }, { name: "Afundo sem Carga", sets: 3, reps: "15 por perna" }, { name: "Prancha Abdominal", sets: 3, reps: "50 seg" }] },
      { name: "Full Body Metabólico C", exercises: [{ name: "Kettlebell Swing ou Halter", sets: 4, reps: "15" }, { name: "Flexão de Braço", sets: 3, reps: "15" }, { name: "Agachamento Livre", sets: 3, reps: "15" }, { name: "Esteira Corrida Intervalada", sets: 1, reps: "20 min" }] },
      { name: "Circuito HIIT Peito & Costas", exercises: [{ name: "Supino Reto com Halteres Leves", sets: 4, reps: "15" }, { name: "Puxada Frontal", sets: 4, reps: "15" }, { name: "Polichinelo", sets: 3, reps: "1 min" }] }
    ],
    "Força Pura": [
      { name: "Powerbuilding A (Foco Força Máxima)", exercises: [{ name: "Supino Reto Pesado", sets: 5, reps: "3-5" }, { name: "Agachamento Livre Pesado", sets: 5, reps: "3-5" }, { name: "Levantamento Terra", sets: 3, reps: "3" }] },
      { name: "Powerbuilding B (Acessórios Pesados)", exercises: [{ name: "Desenvolvimento Militar Pesado", sets: 5, reps: "5" }, { name: "Remada Curvada Pesada", sets: 5, reps: "5" }, { name: "Paralelas com Carga", sets: 4, reps: "6-8" }] }
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
      name: 'Treino Inicial de Boas-Vindas',
      exercises: [
        { name: 'Agachamento Livre', sets: 4, reps: '10-12' },
        { name: 'Supino Reto', sets: 4, reps: '10-12' }
      ]
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

  const [activeSession, setActiveSession] = useState(null);
  const [generating, setGenerating] = useState(false);

  const [age, setAge] = useState('25');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');
  const [gender, setGender] = useState('Feminino');
  const [daysPerWeek, setDaysPerWeek] = useState('4');
  const [goal, setGoal] = useState('Hipertrofia (Ganho de Massa)');

  const [editingRoutine, setEditingRoutine] = useState(null);
  const [newExName, setNewExName] = useState('');
  const [newExSets, setNewExSets] = useState(4);
  const [newExReps, setNewExReps] = useState('10-12');

  useEffect(() => localStorage.setItem('luan_training_routines', JSON.stringify(routines)), [routines]);
  useEffect(() => localStorage.setItem('luan_training_history', JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem('luan_training_prs', JSON.stringify(prs)), [prs]);

  const handleSmartGenerateWorkout = () => {
    if (!age || !weight || !height || !gender) {
      return alert("Preencha todos os campos do perfil!");
    }
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
          name: `${baseRoutine.name}`,
          exercises: [...baseRoutine.exercises]
        });
      }

      setRoutines([...generatedRoutines, ...routines]);
      setActiveTab('treinos');
      setGenerating(false);
      alert(`Pronto! O criador inteligente gerou ${generatedRoutines.length} fichas exclusivas baseadas em modelos profissionais!`);
    }, 400);
  };

  const handleAddExerciseToRoutine = (routineId) => {
    if (!newExName) return alert("Digite o nome do exercício!");
    setRoutines(routines.map(r => {
      if (r.id === routineId) {
        return {
          ...r,
          exercises: [...r.exercises, { name: newExName, sets: Number(newExSets), reps: newExReps }]
        };
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

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col shadow-2xl relative pb-24 font-sans">
      
      <header className="px-4 py-3 bg-slate-900/90 backdrop-blur sticky top-0 z-20 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-lime-400/10 p-2 rounded-xl border border-lime-400/20">
            <Dumbbell className="text-lime-400 w-5 h-5" />
          </div>
          <h1 className="font-black text-base text-lime-400 tracking-wider">LUAN TRAINING</h1>
        </div>
        <span className="text-[10px] bg-lime-400/10 text-lime-400 border border-lime-400/20 px-2 py-1 rounded-full font-bold">100% Offline ⚡</span>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        
        {activeTab === 'treinos' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-white">Meus Treinos</h2>
                <p className="text-xs text-slate-400">Gerencie e inicie suas rotinas salvas</p>
              </div>
              <button onClick={() => setActiveTab('gerador')} className="bg-lime-400 hover:bg-lime-500 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-lime-400/10">
                <Wand2 className="w-4 h-4" /> Criador Pro
              </button>
            </div>

            {routines.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">Nenhum treino salvo. Vá em Criador Pro para gerar fichas!</div>
            )}

            <div className="space-y-3 mt-4">
              {routines.map(routine => (
                <div key={routine.id} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-md space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-lime-400">{routine.name}</h3>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingRoutine(routine)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs" title="Editar Exercícios">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteRoutine(routine.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs" title="Apagar Treino">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setActiveSession(routine)} className="bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5">
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

        {activeTab === 'gerador' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-lime-400/10 p-2 rounded-xl border border-lime-400/20">
                <Wand2 className="text-lime-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Criador Profissional</h2>
                <p className="text-xs text-slate-400">Gere rotinas avançadas baseadas em modelos de academia</p>
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
                {generating ? 'COMBINANDO FICHAS...' : 'GERAR MEU TREINO PRO'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'historico' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <History className="text-lime-400 w-5 h-5" /> Histórico
            </h2>
            {history.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm">Nenhum treino concluído ainda.</div>
            ) : (
              history.map((h, i) => (
                <div key={i} className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lime-400 text-sm">{h.name}</span>
                    <span className="text-[10px] text-slate-500">{h.date}</span>
                  </div>
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
                  }} className="text-red-400 hover:text-red-300 p-1.5 bg-red-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2">
              <p className="text-xs text-lime-400 font-bold">Adicionar Novo Exercício:</p>
              <input 
                type="text" placeholder="Nome do exercício (ex: Elevação Lateral)" 
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

      {/* SESSÃO ATIVA */}
      {activeSession && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col p-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs text-lime-400 font-bold uppercase tracking-wider">Treino em Andamento</span>
              <h2 className="text-lg font-black text-white">{activeSession.name}</h2>
            </div>
            <button onClick={() => setActiveSession(null)} className="p-2 bg-slate-900 rounded-xl text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {activeSession.exercises.map((ex, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="font-bold text-white text-sm">{ex.name}</span>
                  <p className="text-xs text-lime-400 mt-1">{ex.sets} séries × {ex.reps}</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => {
              setHistory([{ name: activeSession.name, date: new Date().toLocaleDateString() }, ...history]);
              setActiveSession(null);
              setActiveTab('historico');
            }} 
            className="w-full bg-lime-400 text-slate-950 font-black py-3.5 rounded-xl flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5 stroke-[3]" /> CONCLUIR TREINO
          </button>
        </div>
      )}

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
          <History className="w-5 h-5" />
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
