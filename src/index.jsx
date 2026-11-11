import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Play, History, TrendingUp, Dumbbell, Check, Clock, Wand2, X, Loader2 
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('treinos');
  
  // --- ESTADOS LOCAIS (OFFLINE) ---
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('luan_training_routines');
    return saved ? JSON.parse(saved) : [];
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

  // Inputs da IA
  const [age, setAge] = useState('25');
  const [weight, setWeight] = useState('70');
  const [gender, setGender] = useState('Masculino');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [goal, setGoal] = useState('Hipertrofia (Ganho de Massa)');

  // Salvar automaticamente no dispositivo
  useEffect(() => localStorage.setItem('luan_training_routines', JSON.stringify(routines)), [routines]);
  useEffect(() => localStorage.setItem('luan_training_history', JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem('luan_training_prs', JSON.stringify(prs)), [prs]);

  // --- INTEGRAÇÃO REAL COM GOOGLE GEMINI ---
  const handleGenerateAIWorkout = async () => {
    if (!age || !weight) return alert("Preencha idade e peso!");
    setLoadingAI(true);
    
    try {
      // CHAVE DE API APLICADA:
      const GEMINI_API_KEY = 'AQ.Ab8RN6KqNfc5cn26AV7jVPPRz4l8_0dMutBkfJtOPP0Chtk6eQ'; 

      const prompt = `Atue como um personal trainer de elite. Crie um treino de musculação diário para uma pessoa de ${age} anos, pesando ${weight}kg, sexo ${gender}, que treina ${daysPerWeek} dias por semana, com foco em ${goal}. 
      Retorne APENAS um objeto JSON válido (sem marcação de código ou texto extra) exatamente neste formato:
      {
        "name": "Nome do Treino (ex: Treino Full Body)",
        "exercises": [
          { "name": "Nome do Exercicio", "sets": 4, "reps": "10-12" }
        ]
      }`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message);

      let textOutput = data.candidates[0].content.parts[0].text;
      textOutput = textOutput.replace(/```json/g, '').replace(/```/g, '').trim(); // Limpa formatação markdown
      const aiRoutine = JSON.parse(textOutput);

      const newRoutine = {
        id: Date.now().toString(),
        name: aiRoutine.name || `Treino IA - ${goal}`,
        exercises: aiRoutine.exercises || []
      };

      setRoutines([newRoutine, ...routines]);
      setActiveTab('treinos');
      alert('Treino gerado pelo Gemini com sucesso!');
    } catch (error) {
      console.error("Erro no Gemini:", error);
      alert("Erro ao conectar com a IA. Verifique sua chave de API ou conexão de internet.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 flex flex-col shadow-2xl relative pb-24 font-sans">
      
      {/* Header */}
      <header className="px-4 py-3 bg-slate-900/90 backdrop-blur sticky top-0 z-20 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-lime-400/10 p-2 rounded-xl border border-lime-400/20">
            <Dumbbell className="text-lime-400 w-5 h-5" />
          </div>
          <h1 className="font-black text-base text-lime-400 tracking-wider">LUAN TRAINING</h1>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-full font-semibold border border-slate-700">Gemini IA</span>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 overflow-y-auto">
        
        {/* ABA: TREINOS */}
        {activeTab === 'treinos' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-white">Meus Treinos</h2>
                <p className="text-xs text-slate-400">Escolha sua rotina para iniciar a sessão</p>
              </div>
              <button onClick={() => setActiveTab('ia')} className="bg-lime-400 hover:bg-lime-500 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-lime-400/10">
                <Wand2 className="w-4 h-4" /> Nova IA
              </button>
            </div>

            {routines.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">Nenhum treino salvo. Gere um novo com a IA!</div>
            )}

            <div className="space-y-3 mt-4">
              {routines.map(routine => (
                <div key={routine.id} className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 shadow-md space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-lime-400">{routine.name}</h3>
                    <button onClick={() => setActiveSession(routine)} className="bg-lime-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5">
                      <Play className="w-3.5 h-3.5 fill-current" /> Iniciar
                    </button>
                  </div>
                  <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50 space-y-2">
                    {routine.exercises.map((ex, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm text-slate-300">
                        <span className="font-medium">{ex.name}</span>
                        <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-md">{ex.sets}x{ex.reps}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA: GERADOR DE IA */}
        {activeTab === 'ia' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-lime-400/10 p-2 rounded-xl border border-lime-400/20">
                <Wand2 className="text-lime-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Gemini IA</h2>
                <p className="text-xs text-slate-400">Monte um plano real com Inteligência Artificial</p>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Idade</label>
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Peso (kg)</label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-sm text-white outline-none" />
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
                onClick={handleGenerateAIWorkout} disabled={loadingAI}
                className="w-full mt-3 bg-lime-400 hover:bg-lime-500 text-slate-950 font-black py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg text-sm"
              >
                {loadingAI ? <Loader2 className="animate-spin w-5 h-5" /> : <Wand2 className="w-5 h-5" />}
                {loadingAI ? 'PENSANDO...' : 'GERAR MEU TREINO'}
              </button>
            </div>
          </div>
        )}

        {/* ABA: HISTÓRICO */}
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

        {/* ABA: PROGRESSO / PRs */}
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

      {/* SESSÃO ATIVA (MODAL) */}
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
                <span className="font-bold text-white text-sm">{ex.name}</span>
                <span className="text-xs bg-lime-400/10 text-lime-400 px-2.5 py-1 rounded-lg font-medium">{ex.sets} séries × {ex.reps}</span>
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

      {/* Navegação */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/95 backdrop-blur border-t border-slate-800 p-2.5 flex justify-around items-center z-20">
        <button onClick={() => setActiveTab('treinos')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'treinos' ? 'text-lime-400' : 'text-slate-500'}`}>
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] font-bold">Treinos</span>
        </button>
        <button onClick={() => setActiveTab('ia')} className={`flex flex-col items-center gap-1 transition ${activeTab === 'ia' ? 'text-lime-400' : 'text-slate-500'}`}>
          <Wand2 className="w-5 h-5" />
          <span className="text-[10px] font-bold">Gemini IA</span>
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
