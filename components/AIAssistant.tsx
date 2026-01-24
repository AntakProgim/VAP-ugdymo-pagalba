import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Coffee, 
  Trash2, 
  Heart,
  Zap,
  Send,
  Loader2,
  Waves,
  BrainCircuit,
  Info,
  MessageCircle,
  ShieldAlert,
  ArrowUpRight,
  HandHelping,
  UserCheck
} from 'lucide-react';
import { INITIAL_SPECIALISTS, INITIAL_TEMPLATES } from '../constants';

// --- Audio Helper Functions ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const STORAGE_KEY = 'vap_ai_live_transcripts_v5';

interface Message {
  role: 'user' | 'bot';
  text: string;
  type?: 'text' | 'voice';
}

const QUICK_PROMPTS: Record<string, { label: string, prompt: string, icon: React.ReactNode }[]> = {
  contacts: [
    { label: "Rask psichologą", prompt: "Padėk surasti psichologą ir pasakyk jo kabineto numerį.", icon: <BrainCircuit size={16} /> },
    { label: "Saugumo vadovas", prompt: "Kas šiandien mokinių saugumu besirūpinantis ugdymo vadovas ir koks jo telefonas?", icon: <ShieldAlert size={16} /> },
    { label: "Soc. pedagogas 5 kl.", prompt: "Kas atsakingas už 5 klasių socialinę pedagogiką?", icon: <MessageCircle size={16} /> }
  ],
  templates: [
    { label: "Laiškas dėl uniformos", prompt: "Padėk suformuluoti mandagų laišką tėvams dėl uniformos nedėvėjimo.", icon: <UserCheck size={16} /> },
    { label: "Pranešimas apie patyčias", prompt: "Kaip profesionaliai pranešti tėvams apie pastebėtas patyčias klasėje?", icon: <ShieldAlert size={16} /> },
    { label: "Lankomumo priminimas", prompt: "Sukurk trumpą priminimą tėvams dėl viršyto praleistų pamokų skaičiaus.", icon: <MessageCircle size={16} /> }
  ],
  scenarios: [
    { label: "Fizinis ginčas", prompt: "Ką daryti pirmiausia, jei klasėje kilo fizinis ginčas tarp mokinių?", icon: <ShieldAlert size={16} /> },
    { label: "Keiksmažodžiai", prompt: "Kaip tinkamai reaguoti į mokinio keiksmažodžius pamokos metu?", icon: <MessageCircle size={16} /> },
    { label: "Savižudybės grėsmė", prompt: "SOS: įtariu suicidinį elgesį. Kokie pirmieji žingsniai?", icon: <Zap size={16} /> }
  ],
  dashboard: [
    { label: "Nusiraminimo pratimas", prompt: "Esu labai pavargęs po pamokos. Pasiūlyk 1 minutės atsipalaidavimo pratimą.", icon: <Coffee size={16} /> },
    { label: "Streso valdymas", prompt: "Kaip greitai suvaldyti stresą po konflikto su mokiniu?", icon: <Heart size={16} /> },
    { label: "Savirūpos patarimas", prompt: "Duok trumpą patarimą mokytojų psichologinei higienai šiandien.", icon: <Sparkles size={16} /> }
  ]
};

