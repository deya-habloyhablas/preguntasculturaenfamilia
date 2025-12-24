
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Trophy, Users, CheckCircle2, Award, Home, Star } from 'lucide-react';

const QUESTIONS = [
  { id: 1, q: "¿Cuántas islas tiene HK?", options: ["A) más de 200", "B) más de 300", "C) aproximadamente 260", "D) aproximadamente 160"], correct: "C" },
  { id: 2, q: "¿Cuál es el país con más husos horarios del mundo?", options: ["A) Los Estados Unidos", "B) Francia", "C) España", "D) Rusia"], correct: "B" },
  { id: 3, q: "La isla de los faisanes es una isla que pertenece unos meses a Francia y unos meses a España. ¿De quién es ahora?", options: ["A) España", "B) Francia"], correct: "B" },
  { id: 4, q: "¿Cuál es el único país de Latinoamérica que tiene una frontera con Francia?", options: ["A) Brasil", "B) Venezuela", "C) Colombia", "D) Argentina"], correct: "A" },
  { id: 5, q: "¿Qué famoso conquistador le tenía ailurofobia?", options: ["A) Alejandro Magno", "B) Atila", "C) Tarzán", "D) Napoleón"], correct: "D" },
  { id: 6, q: "¿En cuántos idiomas escribió Phil Collins la banda sonora de Tarzán?", options: ["A) 3", "B) 4", "C) 5", "D) 6"], correct: "C" },
  { id: 7, q: "¿Cuál es el país hispanoparlante con más premios nobel?", options: ["A) España", "B) Argentina", "C) Colombia", "D) Venezuela"], correct: "B" },
  { id: 8, q: "¿Qué premio ha ganado Trump en diciembre?", options: ["A) El premio Nobel de la Paz", "B) El premio FIFA de la Paz", "C) La medalla de Honor", "D) El corazón púrpura"], correct: "B" },
  { id: 9, q: "¿Quién fue la primera mujer que gobernó una potencia mundial pero que, para ser respetada, se vestía de hombre y llevaba una barba postiza?", options: ["A) Cleopatra", "B) Hatshepsut", "C) Nefertiti", "D) Nefertari"], correct: "B" },
  { id: 10, q: "¿Cuántos días ha pasado Zarkozy en la cárcel más cruel de la historia?", options: ["A) 10", "B) 20", "C) 21", "D) 31"], correct: "C" },
  { id: 11, q: "¿Cuál fue el primer ganador de Operación Triunfo?", options: ["A) Rosa de España", "B) Bisbal", "C) Bustamante", "D) Chenoa"], correct: "A" },
  { id: 12, q: "¿Qué grupo de música francés ganó un Grammy por su actuación en lo JJOO?", options: ["A) Aya Nakamura", "B) Paysage", "C) Ultravomit", "D) Gojira"], correct: "D" },
  { id: 13, q: "¿De qué país vienen las galletas de la fortuna?", options: ["A) China", "B) Japón", "C) Los Estados Unidos", "D) Francia, como las croquetas"], correct: "C" },
  { id: 14, q: "¿Con qué fruto seco se puede fabricar dinamita?", options: ["A) Almendra", "B) Nuez", "C) Anacardo", "D) Cacahuete"], correct: "D" },
  { id: 15, q: "¿En qué país es ilegal mascar chicle?", options: ["A) Hong Kong", "B) Singapur", "C) Vietnam", "D) Camboya"], correct: "B" },
  { id: 16, q: "¿En qué país se inventó la fregona?", options: ["A) En Francia, como las croquetas", "B) En España", "C) En China", "D) En Portugal"], correct: "B" },
  { id: 17, q: "¿Quién trabajó en el restaurante más antiguo del mundo “El Sobrino de Botín”?", options: ["A) Francisco de Goya", "B) Salvador Dalí", "C) Pablo Picasso", "D) Diego Velázquez"], correct: "A" },
  { id: 18, q: "¿Cuántas veces se ha pintado la Torre Eiffel?", options: ["A) 5", "B) 10", "C) 15", "D) 20"], correct: "D" },
  { id: 19, q: "¿Cuál era su color original?", options: ["A) Negro noche", "B) Blanco roto", "C) Rojo Venecia", "D) Verde moco"], correct: "C" },
  { id: 20, q: "¿Qué es ilegal hacer en las estaciones de tren de Francia desde 1910?", options: ["A) Hablar", "B) Besarse", "C) Abrazarse", "D) Tirar basura"], correct: "B" }
];

type GameState = 'START' | 'GROUPS_INTRO' | 'READY' | 'QUESTION' | 'ANSWER' | 'RANKING';

