import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, History, TrendingUp, Dumbbell, Check, Clock, Share2, X, 
  Flame, Award, Settings, User, LogOut, Calendar, Plus, Wand2, Archive, Loader2, Save
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut 
} from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, getDoc, collection, onSnapshot, 
  addDoc, deleteDoc, getDocs 
} from 'firebase/firestore';

// --- FIREBASE SETUP ---
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- DEFAULT DATA ---
const THEME_COLORS = {
  lime: { bg: 'bg-lime-500', text: 'text-lime-400', border: 'border-lime-500', hex: '#a3e635' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500', hex: '#3b82f6' },
  red: { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500', hex: '#ef4444' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500', hex: '#a855f7' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500', hex: '#f97316' },
};

const OBJECTIVE_OPTIONS = [
  "Hipertrofia (Ganho de Massa)",
  "Emagrecimento / Definição",
  "Força Máxima",
  "Resistência e Condicionamento",
  "Saúde e Qualidade de Vida",
  "Foco em Membros Inferiores",
  "Foco em Membros Superiores"
];

// --- UTILS ---
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// --- MAIN APP COMPONENT ---
export default function LuanTrainingApp() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [initialRoutinesLoaded, setInitialRoutinesLoaded] = useState(false);
  
  // App State (Synced with Firestore)
  const [settings, setSettings] = useState({ appName: 'Luan Training', themeColor: 'lime' });
  const [routines, setRoutines] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [prs, setPrs] = useState({});
  const [summaryData, setSummaryData] = useState(null);
  const [activeTab, setActiveTab] = useState('treinos');

  // 1. Initial Auth Flow
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.error("Auth init error", e);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Data Fetching & Syncing
  useEffect(() => {
    if (!user) return;
    if (user.isAnonymous) return; // We only sync data if they are fully logged in with email/pass

    const uid = user.uid;
    const userDocRef = doc(db, 'artifacts', appId, 'users', uid);

    // Snapshot Settings
    const unsubSettings = onSnapshot(doc(userDocRef, 'settings', 'profile'), (d) => {
      if (d.exists()) setSettings(d.data());
      else setDoc(doc(userDocRef, 'settings', 'profile'), { appName: 'Luan Training', themeColor: 'lime' });
    });

    // Snapshot Active Session
    const unsubSession = onSnapshot(doc(userDocRef, 'activeSession', 'current'), (d) => {
      setActiveSession(d.exists() ? d.data() : null);
    });

    // Snapshot History
    const unsubHistory = onSnapshot(collection(userDocRef, 'history'), (snapshot) => {
      const hist = [];
      const newPrs = {};
      snapshot.forEach(d => {
        const data = d.data();
        hist.push({ id: d.id, ...data });
        // Calculate PRs dynamically from history
        if (data.details) {
          Object.entries(data.details).forEach(([key, setInfo]) => {
            if (setInfo.checked && setInfo.weight) {
              const exName = key.split('_')[0];
              const weight = parseFloat(setInfo.weight);
              if (!newPrs[exName] || weight > newPrs[exName]) newPrs[exName] = weight;
            }
          });
        }
      });
      setHistory(hist.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setPrs(newPrs);
    });

    // Snapshot Routines
    const unsubRoutines = onSnapshot(collection(userDocRef, 'routines'), (snapshot) => {
      const rts = [];
      snapshot.forEach(d => rts.push({ dbId: d.id, ...d.data() }));
      setRoutines(rts);
      setInitialRoutinesLoaded(true);
    });

    // --- MIGRATION LOGIC ---
    const localHistory = localStorage.getItem('luan_history');
    if (localHistory) {
      try {
        const parsed = JSON.parse(localHistory);
        parsed.forEach(async (sess) => {
          await addDoc(collection(userDocRef, 'history'), sess);
        });
        localStorage.removeItem('luan_history');
      } catch (e) { console.error(e); }
    }

    return () => {
      unsubSettings();
      unsubSession();
      unsubHistory();
      unsubRoutines();
    };
  }, [user]);

  // --- GLOBAL STYLES ---
  const theme = THEME_COLORS[settings.themeColor] || THEME_COLORS.lime;

  if (authLoading || (user && !user.isAnonymous && !initialRoutinesLoaded)) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
  }

  // --- AUTH SCREEN ---
  if (!user || user.isAnonymous) {
    return <ScreenAuth theme={theme} />;
  }

  // --- ONBOARDING SCREEN (NO ACTIVE ROUTINES) ---
  const activeRoutines = routines.filter(r => !r.archived);
  if (activeRoutines.length === 0) {
    return <ScreenOnboarding user={user} appId={appId} db={db} theme={theme} />;
  }

  // --- WORKOUT ACTIONS ---
  const startWorkout = async (workout, routineId) => {
    const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
    const sessionData = {
      workoutId: workout.id,
      workoutName: workout.name,
      routineId: routineId,
      startTime: Date.now(),
      elapsedSeconds: 0,
      totalSets: totalSets,
      inputs: {},
      exercises: workout.exercises
    };
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'activeSession', 'current'), sessionData);
  };

  const finishWorkout = async (sessionToFinish) => {
    let totalVolume = 0;
    let completedSetsCount = 0;
    let prsBroken = 0;
    
    Object.keys(sessionToFinish.inputs).forEach(key => {
      const data = sessionToFinish.inputs[key];
      if (data.checked) {
        completedSetsCount++;
        const weight = parseFloat(data.weight) || 0;
        const reps = parseInt(data.reps) || 0;
        totalVolume += (weight * reps);

        const exName = key.split('_')[0];
        if (!prs[exName] || weight > prs[exName]) prsBroken++;
      }
    });

    const sessionSummary = {
      date: new Date().toISOString(),
      workoutId: sessionToFinish.workoutId,
      workoutName: sessionToFinish.workoutName,
      duration: sessionToFinish.elapsedSeconds,
      volume: totalVolume,
      completedSets: completedSetsCount,
      totalSets: sessionToFinish.totalSets,
      prsBroken,
      details: sessionToFinish.inputs
    };

    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'history'), sessionSummary);
    await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'activeSession', 'current'));
    
    setSummaryData({ ...sessionSummary, id: 'recent' });
  };

  // --- ROUTERS ---
  if (summaryData) return <ScreenSummary summary={summaryData} onClose={() => setSummaryData(null)} theme={theme} />;
  
  if (activeSession) {
    return (
      <ScreenActiveWorkout 
        session={activeSession} 
        user={user}
        appId={appId}
        db={db}
        onFinish={() => finishWorkout(activeSession)}
        history={history}
        theme={theme}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 font-sans selection:bg-white/10">
      <header className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-800 p-4 pt-8">
        <h1 className="text-xl font-black tracking-tight text-white uppercase italic">
          {settings.appName.split(' ')[0]} <span className={theme.text}>{settings.appName.split(' ').slice(1).join(' ')}</span>
        </h1>
      </header>

      <main className="p-4">
        {activeTab === 'treinos' && <ScreenHome routines={routines} onStart={startWorkout} theme={theme} />}
        {activeTab === 'historico' && <ScreenHistory history={history} theme={theme} />}
        {activeTab === 'evolucao' && <ScreenEvolution prs={prs} history={history} theme={theme} />}
        {activeTab === 'ajustes' && <ScreenSettings user={user} settings={settings} appId={appId} db={db} theme={theme} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 pb-safe z-40">
        <div className="flex justify-around items-center h-16">
          <NavItem icon={<Dumbbell size={22} />} label="Treinos" active={activeTab === 'treinos'} onClick={() => setActiveTab('treinos')} theme={theme} />
          <NavItem icon={<Calendar size={22} />} label="Histórico" active={activeTab === 'historico'} onClick={() => setActiveTab('historico')} theme={theme} />
          <NavItem icon={<TrendingUp size={22} />} label="Evolução" active={activeTab === 'evolucao'} onClick={() => setActiveTab('evolucao')} theme={theme} />
          <NavItem icon={<Settings size={22} />} label="Ajustes" active={activeTab === 'ajustes'} onClick={() => setActiveTab('ajustes')} theme={theme} />
        </div>
      </nav>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({ icon, label, active, onClick, theme }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? theme.text : 'text-slate-500 hover:text-slate-300'}`}>
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  );
}

// ==========================================
// AUTH SCREEN
// ==========================================
function ScreenAuth({ theme }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Erro: ' + err.message.replace('Firebase:', ''));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <Dumbbell size={48} className={`mx-auto mb-4 ${theme.text}`} />
          <h1 className="text-2xl font-black italic uppercase tracking-tight">Luan <span className={theme.text}>Training</span></h1>
          <p className="text-sm text-slate-400 mt-2">Faça login para sincronizar seus treinos</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 ml-1">EMAIL</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none focus:border-slate-600" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 ml-1">SENHA</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none focus:border-slate-600" />
          </div>
          {error && <p className="text-red-400 text-xs text-center font-semibold bg-red-500/10 p-2 rounded">{error}</p>}
          <button type="submit" disabled={loading} className={`w-full ${theme.bg} text-slate-950 font-black py-4 rounded-xl mt-4 active:scale-95 transition-transform disabled:opacity-50`}>
            {loading ? <Loader2 className="animate-spin mx-auto" /> : (isLogin ? 'ENTRAR' : 'CRIAR CONTA')}
          </button>
        </form>
        
        <button onClick={() => setIsLogin(!isLogin)} className="w-full text-center text-sm text-slate-400 mt-6 hover:text-white">
          {isLogin ? 'Não tem conta? Criar nova' : 'Já tem conta? Fazer login'}
        </button>
      </div>
    </div>
  );
}

// ==========================================
// ONBOARDING SCREEN (AI GENERATOR)
// ==========================================
function ScreenOnboarding({ user, appId, db, theme }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [aiForm, setAiForm] = useState({ age: 25, weight: 70, height: 175, gender: 'male', goal: OBJECTIVE_OPTIONS[0], days: 5 });

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    try {
      const prompt = `Atue como um treinador profissional. Crie uma ficha de musculação em JSON para um aluno: ${aiForm.age} anos, ${aiForm.weight}kg, ${aiForm.height}cm, sexo ${aiForm.gender === 'male' ? 'masculino' : 'feminino'}, objetivo: ${aiForm.goal}, treinando ${aiForm.days} dias por semana. 
      REGRA 1: Se feminino, focar mais em membros inferiores (glúteo, quadríceps). Se masculino, focar em superiores (peito, costas, braços).
      REGRA 2: Incluir 4 a 5 exercícios por grupo muscular.
      REGRA 3: Usar técnicas avançadas (Drop Set, Rest Pause) nos exercícios isoladores.
      O formato DEVE SER EXATAMENTE este JSON:
      [
        { "id": "A", "name": "Nome do Treino", "exercises": [ { "name": "Exercicio", "sets": 4, "reps": "8-12", "dropSetLast": true } ] }
      ]`;

      const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                name: { type: "STRING" },
                exercises: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: { name: { type: "STRING" }, sets: { type: "INTEGER" }, reps: { type: "STRING" }, dropSetLast: { type: "BOOLEAN" } },
                    required: ["name", "sets", "reps", "dropSetLast"]
                  }
                }
              }, required: ["id", "name", "exercises"]
            }
          }
        }
      };

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const data = await res.json();
      const generatedWorkouts = JSON.parse(data.candidates[0].content.parts[0].text);

      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'routines'), {
        id: `ai_${Date.now()}`,
        name: `Treino Personalizado (${aiForm.goal})`,
        archived: false,
        workouts: generatedWorkouts
      });
    } catch (err) {
      alert("Erro ao gerar treino. Tente novamente.");
    }
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white animate-in zoom-in-95 duration-500">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="text-center mb-6">
          <Wand2 size={48} className={`mx-auto mb-4 ${theme.text}`} />
          <h1 className="text-2xl font-black italic uppercase tracking-tight">Bem-vindo(a)</h1>
          <p className="text-sm text-slate-400 mt-2">Vamos criar seu primeiro treino personalizado com IA.</p>
        </div>
        
        <form onSubmit={handleAiSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-slate-500 ml-1">IDADE</label><input type="number" required value={aiForm.age} onChange={e=>setAiForm({...aiForm, age: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none" /></div>
            <div><label className="text-xs font-bold text-slate-500 ml-1">PESO (kg)</label><input type="number" required value={aiForm.weight} onChange={e=>setAiForm({...aiForm, weight: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none" /></div>
            <div>
              <label className="text-xs font-bold text-slate-500 ml-1">SEXO</label>
              <select value={aiForm.gender} onChange={e=>setAiForm({...aiForm, gender: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none">
                <option value="male">Masculino</option><option value="female">Feminino</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 ml-1">DIAS/SEMANA</label>
              <input type="number" min="1" max="7" required value={aiForm.days} onChange={e=>setAiForm({...aiForm, days: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 ml-1">OBJETIVO</label>
            <select value={aiForm.goal} onChange={e=>setAiForm({...aiForm, goal: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 mt-1 text-white focus:outline-none">
              {OBJECTIVE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <button type="submit" disabled={aiLoading} className={`w-full ${theme.bg} text-slate-950 font-black py-4 rounded-xl mt-6 active:scale-95 transition-transform disabled:opacity-50 flex justify-center items-center`}>
            {aiLoading ? <Loader2 className="animate-spin" size={24} /> : 'GERAR MEU TREINO'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// HOME (FICHAS DE TREINO)
// ==========================================
function ScreenHome({ routines, onStart, theme }) {
  const activeRoutines = routines.filter(r => !r.archived);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {activeRoutines.map(routine => (
        <div key={routine.dbId} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{routine.name}</h2>
          </div>
          {routine.workouts.map(workout => (
            <div key={workout.id} className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${theme.bg} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
              
              <div className="flex justify-between items-start mb-3 pl-2">
                <div>
                  <h3 className="text-2xl font-black text-white italic tracking-tight">Treino {workout.id}</h3>
                  <p className={`text-sm ${theme.text} font-medium`}>{workout.name}</p>
                </div>
              </div>
              
              <div className="pl-2 mb-5">
                <p className="text-xs text-slate-500 line-clamp-2">
                  {workout.exercises.map(e => e.name).join(' • ')}
                </p>
              </div>

              <button onClick={() => onStart(workout, routine.dbId)} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors active:scale-[0.98]">
                <Play size={18} className={`${theme.text} fill-current`} />
                <span>INICIAR TREINO</span>
              </button>
            </div>
          ))}
        </div>
      ))}
      {activeRoutines.length === 0 && (
        <div className="text-center pt-10 text-slate-500">
          <Archive size={40} className="mx-auto mb-4 opacity-50" />
          <p>Nenhuma ficha ativa. Crie uma nova na aba Ajustes.</p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// ACTIVE WORKOUT
// ==========================================
function ScreenActiveWorkout({ session, user, appId, db, onFinish, history, theme }) {
  const [restTimer, setRestTimer] = useState(0);
  const [localInputs, setLocalInputs] = useState(session.inputs || {});
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalInputs(prev => ({ ...prev, _tick: (prev._tick || 0) + 1 })); 
      if (restTimer > 0) setRestTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimer]);

  const elapsedSeconds = Math.floor((Date.now() - session.startTime) / 1000);

  const handleInputChange = (key, field, value) => {
    setLocalInputs(prev => ({
      ...prev,
      [key]: { ...(prev[key] || { checked: false }), [field]: value }
    }));
  };

  const handleBlur = async () => {
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'activeSession', 'current'), {
      ...session,
      elapsedSeconds,
      inputs: localInputs
    }, { merge: true });
  };

  const handleCheck = async (key) => {
    const currentInput = localInputs[key] || { weight: '', reps: '', checked: false };
    const newChecked = !currentInput.checked;
    
    if (newChecked) setRestTimer(60);

    const newInputs = { ...localInputs, [key]: { ...currentInput, checked: newChecked } };
    setLocalInputs(newInputs);

    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'activeSession', 'current'), {
      ...session,
      elapsedSeconds,
      inputs: newInputs
    }, { merge: true });
  };

  const checkedSets = Object.values(localInputs).filter(i => i?.checked).length;
  const progressPercent = session.totalSets > 0 ? (checkedSets / session.totalSets) * 100 : 0;

  const getPrevData = (exName, setIdx) => {
    for (const past of history) {
      if (past.details) {
        const pastSet = past.details[`${exName}_${setIdx}`];
        if (pastSet && pastSet.weight) return `${pastSet.weight}kg x ${pastSet.reps || '-'}`;
      }
    }
    return '-';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 pb-1">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white italic">Treino {session.workoutId}</h1>
            <p className={`text-xs ${theme.text} font-medium`}>{formatTime(elapsedSeconds)}</p>
          </div>
          <button onClick={onFinish} className={`${theme.bg} text-slate-950 font-bold py-2 px-4 rounded-lg text-sm transition-colors active:scale-95`}>
            FINALIZAR
          </button>
        </div>
        <div className="h-1.5 w-full bg-slate-800">
          <div className={`h-full ${theme.bg} transition-all duration-300 ease-out`} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6 pb-32">
        {session.exercises.map((ex, exIdx) => (
          <div key={exIdx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 bg-slate-800/30 border-b border-slate-800">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-100 text-lg">{ex.name}</h3>
                <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2 py-1 rounded-md">{ex.sets}x{ex.reps}</span>
              </div>
              {ex.dropSetLast && (
                <div className="mt-2 inline-flex items-center space-x-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                  <Flame size={12} /><span>Drop-set na última</span>
                </div>
              )}
            </div>
            
            <div className="p-2 space-y-2">
              <div className="flex text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-1">
                <div className="w-8 text-center">Série</div>
                <div className="flex-1">Anterior</div>
                <div className="w-16 text-center">KG</div>
                <div className="w-16 text-center">Reps</div>
                <div className="w-12 text-center"><Check size={14} className="mx-auto" /></div>
              </div>

              {Array.from({ length: ex.sets }).map((_, sIdx) => {
                const key = `${ex.name}_${sIdx}`;
                const data = localInputs[key] || { weight: '', reps: '', checked: false };
                const isDropSet = ex.dropSetLast && (sIdx === ex.sets - 1);

                return (
                  <div key={sIdx} className={`flex items-center space-x-2 p-2 rounded-xl transition-colors ${data.checked ? 'bg-slate-800/80' : 'bg-slate-950/50'}`}>
                    <div className="w-8 text-center text-sm font-bold text-slate-400">{sIdx + 1}</div>
                    <div className="flex-1 text-xs text-slate-500 font-medium truncate">{getPrevData(ex.name, sIdx)}</div>
                    <div className="w-16">
                      <input 
                        type="number" inputMode="decimal" placeholder="0"
                        value={data.weight || ''}
                        onChange={(e) => handleInputChange(key, 'weight', e.target.value)}
                        onBlur={handleBlur}
                        className="w-full bg-slate-800 text-white text-center rounded-lg py-2 text-sm font-semibold border-none placeholder:text-slate-600 appearance-none"
                      />
                    </div>
                    <div className="w-16 relative">
                      <input 
                        type="number" inputMode="numeric" placeholder="0"
                        value={data.reps || ''}
                        onChange={(e) => handleInputChange(key, 'reps', e.target.value)}
                        onBlur={handleBlur}
                        className="w-full bg-slate-800 text-white text-center rounded-lg py-2 text-sm font-semibold border-none placeholder:text-slate-600 appearance-none"
                      />
                      {isDropSet && <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                    </div>
                    <div className="w-12 flex justify-center">
                      <button 
                        onClick={() => handleCheck(key)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${data.checked ? `${theme.bg} text-slate-950` : 'bg-slate-700 text-slate-500 border border-slate-600'}`}
                      >
                        {data.checked && <Check size={18} strokeWidth={3} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {restTimer > 0 && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 ${theme.bg} text-slate-950 px-6 py-3 rounded-full font-black text-lg shadow-xl flex items-center space-x-4 z-50 animate-in slide-in-from-bottom-10`}>
          <Clock size={20} className="animate-pulse" />
          <span>{formatTime(restTimer)}</span>
          <button onClick={() => setRestTimer(0)} className="bg-slate-950/10 p-1 rounded-full ml-2"><X size={16} /></button>
        </div>
      )}
    </div>
  );
}

// ==========================================
// SUMMARY
// ==========================================
function ScreenSummary({ summary, onClose, theme }) {
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCard = async () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 1080; const height = 1920;

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#020617'); gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = theme.hex; ctx.fillRect(80, 80, 20, 100);
    
    ctx.font = 'italic 900 80px sans-serif'; ctx.fillStyle = '#ffffff';
    ctx.fillText('LUAN', 120, 150);
    ctx.fillStyle = theme.hex; ctx.fillText('TRAINING', 360, 150);

    ctx.font = 'bold 45px sans-serif'; ctx.fillStyle = '#94a3b8';
    ctx.fillText(new Date(summary.date).toLocaleDateString('pt-BR'), 80, 300);
    
    ctx.font = 'italic 900 120px sans-serif'; ctx.fillStyle = '#ffffff';
    ctx.fillText(`TREINO ${summary.workoutId}`, 80, 420);
    
    ctx.font = '50px sans-serif'; ctx.fillStyle = theme.hex;
    ctx.fillText(summary.workoutName, 80, 500);

    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    if(ctx.roundRect) { ctx.roundRect(80, 650, width - 160, 500, 40); ctx.fill(); } 
    else { ctx.fillRect(80, 650, width - 160, 500); }

    const drawStat = (label, value, y) => {
      ctx.font = 'bold 45px sans-serif'; ctx.fillStyle = '#94a3b8'; ctx.fillText(label, 140, y);
      ctx.font = '900 70px sans-serif'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'right'; ctx.fillText(value, width - 140, y + 10); ctx.textAlign = 'left';
    };

    drawStat('DURAÇÃO', formatTime(summary.duration), 770);
    drawStat('VOLUME (KG)', summary.volume.toLocaleString(), 920);
    drawStat('SÉRIES FEITAS', `${summary.completedSets}/${summary.totalSets}`, 1070);

    if (summary.prsBroken > 0) {
      ctx.fillStyle = theme.hex; ctx.font = 'italic 900 50px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(`🔥 ${summary.prsBroken} NOVOS RECORDES!`, width / 2, 1250); ctx.textAlign = 'left';
    }

    ctx.font = 'bold 35px sans-serif'; ctx.fillStyle = '#475569'; ctx.textAlign = 'center';
    ctx.fillText('GERADO PELO APP LUAN TRAINING', width / 2, height - 100);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setImageUrl(URL.createObjectURL(blob));
      try {
        if (navigator.share && navigator.canShare) {
          const file = new File([blob], 'treino.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) await navigator.share({ files: [file] });
        }
      } catch (err) {}
      finally { setIsGenerating(false); }
    }, 'image/png');
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col pt-12 animate-in zoom-in-95 duration-300">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className={`w-20 h-20 ${theme.bg} bg-opacity-20 rounded-full flex items-center justify-center border-4 ${theme.border} mb-4`}>
          <Award size={40} className={theme.text} />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">Treino Finalizado!</h1>
          <p className="text-slate-400">{summary.workoutName}</p>
        </div>
        <div className="w-full bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-500 font-bold mb-1">TEMPO</p>
              <p className="text-2xl font-black text-white">{formatTime(summary.duration)}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-500 font-bold mb-1">VOLUME</p>
              <p className={`text-2xl font-black ${theme.text}`}>{summary.volume}<span className="text-sm opacity-50 ml-1">kg</span></p>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 col-span-2">
              <p className="text-xs text-slate-500 font-bold mb-1">SÉRIES COMPLETAS</p>
              <div className="flex items-end space-x-2">
                <p className="text-2xl font-black text-white">{summary.completedSets}</p>
                <p className="text-slate-500 font-medium mb-1">de {summary.totalSets}</p>
              </div>
            </div>
          </div>
          {summary.prsBroken > 0 && (
            <div className={`bg-opacity-10 border ${theme.border} border-opacity-20 p-4 rounded-2xl flex items-center space-x-3 ${theme.text}`}>
              <Flame size={24} />
              <p className="font-bold text-sm">Você bateu {summary.prsBroken} recordes de carga hoje!</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 space-y-4 pb-8">
        <button onClick={generateCard} disabled={isGenerating} className={`w-full ${theme.bg} text-slate-950 font-black py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50`}>
          {isGenerating ? <Clock className="animate-spin" size={20} /> : <Share2 size={20} />}
          <span>{isGenerating ? 'GERANDO...' : 'COMPARTILHAR NO INSTA'}</span>
        </button>
        <button onClick={onClose} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-4 rounded-2xl transition-all active:scale-95">FECHAR E SALVAR</button>
      </div>

      <canvas ref={canvasRef} width="1080" height="1920" style={{ display: 'none' }}></canvas>
      {imageUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 p-6 flex flex-col items-center justify-center animate-in fade-in" onClick={() => setImageUrl(null)}>
          <p className="text-white font-bold mb-4">Pressione e segure para salvar (Toque p/ fechar)</p>
          <img src={imageUrl} alt="Resumo" className="max-h-[70vh] rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}

// ==========================================
// HISTORY & CALENDAR
// ==========================================

const FATIGUE_STATES = {
  FADIGADO: { color: '#ef4444', label: 'Fadigado' },
  RECUPERACAO: { color: '#eab308', label: 'Em recuperação' },
  ENFRAQUECIDO: { color: '#22c55e', label: 'Enfraquecido' },
  RECUPERADO: { color: '#3b82f6', label: 'Recuperado' }
};

const getMuscleGroup = (name) => {
  const n = name.toLowerCase();
  if (n.includes('supino') || n.includes('peck') || n.includes('crucifixo') || n.includes('crossover')) return 'peitoral';
  if (n.includes('puxada') || n.includes('remada') || n.includes('pulldown') || n.includes('costas') || n.includes('serrote')) return 'costas';
  if (n.includes('desenvolvimento') || n.includes('elevação') || n.includes('ombro') || n.includes('militar')) return 'ombros';
  if (n.includes('rosca') || n.includes('bíceps') || n.includes('biceps') || n.includes('tríceps') || n.includes('triceps') || n.includes('frances') || n.includes('testa') || n.includes('corda')) return 'bracos';
  if (n.includes('agachamento') || n.includes('leg') || n.includes('extensora') || n.includes('flexora') || n.includes('panturrilha') || n.includes('hack') || n.includes('stiff')) return 'pernas';
  if (n.includes('abd') || n.includes('prancha') || n.includes('core')) return 'abdomen';
  return 'outros';
};

const MUSCLE_GROUP_NAMES = {
  peitoral: 'Peitoral', costas: 'Costas', ombros: 'Ombros', bracos: 'Braços', pernas: 'Pernas', abdomen: 'Abdômen'
};

const BodySVG = ({ type, fatigue }) => {
  const c = (group) => FATIGUE_STATES[fatigue[group] || 'RECUPERADO'].color;
  return (
    <svg viewBox="0 0 100 200" className="w-32 h-auto drop-shadow-xl">
      <g stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
        <circle cx="50" cy="20" r="12" fill="#334155" />
        <rect x="45" y="28" width="10" height="12" fill="#334155" />
        <path d="M25,40 C40,35 60,35 75,40 L85,60 L70,60 L30,60 L15,60 Z" fill={c('ombros')} />
        
        {type === 'front' ? (
          <>
            <path d="M30,60 L70,60 L65,90 L35,90 Z" fill={c('peitoral')} />
            <path d="M35,90 L65,90 L60,120 L40,120 Z" fill={c('abdomen')} />
          </>
        ) : (
          <path d="M30,60 L70,60 L60,120 L40,120 Z" fill={c('costas')} />
        )}

        <path d="M15,60 L30,60 L22,125 L8,125 Z" fill={c('bracos')} />
        <path d="M70,60 L85,60 L92,125 L78,125 Z" fill={c('bracos')} />
        <path d="M40,120 L50,120 L45,195 L30,195 Z" fill={c('pernas')} />
        <path d="M50,120 L60,120 L70,195 L55,195 Z" fill={c('pernas')} />
      </g>
    </svg>
  );
};

function ScreenHistory({ history, theme }) {
  const [showFatigueModal, setShowFatigueModal] = useState(false);
  
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  
  const trainingDates = history.map(h => new Date(h.date).toDateString());

  const now = Date.now();
  const lastTrained = {};
  const volume7d = { peitoral: 0, costas: 0, ombros: 0, bracos: 0, pernas: 0, abdomen: 0 };
  let totalSets7d = 0;

  history.forEach(session => {
    const sessionDate = new Date(session.date).getTime();
    const hoursAgo = (now - sessionDate) / (1000 * 60 * 60);

    Object.keys(session.details || {}).forEach(key => {
      if (session.details[key].checked) {
        const exName = key.split('_')[0];
        const group = getMuscleGroup(exName);
        if (group !== 'outros') {
          if (hoursAgo <= 7 * 24) {
            volume7d[group]++;
            totalSets7d++;
          }
          if (!lastTrained[group] || hoursAgo < lastTrained[group]) {
            lastTrained[group] = hoursAgo;
          }
        }
      }
    });
  });

  const fatigue = {};
  Object.keys(MUSCLE_GROUP_NAMES).forEach(g => {
    const hours = lastTrained[g];
    if (hours === undefined) fatigue[g] = 'RECUPERADO';
    else if (hours <= 24) fatigue[g] = 'FADIGADO';
    else if (hours <= 48) fatigue[g] = 'RECUPERACAO';
    else if (hours <= 72) fatigue[g] = 'ENFRAQUECIDO';
    else fatigue[g] = 'RECUPERADO';
  });

  const trainedRegionsList = Object.keys(volume7d)
    .map(g => ({ 
      name: MUSCLE_GROUP_NAMES[g], 
      volume: volume7d[g], 
      pct: totalSets7d > 0 ? (volume7d[g] / totalSets7d) * 100 : 0 
    }))
    .filter(x => x.volume > 0)
    .sort((a, b) => b.pct - a.pct);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-white text-lg tracking-tight">Fadiga muscular</h2>
          <button onClick={() => setShowFatigueModal(true)} className={`text-xs font-semibold ${theme.text} hover:underline`}>Ver mais</button>
        </div>
        
        <div className="flex justify-around items-center mb-8">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Frente</span>
            <BodySVG type="front" fatigue={fatigue} />
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Costas</span>
            <BodySVG type="back" fatigue={fatigue} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: FATIGUE_STATES.ENFRAQUECIDO.color }}></span><span className="text-slate-400 font-medium">Enfraquecido</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: FATIGUE_STATES.RECUPERACAO.color }}></span><span className="text-slate-400 font-medium">Em recuperação</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: FATIGUE_STATES.RECUPERADO.color }}></span><span className="text-slate-400 font-medium">Recuperado</span></div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full" style={{ backgroundColor: FATIGUE_STATES.FADIGADO.color }}></span><span className="text-slate-400 font-medium">Fadigado</span></div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-bold text-white text-lg tracking-tight">Regiões mais treinadas</h2>
            <p className="text-xs text-slate-500">Últimos 7 dias</p>
          </div>
        </div>
        <div className="space-y-4">
          {trainedRegionsList.map(region => (
            <div key={region.name} className="flex justify-between items-center border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
               <span className="text-slate-300 font-medium">{region.name}</span>
               <span className="text-slate-400 font-bold">{region.pct.toFixed(1).replace('.', ',')}%</span>
            </div>
          ))}
          {trainedRegionsList.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">Nenhum treino registrado nos últimos 7 dias.</p>
          )}
        </div>
      </div>

      {showFatigueModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-lg text-white">Status Detalhado de Fadiga</h3>
              <button onClick={() => setShowFatigueModal(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            <p className="text-xs text-slate-400">Tempo estimado de recuperação muscular:</p>
            <div className="space-y-3 pt-2">
              {Object.keys(MUSCLE_GROUP_NAMES).map(key => {
                const statusKey = fatigue[key];
                const state = FATIGUE_STATES[statusKey];
                return (
                  <div key={key} className="bg-slate-950 p-3 rounded-xl flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{MUSCLE_GROUP_NAMES[key]}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: `${state.color}20`, color: state.color }}>
                      {state.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setShowFatigueModal(false)} className={`w-full ${theme.bg} text-slate-950 font-black py-3 rounded-xl mt-4`}>FECHAR</button>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-white uppercase text-sm">Calendário de Treinos</h2>
          <span className={`text-xs font-semibold ${theme.text}`}>{today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['D','S','T','Q','Q','S','S'].map((d,i) => <div key={i} className="text-[10px] text-slate-500 font-bold">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dStr = new Date(today.getFullYear(), today.getMonth(), day).toDateString();
            const hasTrained = trainingDates.includes(dStr);
            const isToday = day === today.getDate();
            return (
              <div key={day} className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-colors
                ${hasTrained ? `${theme.bg} text-slate-950 shadow-[0_0_10px_rgba(0,0,0,0.3)]` : 'bg-slate-950/50 text-slate-500'}
                ${isToday && !hasTrained ? 'border border-slate-600 text-white' : ''}
              `}>
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Histórico Recente</h2>
      {history.length === 0 ? (
        <div className="text-center pt-10 text-slate-500"><History size={40} className="mx-auto mb-4 opacity-20" /><p>Nenhum treino finalizado.</p></div>
      ) : (
        history.map((session) => (
          <div key={session.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-black text-white italic">Treino {session.workoutId}</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  {new Date(session.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </span>
              </div>
              <p className={`text-xs ${theme.text} font-medium`}>{session.workoutName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">{session.volume.toLocaleString()} kg</p>
              <p className="text-xs text-slate-500">{formatTime(session.duration)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ==========================================
// EVOLUTION
// ==========================================
