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
  ShieldAlert,
  Ear,
  UserCheck,
  MessageCircle,
  Clock,
  Layout
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

const STORAGE_KEY = 'vap_ai_live_transcripts_v6';

interface Message {
  role: 'user' | 'bot';
  text: string;
  type?: 'text' | 'voice';
  timestamp: string;
}

const QUICK_PROMPTS: Record<string, { label: string, prompt: string, icon: React.ReactNode }[]> = {
  contacts: [
    { label: "Kur psichologas?", prompt: "Padėk surasti psichologą ir pasakyk jo kabineto numerį.", icon: <BrainCircuit size={14} /> },
    { label: "Budintis vadovas", prompt: "Kas šiandien mokinių saugumu besirūpinantis ugdymo vadovas?", icon: <ShieldAlert size={14} /> }
  ],
  templates: [
    { label: "Uniformos laiškas", prompt: "Sukurk laišką dėl uniformos.", icon: <UserCheck size={14} /> },
    { label: "Patyčios", prompt: "Kaip pranešti apie patyčias?", icon: <ShieldAlert size={14} /> }
  ],
  scenarios: [
    { label: "Fizinis ginčas", prompt: "Ką daryti kilus fiziniam ginčui?", icon: <ShieldAlert size={14} /> },
    { label: "SOS algoritmas", prompt: "SOS suicidinis elgesys.", icon: <Zap size={14} /> }
  ],
  dashboard: [
    { label: "Nusiraminimas", prompt: "Pasiūlyk atsipalaidavimo pratimą.", icon: <Coffee size={14} /> },
    { label: "Dienos patarimas", prompt: "Trumpas patarimas psichologinei higienai.", icon: <Sparkles size={14} /> }
  ]
};