const TrivialApp = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0 });
  const [visibleGroups, setVisibleGroups] = useState<number[]>([]);

  useEffect(() => {
    if (gameState === 'GROUPS_INTRO') {
      const timers: any[] = [];
      setVisibleGroups([]);
      
      [1, 2, 3].forEach((num, i) => {
        timers.push(setTimeout(() => {
          setVisibleGroups(prev => [...prev, num]);
        }, (i + 1) * 800));
      });
      
      timers.push(setTimeout(() => {
        setGameState('READY');
      }, 4000));

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [gameState]);

  const assignPoint = (groupId: number | null) => {
    if (groupId !== null) {
      setScores(prev => ({ ...prev, [groupId]: prev[groupId] + 1 }));
    }
    
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setGameState('QUESTION');
    } else {
      setGameState('RANKING');
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case 'START':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-12 fade-in zoom-in">
            <div className="relative">
              <Star className="absolute -top-12 -left-12 w-16 h-16 text-[#f4d03f] animate-pulse" />
              <h1 className="text-8xl font-black text-[#f5e6be] tracking-tighter drop-shadow-xl uppercase">
                PREGUNTAS EN FAMILIA
              </h1>
              <Star className="absolute -bottom-12 -right-12 w-16 h-16 text-[#f4d03f] animate-pulse" />
            </div>
            <button 
              onClick={() => setGameState('GROUPS_INTRO')}
              className="px-16 py-6 bg-[#f4d03f] hover:bg-[#e4c02f] text-[#6b0f11] rounded-full text-3xl font-black transition-all transform hover:scale-110 active:scale-95 shadow-2xl hover:shadow-[#f4d03f]/30"
            >
              Comenzar Partida
            </button>
          </div>
        );

      case 'GROUPS_INTRO':
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-12">
            <h2 className="text-5xl font-black text-[#f5e6be]/40 uppercase tracking-[0.2em]">EQUIPOS</h2>
            <div className="flex gap-16">
              {[1, 2, 3].map(num => (
                <div 
                  key={num} 
                  className={`w-40 h-40 md:w-64 md:h-64 rounded-[2.5rem] bg-[#f5e6be] shadow-2xl flex items-center justify-center text-9xl font-black text-[#6b0f11] transition-all duration-700 transform ${visibleGroups.includes(num) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        );

      case 'READY':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-12 fade-in">
            <h1 className="text-[12rem] font-black text-[#f4d03f] tracking-tighter animate-bounce drop-shadow-2xl">
              ¿PREPARADAS?
            </h1>
            <button 
              onClick={() => setGameState('QUESTION')}
              className="group flex items-center gap-4 px-12 py-5 bg-[#f4d03f] hover:bg-[#e4c02f] text-[#6b0f11] rounded-full text-3xl font-black transition-all shadow-2xl transform hover:scale-105"
            >
              ¡VAMOS ALLÁ! <ArrowRight className="w-10 h-10 group-hover:translate-x-3 transition-transform" />
            </button>
          </div>
        );

      case 'QUESTION':
      case 'ANSWER':
        const currentQ = QUESTIONS[currentIdx];
        const isAnswerMode = gameState === 'ANSWER';
        
        return (
          <div className="flex flex-col h-full max-w-6xl mx-auto py-8 fade-in">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-2">
                <span className="text-[#f5e6be]/40 font-black text-2xl uppercase tracking-widest">Pregunta</span>
                <div className="flex items-baseline gap-2">
                   <span className="text-6xl font-black text-[#f4d03f]">{currentIdx + 1}</span>
                   <span className="text-2xl font-bold text-[#f5e6be]/60">/ {QUESTIONS.length}</span>
                </div>
              </div>
              <div className="flex gap-6">
                {[1, 2, 3].map(id => (
                  <div key={id} className="bg-[#f5e6be] px-8 py-4 rounded-3xl shadow-lg border-b-8 border-[#f4d03f]/30 flex flex-col items-center min-w-[100px]">
                    <span className="text-xs font-black text-[#6b0f11]/60 uppercase mb-1">Equipo {id}</span>
                    <span className="text-4xl font-black text-[#6b0f11]">{scores[id]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f5e6be] rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] p-12 md:p-20 flex-1 flex flex-col justify-center relative overflow-hidden border border-[#f5e6be]/20">
              <div className="absolute top-0 left-0 w-full h-3 bg-[#6b0f11]/10">
                <div 
                  className="h-full bg-gradient-to-r from-[#f4d03f] to-[#e4c02f] transition-all duration-700 ease-out" 
                  style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <h2 className="text-4xl md:text-6xl font-black text-[#6b0f11] mb-16 leading-tight">
                {currentQ.q}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {currentQ.options.map((option) => {
                  const letter = option.trim().charAt(0);
                  const isCorrect = isAnswerMode && letter === currentQ.correct;
                  return (
                    <div 
                      key={option}
                      className={`p-8 rounded-3xl border-4 transition-all text-2xl font-bold flex items-center justify-between ${
                        isCorrect 
                          ? 'bg-green-100 border-green-600 text-green-900 scale-[1.03] shadow-xl' 
                          : isAnswerMode ? 'bg-[#6b0f11]/5 border-[#6b0f11]/10 text-[#6b0f11]/30 opacity-60' : 'bg-[#6b0f11]/5 border-transparent text-[#6b0f11]'
                      }`}
                    >
                      <span>{option}</span>
                      {isCorrect && <CheckCircle2 className="w-10 h-10 text-green-600" />}
                    </div>
                  );
                })}
              </div>

              {!isAnswerMode ? (
                <div className="flex justify-end mt-auto">
                  <button 
                    onClick={() => setGameState('ANSWER')}
                    className="group flex items-center gap-4 px-12 py-6 bg-[#6b0f11] hover:bg-[#5a0d0e] text-[#f4d03f] rounded-[2rem] text-3xl font-black transition-all shadow-2xl transform hover:-translate-y-1"
                  >
                    REVELAR RESPUESTA <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="mt-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
                  <h3 className="text-center text-[#6b0f11]/40 font-black uppercase tracking-[0.3em] text-sm mb-8">PUNTO PARA:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3].map(id => (
                      <button 
                        key={id}
                        onClick={() => assignPoint(id)}
                        className="group py-6 bg-[#f4d03f] hover:bg-[#6b0f11] hover:text-[#f4d03f] text-[#6b0f11] rounded-3xl font-black text-2xl transition-all border-b-8 border-[#6b0f11]/20 flex flex-col items-center gap-1 shadow-md"
                      >
                        <Award className="w-8 h-8 opacity-50 group-hover:opacity-100" />
                        EQUIPO {id}
                      </button>
                    ))}
                    <button 
                      onClick={() => assignPoint(null)}
                      className="py-6 bg-[#6b0f11]/10 hover:bg-[#6b0f11]/20 text-[#6b0f11] rounded-3xl font-black text-2xl transition-all border-b-8 border-[#6b0f11]/30"
                    >
                      NADIE
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'RANKING':
        const sortedScores = Object.entries(scores)
          .map(([id, score]) => ({ id: Number(id), score }))
          .sort((a, b) => b.score - a.score);

        return (
          <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto text-center space-y-16 fade-in">
            <div className="space-y-6">
              <Trophy className="w-32 h-32 text-[#f4d03f] mx-auto animate-bounce drop-shadow-2xl" />
              <h1 className="text-[7rem] font-black text-[#f5e6be] leading-none uppercase">¡RANKING FINAL!</h1>
            </div>

            <div className="flex items-end justify-center gap-8 w-full px-8">
              {[sortedScores[1], sortedScores[0], sortedScores[2]].map((item, idx) => {
                if (!item) return null;
                const isWinner = item.id === sortedScores[0].id;
                const heights = ["h-64", "h-96", "h-48"];
                const colors = ["bg-[#f5e6be]/80", "bg-[#f4d03f]", "bg-[#f5e6be]/60"];
                const labels = ["2º", "1º", "3º"];
                const textColors = ["text-[#6b0f11]", "text-[#6b0f11]", "text-[#6b0f11]"];
                
                return (
                  <div 
                    key={item.id}
                    className="flex flex-col items-center gap-6 flex-1 max-w-[280px]"
                  >
                    <div className="text-center space-y-2">
                       <p className="text-5xl font-black text-[#f5e6be]">{item.score} <span className="text-xl text-[#f4d03f]">PTS</span></p>
                       <p className="text-lg font-bold text-white uppercase tracking-widest">EQUIPO {item.id}</p>
                    </div>
                    <div 
                      className={`${heights[idx]} ${colors[idx]} w-full rounded-t-[3rem] shadow-2xl flex items-center justify-center relative transition-all duration-1000 transform hover:scale-105`}
                      style={{ animation: `slideUp 1s ease-out ${idx * 0.2}s forwards`, opacity: 0, transform: 'translateY(50px)' }}
                    >
                      <span className={`text-8xl font-black ${textColors[idx]} opacity-30`}>{labels[idx]}</span>
                      {isWinner && <Star className="absolute -top-8 w-16 h-16 text-[#f4d03f] fill-[#f4d03f] animate-spin-slow" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => {
                setCurrentIdx(0);
                setScores({ 1: 0, 2: 0, 3: 0 });
                setGameState('START');
              }}
              className="flex items-center gap-3 px-12 py-6 bg-[#f4d03f] hover:bg-[#e4c02f] text-[#6b0f11] rounded-[2rem] text-2xl font-black transition-all shadow-2xl transform hover:scale-110"
            >
              <Home className="w-8 h-8" /> REINICIAR JUEGO
            </button>
            
            <style>{`
              @keyframes slideUp {
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-spin-slow {
                animation: spin 8s linear infinite;
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#6b0f11] font-sans text-white overflow-hidden relative">
      {/* Decorative Blobs updated for new palette */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#f4d03f]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-black/20 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="relative z-10 h-screen p-8 md:p-16">
        {renderContent()}
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<TrivialApp />);
}