interface AIAssistantProps {
  contextTab?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ contextTab = 'dashboard' }) => {
  const [isActive, setIsActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVoiceThinking, setIsVoiceThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [{ 
      role: 'bot', 
      text: `Sveiki! Esu Jūsų DI emocinė pagalvėlė. Matau, kad naršote ${
        contextTab === 'contacts' ? 'specialistų sąrašą' : 
        contextTab === 'templates' ? 'laiškų šablonus' : 
        contextTab === 'scenarios' ? 'situacijų algoritmus' : 'bendruomenės portalą'
      }. Galime pasikalbėti balsu arba raštu – kuo galiu Jums padėti šiandien?` 
    }];
  });
  
  const [isMuted, setIsMuted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const liveSessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const micStreamRef = useRef<MediaStream | null>(null);

  const getContextSpecificData = () => {
    switch (contextTab) {
      case 'contacts':
        return `Specialistai: ${INITIAL_SPECIALISTS.map(s => `${s.name} (${s.category}, kab. ${s.office})`).join(', ')}.`;
      case 'templates':
        return `Kategorijos: ${Array.from(new Set(INITIAL_TEMPLATES.map(t => t.category))).join(', ')}.`;
      case 'scenarios':
        return `Situacijos: UAK protokolas, SOS algoritmai, fizinis ginčas, suicidinis elgesys.`;
      default:
        return `Pagrindinis apžvalgos langas.`;
    }
  };

  const systemPrompt = `
    Esi „DI emocinė pagalvėlė“ Vilniaus Antakalnio progimnazijoje. 
    Teik emocinę paramą mokytojams. Būk empatiškas, ramus, kolegiškas.
    KONTEKSTAS: ${getContextSpecificData()}
    Tavo tonas: palaikantis, raminantis, nevertinantis. 
    Atsakymai tik lietuviški, trumpi, aiškūs.
  `;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stopSession = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.close();
      liveSessionRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
    sourcesRef.current.clear();
    setIsActive(false);
    setIsVoiceThinking(false);
  };

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (!audioContextInRef.current) audioContextInRef.current = new AudioContext({ sampleRate: 16000 });
      if (!audioContextOutRef.current) audioContextOutRef.current = new AudioContext({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: systemPrompt,
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            const source = audioContextInRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              sessionPromise.then(session => session.sendRealtimeInput({ media: createBlob(inputData) }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (m: LiveServerMessage) => {
            if (m.serverContent?.inputTranscription) {
              setCurrentInput(p => p + m.serverContent!.inputTranscription!.text);
              setIsVoiceThinking(true); 
            }
            if (m.serverContent?.outputTranscription) {
              setCurrentOutput(p => p + m.serverContent!.outputTranscription!.text);
              setIsVoiceThinking(false);
            }
            if (m.serverContent?.turnComplete) {
              setMessages(p => [...p, 
                { role: 'user', text: currentInput || "...", type: 'voice' }, 
                { role: 'bot', text: currentOutput || "...", type: 'voice' }
              ]);
              setCurrentInput(''); setCurrentOutput(''); setIsVoiceThinking(false);
            }
            const audio = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audio && !isMuted) {
              const ctx = audioContextOutRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audio), ctx, 24000, 1);
              const s = ctx.createBufferSource();
              s.buffer = buffer; s.connect(ctx.destination);
              s.addEventListener('ended', () => sourcesRef.current.delete(s));
              s.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(s);
            }
            if (m.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} }); 
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0; setIsVoiceThinking(false);
            }
          },
          onclose: () => setIsActive(false),
          onerror: () => stopSession()
        }
      });
      liveSessionRef.current = await sessionPromise;
    } catch (e) { alert("Mikrofono prieiga būtina norint kalbėtis balsu."); }
  };

  const handleSendText = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText.trim();
    if (!textToSend || isGenerating) return;

    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend, type: 'text' }]);
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `Atsakyk kaip emocinė pagalvėlė progimnazijoje. Kontekstas: ${systemPrompt}\n\nUžklausa: ${textToSend}` }] }]
      });
      setMessages(prev => [...prev, { role: 'bot', text: response.text || "...", type: 'text' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Atsiprašau, ryšio sutrikimas. Bandykite dar kartą po akimirkos." }]);
    } finally { setIsGenerating(false); }
  };

  const activePrompts = QUICK_PROMPTS[contextTab] || QUICK_PROMPTS.dashboard;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500 relative">
      
      {/* Premium Header */}
      <div className={`p-8 md:p-10 transition-all duration-1000 relative overflow-hidden ${isActive ? 'bg-green-700' : 'bg-slate-900'} text-white`}>
        <div className={`absolute inset-0 bg-gradient-to-br from-green-400/20 via-transparent to-blue-500/20 opacity-40 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
        <div className="absolute -top-10 -right-10 p-10 opacity-5 pointer-events-none scale-150 rotate-12">
          <Sparkles size={300} />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 transition-all duration-700 ${isActive ? 'bg-white text-green-700 border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.3)]' : 'bg-white/10 text-amber-300 border-white/10 shadow-inner'}`}>
              {isActive ? (
                <div className="flex items-end space-x-1.5 h-8">
                  <div className="w-1.5 bg-current rounded-full animate-wave h-4"></div>
                  <div className="w-1.5 bg-current rounded-full animate-wave-slow h-8"></div>
                  <div className="w-1.5 bg-current rounded-full animate-wave h-6"></div>
                </div>
              ) : (
                <HandHelping size={36} className="animate-pulse" />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight uppercase leading-none mb-2">DI Pagalvėlė</h2>
              <div className="flex items-center space-x-3">
                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${isActive ? 'bg-green-500/30 border-green-400 text-green-100' : 'bg-white/10 border-white/10 text-white/50'}`}>
                  {isActive ? 'Aktyvus pokalbis balsu' : 'Tekstinis ryšys'}
                </div>
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-ping' : 'bg-slate-500'}`} />
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  {contextTab === 'dashboard' ? 'Apžvalga' : contextTab === 'contacts' ? 'Kontaktai' : 'Kontekstas aktyvus'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className={`p-5 rounded-3xl transition-all border-2 ${isMuted ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
              title={isMuted ? "Garsas išjungtas" : "Garsas įjungtas"}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <button 
              onClick={() => { if(confirm("Išvalyti visą pokalbių istoriją?")) { setMessages([]); localStorage.removeItem(STORAGE_KEY); } }} 
              className="p-5 bg-white/5 hover:bg-rose-500/30 rounded-3xl transition-all border-2 border-white/10 text-white/60 hover:text-white"
            >
              <Trash2 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Conversational Area */}
      <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8 bg-[#F9FBFF] scrollbar-thin relative">
        
        {/* Modern Action Bar */}
        <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar items-center sticky top-0 z-10 -mx-8 px-8 bg-gradient-to-b from-[#F9FBFF] via-[#F9FBFF] to-transparent">
          {activePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendText(p.prompt)}
              className="flex-shrink-0 flex items-center space-x-4 px-6 py-4 bg-white border border-slate-200 rounded-[1.8rem] text-[12px] font-black text-slate-700 hover:border-green-600 hover:text-green-700 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 group/btn"
            >
              <div className="p-2.5 bg-slate-50 rounded-2xl group-hover/btn:bg-green-50 transition-colors shadow-inner">
                {p.icon}
              </div>
              <span className="uppercase tracking-widest">{p.label}</span>
              <ArrowUpRight size={16} className="opacity-20 group-hover/btn:opacity-100 transition-all" />
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}>
              <div className={`flex items-start space-x-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border-2 ${m.role === 'user' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-green-700 border-green-100'}`}>
                  {m.role === 'user' ? <Zap size={20} /> : <Heart size={20} />}
                </div>
                <div className={`p-6 rounded-[2.2rem] shadow-sm text-[15px] font-bold leading-relaxed ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                  {m.text}
                  {m.type === 'voice' && (
                    <div className="flex items-center space-x-2 mt-4 opacity-30 pt-3 border-t border-current/10">
                      <Waves size={12} className="animate-pulse" />
                      <span className="text-[9px] uppercase tracking-[0.2em] font-black italic">Balso įrašas</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                  <Loader2 className="animate-spin text-green-600" size={20} />
                </div>
                <span className="text-[12px] font-black uppercase tracking-widest text-slate-400">Pagalvėlė galvoja...</span>
              </div>
            </div>
          )}

          {isActive && (currentInput || currentOutput) && (
            <div className="space-y-4 pt-6 border-t-2 border-dashed border-slate-200">
              {currentInput && (
                <div className="flex justify-end opacity-40">
                  <div className="bg-slate-100 p-4 rounded-[1.5rem] text-[13px] text-slate-700 font-bold italic border border-slate-200">
                    {currentInput}...
                  </div>
                </div>
              )}
              {currentOutput && (
                <div className="flex justify-start">
                  <div className="bg-green-50 p-4 rounded-[1.5rem] text-[13px] text-green-800 font-bold border border-green-100 animate-pulse">
                    {currentOutput}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Control Panel */}
      <div className="p-8 md:p-10 bg-white border-t border-slate-100 glass-card">
        <div className="max-w-4xl mx-auto flex items-end space-x-6">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendText(); } }}
              placeholder="Jūsų mintys čia..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.2rem] px-8 py-5 text-base font-bold outline-none focus:border-green-600 focus:bg-white transition-all resize-none max-h-32 scrollbar-none"
              rows={1}
            />
            <button 
              onClick={() => handleSendText()} 
              disabled={!inputText.trim() || isGenerating} 
              className={`absolute right-4 bottom-4 p-4 rounded-2xl transition-all ${inputText.trim() ? 'bg-green-700 text-white shadow-xl hover:bg-green-800 hover:-translate-y-0.5' : 'bg-slate-100 text-slate-300'}`}
            >
              <Send size={22} />
            </button>
          </div>

          <div className="flex flex-col items-center">
            <button 
              onClick={isActive ? stopSession : startSession} 
              disabled={isGenerating} 
              className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all shadow-2xl relative group ${isActive ? 'bg-rose-500 text-white animate-pulse' : 'bg-green-700 text-white hover:bg-green-800 hover:scale-105'}`}
            >
              {isActive ? <MicOff size={32} /> : <Mic size={32} />}
              {isActive && (
                <div className="absolute -inset-4 border-4 border-rose-500/20 rounded-[3rem] animate-ping" />
              )}
            </button>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-4">Balso valdymas</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 mt-8 opacity-40">
          <Info size={14} className="text-blue-600" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Aktyvus kontekstas: <span className="text-slate-900">{contextTab}</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { height: 16px; }
          50% { height: 32px; }
        }
        @keyframes wave-slow {
          0%, 100% { height: 24px; }
          50% { height: 48px; }
        }
        .animate-wave { animation: wave 0.8s ease-in-out infinite; }
        .animate-wave-slow { animation: wave-slow 1.2s ease-in-out infinite; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AIAssistant;