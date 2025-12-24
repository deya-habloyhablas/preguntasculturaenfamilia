
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, Trophy, Users, CheckCircle2, Award, Home, Star, RefreshCw } from 'lucide-react';

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

const BGS = {
  FILM: "url('input_file_0.png')",
  SEATS: "url('input_file_1.png')",
  CURTAIN: "url('input_file_2.png')"
};

type GameState = 'START' | 'GROUPS_INTRO' | 'READY' | 'QUESTION' | 'ANSWER' | 'RANKING';

const BulbBorder = ({ children }: { children: React.ReactNode }) => {
  const bulbPositions = useMemo(() => {
    const bulbs = [];
    for (let i = 0; i <= 100; i += 12.5) {
      bulbs.push({ top: '-10px', left: `${i}%`, delay: Math.random() });
      bulbs.push({ bottom: '-10px', left: `${i}%`, delay: Math.random() });
    }
    for (let i = 12.5; i < 100; i += 25) {
      bulbs.push({ left: '-10px', top: `${i}%`, delay: Math.random() });
      bulbs.push({ right: '-10px', top: `${i}%`, delay: Math.random() });
    }
    return bulbs;
  }, []);

  return (
    <div className="comic-card bg-[#f5e6be] p-10 md:p-14 max-w-4xl w-full mx-4 relative">
      {bulbPositions.map((pos, idx) => (
        <div 
          key={idx} 
          className="bulb" 
          style={{ 
            ...pos, 
            animationDelay: `${pos.delay}s`,
            transform: 'translate(-50%, -50%)' 
          } as React.CSSProperties} 
        />
      ))}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const TrivialApp = () => {
  // Inicialización con LocalStorage
  const [gameState, setGameState] = useState<GameState>(() => (localStorage.getItem('gameState') as GameState) || 'START');
  const [currentIdx, setCurrentIdx] = useState(() => Number(localStorage.getItem('currentIdx')) || 0);
  const [scores, setScores] = useState<{ [key: number]: number }>(() => {
    const saved = localStorage.getItem('scores');
    return saved ? JSON.parse(saved) : { 1: 0, 2: 0, 3: 0 };
  });
  const [visibleGroups, setVisibleGroups] = useState<number[]>([]);

  // Sincronizar con LocalStorage cada vez que cambie algo
  useEffect(() => {
    localStorage.setItem('gameState', gameState);
    localStorage.setItem('currentIdx', currentIdx.toString());
    localStorage.setItem('scores', JSON.stringify(scores));
  }, [gameState, currentIdx, scores]);

  useEffect(() => {
    if (gameState === 'GROUPS_INTRO') {
      const timers: any[] = [];
      setVisibleGroups([]);
      [1, 2, 3].forEach((num, i) => {
        timers.push(setTimeout(() => {
          setVisibleGroups(prev => [...prev, num]);
        }, (i + 1) * 800));
      });
      timers.push(setTimeout(() => setGameState('READY'), 4000));
      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [gameState]);

  const resetGame = () => {
    localStorage.clear();
    setGameState('START');
    setCurrentIdx(0);
    setScores({ 1: 0, 2: 0, 3: 0 });
    setVisibleGroups([]);
  };

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

  const getBackground = () => {
    if (gameState === 'START') return BGS.FILM;
    if (gameState === 'GROUPS_INTRO' || gameState === 'READY') return BGS.SEATS;
    return BGS.CURTAIN;
  };

  const renderContent = () => {
    switch (gameState) {
      case 'START':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-12 fade-in zoom-in">
             <div className="bg-black/60 backdrop-blur-md p-14 rounded-[4rem] border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,0.5)]">
                <h1 className="text-8xl font-black text-[#f5e6be] tracking-tighter uppercase mb-10 drop-shadow-xl">
                  PREGUNTAS EN FAMILIA
                </h1>
                <div className="flex flex-col gap-4 items-center">
                  <button 
                    onClick={() => setGameState('GROUPS_INTRO')}
                    className="px-20 py-8 bg-[#f4d03f] hover:bg-[#e4c02f] text-black border-4 border-black rounded-full text-4xl font-black transition-all transform hover:scale-110 shadow-[10px_10px_0px_0px_#000]"
                  >
                    ¡A ESCENA!
                  </button>
                  {currentIdx > 0 && (
                    <button 
                      onClick={resetGame}
                      className="text-[#f5e6be]/60 hover:text-[#f4d03f] text-sm font-bold flex items-center gap-2 transition-colors mt-4"
                    >
                      <RefreshCw className="w-4 h-4" /> REINICIAR TODO
                    </button>
                  )}
                </div>
             </div>
          </div>
        );

      case 'GROUPS_INTRO':
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-16">
            <h2 className="text-7xl font-black text-[#f4d03f] uppercase tracking-[0.4em] drop-shadow-[4px_4px_0px_#000]">EQUIPOS</h2>
            <div className="flex gap-16">
              {[1, 2, 3].map(num => (
                <div key={num} className={`w-40 h-40 md:w-64 md:h-64 rounded-[3rem] bg-[#f5e6be] border-[8px] border-black shadow-[20px_20px_0px_0px_#000] flex items-center justify-center text-[10rem] font-black text-[#6b0f11] transition-all duration-700 transform ${visibleGroups.includes(num) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                  {num}
                </div>
              ))}
            </div>
          </div>
        );

      case 'READY':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-14 fade-in">
            <div className="bg-black/80 p-20 rounded-full border-[10px] border-[#f4d03f] animate-pulse shadow-[0_0_50px_rgba(244,208,63,0.3)]">
              <h1 className="text-[12rem] font-black text-[#f4d03f] tracking-tighter leading-none uppercase">¡LISTAS!</h1>
            </div>
            <button 
              onClick={() => setGameState('QUESTION')}
              className="group flex items-center gap-6 px-16 py-8 bg-[#f4d03f] hover:bg-[#e4c02f] text-black border-4 border-black rounded-full text-5xl font-black transition-all shadow-[12px_12px_0px_0px_#000] transform hover:scale-110"
            >
              ¡YA! <ArrowRight className="w-16 h-16 group-hover:translate-x-5 transition-transform" />
            </button>
          </div>
        );

      case 'QUESTION':
      case 'ANSWER':
        const currentQ = QUESTIONS[currentIdx];
        const isAnswerMode = gameState === 'ANSWER';
        return (
          <div className="flex flex-col h-full justify-center items-center py-8 fade-in relative px-4">
            <div className="w-full max-w-5xl flex justify-between items-end mb-10">
              <div className="bg-black px-8 py-3 rounded-2xl border-4 border-[#f4d03f] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)]">
                <span className="text-[#f5e6be] font-black text-2xl uppercase tracking-widest">{currentIdx + 1} / {QUESTIONS.length}</span>
              </div>
              <div className="flex gap-6">
                {[1, 2, 3].map(id => (
                  <div key={id} className="bg-[#f5e6be] px-6 py-2 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_#000] flex items-center gap-3">
                    <span className="text-sm font-black text-[#6b0f11]">E{id}</span>
                    <span className="text-3xl font-black text-[#6b0f11]">{scores[id]}</span>
                  </div>
                ))}
              </div>
            </div>

            <BulbBorder>
              <h2 className="text-3xl md:text-5xl font-black text-[#6b0f11] mb-14 leading-tight text-center">{currentQ.q}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                {currentQ.options.map((option) => {
                  const letter = option.trim().charAt(0);
                  const isCorrect = isAnswerMode && letter === currentQ.correct;
                  return (
                    <div key={option} className={`p-6 rounded-[2rem] border-4 border-black transition-all text-2xl font-black flex items-center justify-between shadow-[8px_8px_0px_0px_#000] ${isCorrect ? 'bg-green-400 text-black scale-[1.05]' : isAnswerMode ? 'bg-black/10 text-black/20 shadow-none scale-95' : 'bg-white/60 text-[#6b0f11] hover:bg-white/80'}`}>
                      <span>{option}</span>
                      {isCorrect && <CheckCircle2 className="w-10 h-10 text-black" />}
                    </div>
                  );
                })}
              </div>
              {!isAnswerMode ? (
                <div className="flex justify-center">
                  <button onClick={() => setGameState('ANSWER')} className="group flex items-center gap-6 px-16 py-7 bg-[#6b0f11] hover:bg-[#4a0a0b] text-[#f4d03f] rounded-[2.5rem] border-6 border-black text-4xl font-black transition-all shadow-[12px_12px_0px_0px_#000] transform hover:-translate-y-2">
                    RESPUESTA <ArrowRight className="w-10 h-10 group-hover:translate-x-3 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                  <h3 className="text-center text-[#6b0f11]/50 font-black uppercase tracking-[0.4em] text-xs mb-8 text-center">¿A QUIÉN LE DAMOS EL PUNTO?</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3].map(id => (
                      <button key={id} onClick={() => assignPoint(id)} className="group py-6 bg-[#f4d03f] hover:bg-green-500 hover:text-black text-[#6b0f11] rounded-2xl font-black text-2xl transition-all border-4 border-black shadow-[6px_6px_0px_0px_#000] active:shadow-none active:translate-x-1 active:translate-y-1">
                        EQUIPO {id}
                      </button>
                    ))}
                    <button onClick={() => assignPoint(null)} className="py-6 bg-black/10 hover:bg-black/20 text-black/60 rounded-2xl font-black text-2xl border-4 border-black">NADIE</button>
                  </div>
                </div>
              )}
            </BulbBorder>
            <button onClick={resetGame} className="absolute bottom-4 left-4 text-white/40 hover:text-white flex items-center gap-2 text-xs font-bold transition-colors">
              <RefreshCw className="w-3 h-3" /> REINICIAR PARTIDA
            </button>
          </div>
        );

      case 'RANKING':
        const sortedScores = Object.entries(scores)
          .map(([id, score]) => ({ id: Number(id), score }))
          .sort((a, b) => b.score - a.score);
        return (
          <div className="flex flex-col items-center justify-center h-full max-w-5xl mx-auto text-center space-y-16 fade-in">
            <div className="bg-black/70 p-14 rounded-[4rem] border-8 border-[#f4d03f] shadow-[0_0_60px_rgba(244,208,63,0.4)]">
              <Trophy className="w-32 h-32 text-[#f4d03f] mx-auto animate-bounce mb-6" />
              <h1 className="text-[6rem] font-black text-[#f5e6be] uppercase leading-none tracking-tighter">¡EL REY DE LA PISTA!</h1>
            </div>
            <div className="flex items-end justify-center gap-12 w-full px-12">
              {[sortedScores[1], sortedScores[0], sortedScores[2]].map((item, idx) => {
                if (!item) return null;
                const heights = ["h-56", "h-80", "h-40"];
                const colors = ["bg-[#f5e6be]/90", "bg-[#f4d03f]", "bg-[#f5e6be]/70"];
                const labels = ["2º", "1º", "3º"];
                return (
                  <div key={item.id} className="flex flex-col items-center gap-6 flex-1 max-w-[280px]">
                    <div className="text-center bg-black p-5 rounded-3xl w-full border-4 border-[#f5e6be] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.5)]">
                       <p className="text-5xl font-black text-[#f5e6be]">{item.score} <span className="text-sm text-[#f4d03f]">PTS</span></p>
                       <p className="text-sm font-bold text-white uppercase tracking-widest mt-1">EQUIPO {item.id}</p>
                    </div>
                    <div className={`${heights[idx]} ${colors[idx]} w-full rounded-t-[3rem] border-[8px] border-black shadow-[15px_0px_0px_0px_#000] flex items-center justify-center relative transition-all duration-1000 transform`}>
                      <span className="text-8xl font-black text-black/20">{labels[idx]}</span>
                      {item.id === sortedScores[0].id && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2"><Star className="w-20 h-20 text-[#f4d03f] fill-[#f4d03f] animate-spin" /></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={resetGame} className="px-14 py-8 bg-[#f4d03f] hover:bg-[#e4c02f] text-black border-6 border-black rounded-[2.5rem] text-3xl font-black transition-all shadow-[12px_12px_0px_0px_#000] transform hover:scale-110">NUEVA PARTIDA</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-transition relative overflow-hidden" style={{ backgroundImage: getBackground() }}>
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      <main className="relative z-10 h-screen">{renderContent()}</main>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<TrivialApp />);
}
