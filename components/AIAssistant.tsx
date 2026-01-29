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
  UserCheck,
  Ear,
  BookOpen,
  Siren,
  ClipboardList,
  Target
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
    return saved ? JSON.parse(saved) : [{ 
      role: 'bot', 
      text: `Sveiki! Esu Jūsų DI emocinė pagalvėlė. Matau, kad domitės ${contextTab}. Kuo galiu padėti?` 
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
      default: return `Bendras mokyklos kontekstas.`;
    }
  };

  const systemPrompt = `Esi „DI emocinė pagalvėlė“. Teik emocinę paramą mokytojams. Kontekstas: ${getContextSpecificData()}. Atsakymai trumpi.`;

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
            if (m.serverContent?.inputTranscription) setCurrentInput(p => p + m.serverContent!.inputTranscription!.text);
            if (m.serverContent?.outputTranscription) setCurrentOutput(p => p + m.serverContent!.outputTranscription!.text);
            if (m.serverContent?.turnComplete) {
              setMessages(p => [...p, { role: 'user', text: currentInput || "...", type: 'voice' }, { role: 'bot', text: currentOutput || "...", type: 'voice' }]);
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
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend, type: 'text' }]);
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUžklausa: ${textToSend}` }] }]
      });
      setMessages(prev => [...prev, { role: 'bot', text: response.text || "...", type: 'text' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Ryšio klaida." }]);
    } finally { setIsGenerating(false); }
  };

  const activePrompts = QUICK_PROMPTS[contextTab] || QUICK_PROMPTS.dashboard;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto bg-white rounded-[1.5rem] shadow-xl border border-slate-100 overflow-hidden animate-in fade-in duration-300">
      
      {/* Mini Header */}
      <div className={`px-6 py-4 transition-all duration-500 flex items-center justify-between ${isActive ? 'bg-emerald-700' : 'bg-slate-900'} text-white`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isActive ? 'bg-white text-emerald-700 border-white/50' : 'bg-white/10 text-white/50 border-white/10'}`}>
            {isActive ? <Waves size={20} className="animate-pulse" /> : <Sparkles size={18} />}
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight uppercase leading-none">DI Pagalvėlė</h2>
            <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mt-1">Kontekstas: {contextTab}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button onClick={() => { if(confirm("Išvalyti?")) setMessages([]); }} className="p-2 hover:bg-white/10 rounded-lg text-white/50 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50/30 scrollbar-thin">
        {/* Compact Quick Prompts */}
        <div className="flex space-x-2 overflow-x-auto pb-4 no-scrollbar">
          {activePrompts.map((p, i) => (
            <button key={i} onClick={() => handleSendText(p.prompt)} className="flex-shrink-0 flex items-center space-x-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:border-emerald-500 transition-all shadow-sm">
              {p.icon} <span>{p.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                  {m.role === 'user' ? <Zap size={14} /> : <Heart size={14} />}
                </div>
                <div className={`px-4 py-2.5 rounded-2xl text-sm font-bold leading-relaxed ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'}`}>
                  {m.text}
                  {m.type === 'voice' && <Ear size={10} className="mt-1 opacity-30" />}
                </div>
              </div>
            </div>
          ))}
          {isGenerating && <div className="flex justify-start"><Loader2 className="animate-spin text-emerald-600" size={16} /></div>}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Modern Compact Controls */}
      <div className="px-6 py-4 bg-white border-t border-slate-100">
        <div className="flex items-center space-x-3 max-w-3xl mx-auto">
          
          {/* Text Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="Rašykite arba klauskite..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:border-emerald-600 transition-all"
            />
            <button 
              onClick={() => handleSendText()} 
              disabled={!inputText.trim()} 
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${inputText.trim() ? 'bg-emerald-700 text-white' : 'text-slate-300'}`}
            >
              <Send size={18} />
            </button>
          </div>

          {/* Voice & Sound Controls */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isMuted ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              title="Garsas"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <button 
              onClick={isActive ? stopSession : startSession} 
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all relative ${isActive ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-200' : 'bg-emerald-700 text-white hover:bg-emerald-800'}`}
              title="Balsas"
            >
              {isActive ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>

        </div>
        
        {/* Dynamic Transcription Overlay (while recording) */}
        {isActive && (currentInput || currentOutput) && (
          <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2">
             <div className="flex items-center space-x-2 mb-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[9px] font-black uppercase text-emerald-800 tracking-widest">DI Klauso / Kalba</span>
             </div>
             <p className="text-[12px] font-bold text-emerald-900 leading-tight">
               {currentOutput || currentInput || "..."}
             </p>
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AIAssistant;