interface AIAssistantProps {
  contextTab?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ contextTab = 'dashboard' }) => {
  const [isActive, setIsActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const now = new Date().toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' });
    return saved ? JSON.parse(saved) : [{ 
      role: 'bot', 
      text: `Sveiki! Esu VAP DI emocinė pagalvėlė. Matau, kad domitės emocine pagalba. Kaip galėčiau Jums padėti šią akimirką?`,
      timestamp: now
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
  const gainNodeRef = useRef<GainNode | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const micStreamRef = useRef<MediaStream | null>(null);

  const getContextSpecificData = () => {
    switch (contextTab) {
      case 'contacts': return `Specialistai: ${INITIAL_SPECIALISTS.map(s => s.name).join(', ')}.`;
      case 'templates': return `Laiškų kategorijos: ${Array.from(new Set(INITIAL_TEMPLATES.map(t => t.category))).join(', ')}.`;
      default: return `Vilniaus Antakalnio progimnazijos kontekstas.`;
    }
  };

  const systemPrompt = `Esi Vilniaus Antakalnio progimnazijos (VAP) skaitmeninis asistentas – „DI pagalvėlė“. 
Tavo tikslas – teikti greitą, profesionalią ir empatišką pagalbą mokytojams bei personalui.
Kontekstas: ${getContextSpecificData()}.
Tavo tonas: mandagus, palaikantis, konstruktyvus, akademiškas, bet šiltas.
Atsakymai: trumpi, aiškūs, orientuoti į konkrečių VAP procedūrų (UAK, PEPIS) paaiškinimą.
Jei vartotojas mini krizę ar didelį stresą, pirmiausia pasiūlyk trumpą nusiraminimo techniką arba nurodyk psichologą.`;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(isMuted ? 0 : 1, audioContextOutRef.current?.currentTime || 0, 0.1);
    }
  }, [isMuted]);

  const stopSession = () => {
    if (liveSessionRef.current) { liveSessionRef.current.close(); liveSessionRef.current = null; }
    if (micStreamRef.current) { micStreamRef.current.getTracks().forEach(t => t.stop()); micStreamRef.current = null; }
    sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
    sourcesRef.current.clear();
    setIsActive(false);
  };

  const startSession = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (!audioContextInRef.current) audioContextInRef.current = new AudioContext({ sampleRate: 16000 });
      if (!audioContextOutRef.current) {
        audioContextOutRef.current = new AudioContext({ sampleRate: 24000 });
        gainNodeRef.current = audioContextOutRef.current.createGain();
        gainNodeRef.current.connect(audioContextOutRef.current.destination);
      }
      
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
            const now = new Date().toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' });
            if (m.serverContent?.inputTranscription) setCurrentInput(p => p + m.serverContent!.inputTranscription!.text);
            if (m.serverContent?.outputTranscription) setCurrentOutput(p => p + m.serverContent!.outputTranscription!.text);
            if (m.serverContent?.turnComplete) {
              setMessages(p => [...p, { role: 'user', text: currentInput || "...", type: 'voice', timestamp: now }, { role: 'bot', text: currentOutput || "...", type: 'voice', timestamp: now }]);
              setCurrentInput(''); setCurrentOutput('');
            }
            const audio = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audio) {
              const ctx = audioContextOutRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audio), ctx, 24000, 1);
              const s = ctx.createBufferSource();
              s.buffer = buffer; 
              s.connect(gainNodeRef.current!);
              s.addEventListener('ended', () => sourcesRef.current.delete(s));
              s.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(s);
            }
            if (m.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} }); 
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsActive(false),
          onerror: () => stopSession()
        }
      });
      liveSessionRef.current = await sessionPromise;
    } catch (e) { alert("Mikrofonas būtinas."); }
  };

  const handleSendText = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText.trim();
    if (!textToSend || isGenerating) return;
    const now = new Date().toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' });
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend, type: 'text', timestamp: now }]);
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUžklausa: ${textToSend}` }] }]
      });
      setMessages(prev => [...prev, { role: 'bot', text: response.text || "Atsiprašau, įvyko ryšio klaida.", type: 'text', timestamp: now }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Šiuo metu negaliu atsakyti. Patikrinkite ryšį.", timestamp: now }]);
    } finally { setIsGenerating(false); }
  };

  const activePrompts = QUICK_PROMPTS[contextTab] || QUICK_PROMPTS.dashboard;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden transition-all duration-500">
      
      {/* Header with improved hierarchy */}
      <div className={`px-8 py-5 flex items-center justify-between transition-all duration-1000 ${isActive ? 'bg-emerald-800' : 'bg-slate-900'} text-white relative overflow-hidden`}>
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/50 to-emerald-900/50 animate-pulse pointer-events-none" />
        )}
        <div className="flex items-center space-x-5 relative z-10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${isActive ? 'bg-white text-emerald-800 border-white/40 scale-105 rotate-3' : 'bg-white/10 text-white/50 border-white/10'}`}>
            {isActive ? <Waves size={28} className="animate-pulse" /> : <Sparkles size={24} />}
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-[900] tracking-tight uppercase leading-none">DI Pagalvėlė</h2>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
              <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em] leading-none">VAP ASISTENTAS</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 relative z-10">
          <button 
            onClick={() => { if(confirm("Ar tikrai norite ištrinti visą pokalbį?")) setMessages([]); }} 
            className="p-3 hover:bg-white/10 rounded-2xl text-white/30 hover:text-white transition-all group"
            title="Išvalyti"
          >
            <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Conversation Area */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 bg-slate-50/10 scrollbar-thin">
        {/* Quick Prompts - Floating Pills */}
        <div className="flex space-x-3 overflow-x-auto pb-6 no-scrollbar -mx-2 px-2">
          {activePrompts.map((p, i) => (
            <button 
              key={i} 
              onClick={() => handleSendText(p.prompt)} 
              className="flex-shrink-0 flex items-center space-x-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-[800] text-slate-600 hover:border-emerald-600 hover:text-emerald-800 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-sm group"
            >
              <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors">{p.icon}</div>
              <span className="uppercase tracking-widest">{p.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-8 max-w-3xl mx-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
              <div className={`flex items-end space-x-3 max-w-[88%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs shadow-md border-2 transition-transform hover:scale-110 ${m.role === 'user' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-emerald-700 border-emerald-50'}`}>
                  {m.role === 'user' ? <Zap size={18} /> : <Heart size={18} />}
                </div>
                <div className="flex flex-col space-y-1">
                  <div className={`px-6 py-4 rounded-[1.75rem] text-[15px] font-bold leading-relaxed shadow-sm border ${m.role === 'user' ? 'bg-slate-900 text-white rounded-br-none border-slate-800' : 'bg-white text-slate-800 border-slate-100 rounded-bl-none'}`}>
                    {m.text}
                    {m.type === 'voice' && (
                      <div className="mt-3 pt-3 flex items-center space-x-2 border-t border-current/10">
                        <Ear size={12} className="opacity-30" />
                        <span className="text-[9px] uppercase font-[900] tracking-[0.2em] opacity-30">Balso atpažinimas</span>
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center space-x-1.5 px-2 text-[9px] font-black uppercase tracking-widest text-slate-300 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <Clock size={10} />
                    <span>{m.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex justify-start items-center space-x-4 animate-pulse">
               <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100"><Loader2 className="animate-spin text-emerald-600" size={18} /></div>
               <div className="space-y-1">
                  <span className="text-[10px] font-[900] uppercase tracking-[0.3em] text-emerald-600/50">DI Pagalvėlė galvoja</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-emerald-300 rounded-full animate-bounce" style={{animationDelay: '0s'}} />
                    <div className="w-1 h-1 bg-emerald-300 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                    <div className="w-1 h-1 bg-emerald-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                  </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Control Bar - Sleek Glassmorphism */}
      <div className="px-8 py-8 bg-white border-t border-slate-100 shadow-[0_-15px_50px_rgba(0,0,0,0.03)] z-20">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="flex items-center space-x-4">
            {/* Input Bar */}
            <div className="flex-1 relative group">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') handleSendText(); }}
                placeholder="Rašykite klausimą čia..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 text-[15px] font-[700] outline-none focus:border-emerald-600 focus:bg-white focus:shadow-xl focus:shadow-emerald-900/5 transition-all duration-300 placeholder-slate-300"
              />
              <button 
                onClick={() => handleSendText()} 
                disabled={!inputText.trim() || isGenerating} 
                className={`absolute right-2.5 top-2.5 p-3.5 rounded-2xl transition-all transform active:scale-90 ${inputText.trim() ? 'bg-emerald-700 text-white shadow-lg hover:bg-emerald-800' : 'text-slate-300 cursor-not-allowed opacity-50'}`}
              >
                <Send size={22} />
              </button>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all border-2 active:scale-90 ${isMuted ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-inner' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border-slate-100 hover:border-slate-300'}`}
                title={isMuted ? "Garsas išjungtas" : "Garsas įjungtas"}
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>

              <button 
                onClick={isActive ? stopSession : startSession} 
                className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all relative border-4 active:scale-95 ${isActive ? 'bg-rose-600 text-white border-rose-500 shadow-2xl shadow-rose-200 animate-pulse' : 'bg-emerald-700 text-white border-emerald-600 hover:bg-emerald-800 hover:scale-105 shadow-xl shadow-emerald-900/10'}`}
                title={isActive ? "Išjungti balsą" : "Kalbėti balsu"}
              >
                {isActive ? <MicOff size={28} /> : <Mic size={28} />}
                {isActive && (
                  <div className="absolute -inset-3 border-4 border-rose-400/20 rounded-[2.5rem] animate-ping" />
                )}
              </button>
            </div>
          </div>

          {/* Real-time Status Overlay */}
          {isActive && (currentInput || currentOutput) && (
            <div className="p-6 bg-emerald-50 rounded-[2rem] border-2 border-emerald-100/50 animate-in fade-in slide-in-from-bottom-4 duration-700 flex items-start space-x-4 shadow-sm backdrop-blur-sm">
               <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-200/50 mt-0.5">
                  <Waves size={20} className="animate-pulse" />
               </div>
               <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-[900] uppercase text-emerald-800 tracking-[0.25em]">DI Ryšys: Aktyvi transkripcija</span>
                     <div className="flex space-x-1 items-end h-3">
                        <div className="w-1 bg-emerald-500 animate-[bounce_1s_infinite_0s]" style={{height: '40%'}} />
                        <div className="w-1 bg-emerald-500 animate-[bounce_1s_infinite_0.2s]" style={{height: '90%'}} />
                        <div className="w-1 bg-emerald-500 animate-[bounce_1s_infinite_0.4s]" style={{height: '60%'}} />
                     </div>
                  </div>
                  <p className="text-[14px] font-[700] text-emerald-900 leading-snug italic">
                    „{currentOutput || currentInput || "Klausau Jūsų, kalbėkite..."}“
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AIAssistant;