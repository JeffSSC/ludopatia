/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Home, 
  HeartPulse, 
  Handshake, 
  RotateCw, 
  AlertTriangle,
  Info,
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { Wheel } from 'react-custom-roulette';

type TokenType = 'Familia' | 'Casa' | 'Amigos' | 'Saude';

interface TokenData {
  id: TokenType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TOKENS: TokenData[] = [
  { 
    id: 'Familia', 
    label: 'Família', 
    icon: <Users />, 
    description: 'Vínculos afetivos e suporte emocional.'
  },
  { 
    id: 'Casa', 
    label: 'Patrimônio', 
    icon: <Home />, 
    description: 'Segurança financeira e estabilidade do lar.'
  },
  { 
    id: 'Amigos', 
    label: 'Amigos', 
    icon: <Handshake />, 
    description: 'Ciclo social e reputação.'
  },
  { 
    id: 'Saude', 
    label: 'Saúde', 
    icon: <HeartPulse />, 
    description: 'Equilíbrio físico e mental.'
  },
];

const QUESTIONS = [
  "Como a mídia contribui para a manutenção do vício?",
  "Impactos na vida do viciado e familiares?",
  "Como os sites de apostas atraem você?",
  "O que é ludopatia?"
];

// Textos curtos que cabem visualmente nas fatias da roleta
const WHEEL_LABELS = [
  "A Mídia e o Vício",
  "Impactos na Vida",
  "Atração e Gatilhos",
  "Ludopatia"
];

// Map questions to roulette data
const WHEEL_DATA = WHEEL_LABELS.map((q) => ({
  option: q,
  style: { backgroundColor: '#111111', textColor: '#FFFFFF' }
}));

export default function App() {
  const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);
  const [lostTokens, setLostTokens] = useState<TokenType[]>([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [resultQuestion, setResultQuestion] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const aiPromiseRef = useRef<Promise<string> | null>(null);

  const fetchAiResponse = async (token: TokenType, question: string): Promise<string> => {
    return new Promise((resolve) => {
      // Simula um delay de processamento da IA para manter a animação fluida (3 segundos)
      setTimeout(() => {
        let baseText = "";
        
        switch (question) {
          case "Como a mídia contribui para a manutenção do vício?":
            baseText = "A mídia normaliza o comportamento de apostar através de propagandas constantes, muitas vezes associadas a esportes, influenciadores e promessas de dinheiro fácil. Isso cria uma falsa sensação de segurança e glamour, ocultando os reais riscos de ruína financeira e psicológica que acompanham o vício em apostas. A mídia não mostrará a sua dor, mas você a sentirá profundamente na pele.";
            break;
          case "Impactos na vida do viciado e familiares?":
            baseText = "O vício destrói a confiança, consome economias de uma vida e gera um ambiente hostil repleto de mentiras e desespero. O viciado perde a noção da realidade, priorizando o jogo acima de tudo, enquanto a família sofre dia e noite com a instabilidade financeira e o abalo emocional de ver um ente querido adoecer. O impacto não é apenas financeiro, é a desintegração total do lar.";
            break;
          case "Como os sites de apostas atraem você?":
            baseText = "As plataformas utilizam gatilhos psicológicos altamente estudados: cores vibrantes, bônus de boas-vindas irresistíveis, a ilusão de controle e a falsa sensação constante de que a próxima jogada será a grande virada e irá pagar os prejuízos. O design é milimetricamente feito para manter você apostando em transe, ignorando as perdas reais e materiais. O sistema foi desenhado para ganhar, e a sua perda contínua é o que o mantém rodando.";
            break;
          case "O que é ludopatia?":
            baseText = "A ludopatia é uma doença psiquiátrica grave e reconhecida pela OMS, caracterizada pelo impulso incontrolável e obsessivo de jogar compulsivamente, mesmo diante de graves e nítidas consequências negativas na vida pessoal, profissional e financeira. É uma dependência comportamental tão destrutiva quanto a química. A ludopatia não se trata de 'falta de caráter' ou 'desvio de conduta', é uma condição mental limitante que exige tratamento psicológico sério e imediato.";
            break;
          default:
            baseText = "O vício consome tudo o que é valoroso, não importa quanto você ache que está no controle da situação. Ao final, a banca sempre vence, enquanto a sua vida real desmorona fora das telas, sem que você nem perceba.";
        }

        const tokenLower = token.toLowerCase();
        const fullResponse = `Nesta aposta fatal, você decidiu colocar seu bem mais precioso em jogo e, como a casa sempre ganha, o preço dessa lição foi a sua ${tokenLower}. ${baseText}`;

        resolve(fullResponse);
      }, 3000); // 3 second mock delay
    });
  };

  const handleSpinClick = () => {
    if (!selectedToken || mustSpin) return;
    
    // Fixed sequence instead of random
    const newPrizeNumber = questionIndex % QUESTIONS.length;
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setAiResponse(null);
    setResultQuestion(null);

    // Start fetching AI response immediately while spinning
    aiPromiseRef.current = fetchAiResponse(selectedToken, QUESTIONS[newPrizeNumber]);
  };

  const handleSpinStop = async () => {
    setMustSpin(false);
    const question = QUESTIONS[prizeNumber];
    setResultQuestion(question);
    
    if (selectedToken) {
      setLostTokens(prev => [...prev, selectedToken]);
    }

    // Use pre-fetched response or wait for it
    setIsLoadingAi(true);
    try {
      if (aiPromiseRef.current) {
        const text = await aiPromiseRef.current;
        setAiResponse(text);
      }
    } finally {
      setIsLoadingAi(false);
      setSelectedToken(null);
      aiPromiseRef.current = null;
      setQuestionIndex(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#00FF00] selection:text-black overflow-x-hidden flex flex-col p-0 m-0 relative">
      <style>
        {`
          @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(0, 255, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
          }
          .animate-pulse-green {
            animation: pulse-green 2s infinite;
          }
          @keyframes pulse-white {
            0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.2); }
            70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
          }
          .animate-pulse-white {
            animation: pulse-white 2s infinite;
          }
        `}
      </style>
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#00FF00] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 opacity-10" />
      </div>

      {/* Header */}
      <header className="p-4 md:p-6 flex justify-between items-center max-w-7xl mx-auto w-full relative z-10 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#00FF00] rounded-sm transform -skew-x-12 shadow-[0_0_15px_rgba(0,255,0,0.3)] border border-white/10">
            <TrendingDown className="text-black w-5 h-5" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase leading-none">BET<span className="text-[#00FF00]">VOID</span></h1>
        </div>
        
        <div className="flex gap-4">
          <div className="hidden md:flex flex-col items-end">
            <p className="text-[8px] uppercase tracking-widest text-gray-500 font-bold mb-1">Humanidade Restante</p>
            <div className="flex gap-1">
              {TOKENS.map(t => (
                <div key={t.id} className={`w-2 h-2 rounded-full border transition-all ${lostTokens.includes(t.id) ? 'bg-red-600 border-red-900 shadow-[0_0_8px_#ef4444]' : 'bg-[#00FF00] border-green-900 shadow-[0_0_8px_#00ff00]'}`} />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 md:py-12 flex-grow flex items-center justify-center relative z-10 min-h-0 overflow-x-hidden">
        
        <AnimatePresence mode="wait">
          {!aiResponse ? (
            <motion.div 
              key="main-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full"
            >
              {/* Left Column: Token Selection */}
              <div className="flex flex-col justify-center max-w-lg mx-auto lg:mx-0 w-full">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic">
                      Qual será sua <br /> 
                      <span className="text-[#00FF00] drop-shadow-[0_0_15px_rgba(0,255,0,0.3)]">próxima aposta?</span>
                    </h2>
                    <p className="text-gray-400 max-w-sm text-xs border-l-2 border-white/10 pl-4 py-1 italic">
                      No vício em apostas, você joga com os pilares da sua vida. Escolha o que você está disposto a perder agora.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {TOKENS.map((token) => {
                      const isLost = lostTokens.includes(token.id);
                      const isSelected = selectedToken === token.id;

                      return (
                        <button
                          key={token.id}
                          disabled={isLost || mustSpin}
                          onClick={() => setSelectedToken(token.id)}
                          className={`
                            relative group p-3 rounded-lg border transition-all duration-300 flex items-center gap-4 text-left w-full
                            ${isLost ? 'bg-gray-900/10 border-transparent opacity-30 grayscale cursor-not-allowed' : 
                              isSelected ? 'bg-white/[0.08] border-[#00FF00] shadow-[0_0_20px_rgba(0,255,0,0.1)] translate-x-1' : 
                              'bg-white/[0.03] border-white/5 hover:border-white/20 active:translate-y-0.5'}
                          `}
                        >
                          <div className={`
                            p-2.5 rounded-lg transition-colors shrink-0
                            ${isLost ? 'bg-gray-800 text-gray-600' : isSelected ? 'bg-[#00FF00] text-black shadow-[0_0_10px_rgba(0,255,0,0.3)]' : 'bg-black/40 text-white/50'}
                          `}>
                            {React.cloneElement(token.icon as React.ReactElement, { className: 'w-5 h-5' })}
                          </div>
                          
                          <div className="flex-grow">
                            <h3 className={`font-black text-sm tracking-tight ${isLost ? 'text-gray-600' : isSelected ? 'text-white' : 'text-gray-300'}`}>
                              {token.label}
                            </h3>
                          </div>

                          {isLost && (
                            <div className="rotate-12 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter rounded-sm mr-2 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                              PERDIDO
                            </div>
                          )}
                          
                          {isSelected && !isLost && (
                            <div className="w-1.5 h-1.5 bg-[#00FF00] rounded-full animate-pulse mr-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                    <Info className="text-yellow-500 w-4 h-4 shrink-0" />
                    <p className="text-[10px] text-yellow-500/60 font-bold uppercase tracking-tight italic">O vício não perdoa. Cada escolha é irreversível.</p>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Roulette */}
              <div className="flex flex-col items-center justify-center relative w-full mx-auto lg:mt-0">
                <div className={`flex flex-col items-center gap-8 md:gap-12 transition-all duration-700 ${aiResponse ? 'opacity-20 blur-sm scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                  <div id="roulette-container" className="relative p-3 rounded-full border-4 border-white/5 bg-black/40 shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden flex items-center justify-center">
                    <Wheel
                      mustStartSpinning={mustSpin}
                      prizeNumber={prizeNumber}
                      data={WHEEL_DATA}
                      onStopSpinning={handleSpinStop}
                      backgroundColors={['#050505', '#111111']}
                      textColors={['#00FF00']}
                      outerBorderColor="#1A1A1A"
                      outerBorderWidth={4}
                      innerBorderColor="#00FF00"
                      innerRadius={15}
                      radiusLineColor="#222222"
                      radiusLineWidth={1}
                      fontSize={14}
                      perpendicularText={true}
                      textDistance={75}
                    />
                    
                    {/* Center Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-[#050505] border-2 border-white/10 shadow-[0_0_20px_rgba(0,0,0,1)] flex items-center justify-center">
                        <RotateCw className={`w-6 h-6 ${mustSpin ? 'text-[#00FF00] animate-spin' : 'text-gray-700'}`} />
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={!selectedToken || mustSpin}
                    onClick={handleSpinClick}
                    className={`
                      w-full max-w-[280px] py-5 px-8 rounded-full font-black uppercase tracking-[0.2em] text-sm transition-all shadow-[0_10px_40px_rgba(0,255,0,0.1)] border-2
                      ${!selectedToken || mustSpin ? 
                        'bg-gray-900 border-gray-800 text-gray-700 opacity-50 cursor-not-allowed' : 
                        'bg-[#00FF00] border-black text-black hover:scale-105 active:scale-95 animate-pulse-green'}
                    `}
                  >
                    {mustSpin ? 'Processando...' : 'APOSTAR AGORA'}
                  </button>

                  <div className="text-center">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-gray-700 font-bold italic">The house always wins in the end.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="response-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="max-w-5xl w-full flex flex-col items-center text-center space-y-8 py-6 md:py-12"
            >
              <div className="space-y-4">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-red-600 text-white text-[10px] font-black px-4 py-1 uppercase tracking-widest inline-block skew-x-[-15deg]"
                >
                  CONSEQUÊNCIA DA ESCOLHA
                </motion.div>
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight italic text-[#00FF00] drop-shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                  "{resultQuestion}"
                </h3>
              </div>

              <div className="relative w-full max-w-4xl px-4">
                <div className="p-8 md:p-12 bg-white/[0.03] border border-white/5 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden min-h-[180px] flex items-center justify-center">
                  {isLoadingAi ? (
                    <div className="flex flex-col items-center justify-center text-[#00FF00] uppercase font-black tracking-widest text-xs italic space-y-4">
                      <RotateCw className="w-8 h-8 animate-spin" />
                      <span>Processando impacto psicológico...</span>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white leading-relaxed font-sans font-medium text-lg md:text-2xl italic text-center px-4"
                    >
                      {aiResponse}
                    </motion.div>
                  )}
                </div>
                <div className="absolute -top-6 -left-6 opacity-10 pointer-events-none">
                  <AlertTriangle className="w-24 h-24 text-white" />
                </div>
              </div>

              <button 
                onClick={() => {
                  setResultQuestion(null);
                  setAiResponse(null);
                }}
                className="group relative px-12 py-6 bg-white text-black font-black uppercase tracking-[0.2em] text-lg hover:bg-[#00FF00] transition-all flex items-center justify-center gap-4 rounded-sm animate-pulse-white shadow-[0_15px_40px_rgba(255,255,255,0.1)] active:translate-y-1"
              >
                Dobrar a aposta <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full bg-black/40 border-t border-white/5 py-6 px-8 relative shrink-0 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <motion.div
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="space-y-0.5"
          >
            <h3 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic text-white/80">
              "NÃO IMPORTA O QUE GANHAR, <br className="md:hidden" />
              <span className="text-[#00FF00] px-2 shadow-[0_0_20px_rgba(0,255,0,0.1)]">VOCÊ SEMPRE SAI PERDENDO</span>"
            </h3>
          </motion.div>
          
          <div className="flex flex-col items-center gap-1">
            <p className="text-xl md:text-2xl font-black uppercase tracking-tight text-red-600 animate-pulse bg-red-600/10 px-4 py-1 rounded-sm">
              BUSQUE AJUDA! LIGUE 188
            </p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black">Saúde Mental é Prioridade. CVV.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
