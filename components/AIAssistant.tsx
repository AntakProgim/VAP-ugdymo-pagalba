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
  Ear
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
    { label: "Kur psichologas?", prompt: "Padėk surasti psichologą ir pasakyk jo kabineto numerį.", icon: <BrainCircuit size={16} /> },
    { label: "Budintis vadovas", prompt: "Kas šiandien mokinių saugumu besirūpinantis ugdymo vadovas?", icon: <ShieldAlert size={16} /> },
    { label: "Soc. pedagogas", prompt: "Kas atsakingas už socialinę pedagogiką?", icon: <MessageCircle size={16} /> }
  ],
  templates: [
    { label: "Uniformos laiškas", prompt: "Padėk suformuluoti mandagų laišką tėvams dėl uniformos nedėvėjimo.", icon: <UserCheck size={16} /> },
    { label: "Patyčių pranešimas", prompt: "Kaip profesionaliai pranešti tėvams apie pastebėtas patyčias klasėje?", icon: <ShieldAlert size={16} /> },
    { label: "Lankomumas", prompt: "Sukurk trumpą priminimą tėvams dėl praleistų pamokų skaičiaus.", icon: <MessageCircle size={16} /> }
  ],
  scenarios: [
    { label: "Kilo ginčas", prompt: "Ką daryti pirmiausia, jei klasėje kilo fizinis ginčas tarp mokinių?", icon: <ShieldAlert size={16} /> },
    { label: "Mokinys keikiasi", prompt: "Kaip tinkamai reaguoti į mokinio keiksmažodžius pamokos metu?", icon: <MessageCircle size={16} /> },
    { label: "SOS algoritmas", prompt: "SOS: įtariu suicidinį elgesį. Kokie pirmieji žingsniai?", icon: <Zap size={16} /> }
  ],
  dashboard: [
    { label: "Nusiraminimas", prompt: "Pasiūlyk 1 minutės atsipalaidavimo pratimą mokytojui.", icon: <Coffee size={16} /> },
    { label: "Streso valdymas", prompt: "Kaip greitai suvaldyti stresą po konflikto su mokiniu?", icon: <Heart size={16} /> },
    { label: "Dienos patarimas", prompt: "Duok trumpą patarimą mokytojų psichologinei higienai šiandien.", icon: <Sparkles size={16} /> }
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
      text: `Sveiki! Esu Jūsų DI emocinė pagalvėlė. Matau, kad domitės ${
        contextTab === 'contacts' ? 'specialistų sąrašu' : 
        contextTab === 'templates' ? 'laiškų šablonais' : 
        contextTab === 'scenarios' ? 'situacijų algoritmais' : 'bendruomenės portalu'
      }. Galime pasikalbėti balsu arba raštu – kuo galiu padėti?` 
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
        return `UAK protokolas, SOS algoritmai, fizinis ginčas.`;
      default:
        return `Pagrindinis apžvalgos langas.`;
    }
  };

  const systemPrompt = `
    Esi „DI emocinė pagalvėlė“ Vilniaus Antakalnio progimnazijoje. 
    Teik emocinę paramą mokytojams. Būk empatiškas, ramus, kolegiškas.
    KONTEKSTAS: ${getContextSpecificData()}
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
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto bg-[#FBFBFF] rounded-[2.5rem] shadow-[0_32px_64px_rgba(0,0,0,0.1)] border border-white overflow-hidden animate-in fade-in zoom-in-95 duration-500 relative">
      
      {/* Refined Modern Header */}
      <div className={`p-8 md:p-10 transition-all duration-1000 relative overflow-hidden ${isActive ? 'bg-emerald-700' : 'bg-slate-900'} text-white`}>
        <div className={`absolute inset-0 bg-gradient-to-br from-emerald-400/30 via-transparent to-blue-500/30 opacity-40 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 p-20 opacity-[0.03] text-white pointer-events-none scale-[2] rotate-45 select-none">
          <Sparkles size={240} />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className={`w-20 h-20 rounded-[2.2rem] flex items-center justify-center border-2 transition-all duration-700 ${isActive ? 'bg-white text-emerald-700 border-white/50 shadow-[0_0_50px_rgba(255,255,255,0.4)] scale-105' : 'bg-white/10 text-amber-300 border-white/10 shadow-inner'}`}>
              {isActive ? (
                <div className="flex items-center justify-center space-x-1 h-8">
                  <div className="w-1.5 bg-current rounded-full animate-wave h-4"></div>
                  <div className="w-1.5 bg-current rounded-full animate-wave-slow h-8"></div>
                  <div className="w-1.5 bg-current rounded-full animate-wave h-5"></div>
                  <div className="w-1.5 bg-current rounded-full animate-wave-slow h-7"></div>
                </div>
              ) : (
                <HandHelping size={36} className="animate-pulse" />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight uppercase leading-none mb-2">DI Pagalvėlė</h2>
              <div className="flex items-center space-x-3">
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${isActive ? 'bg-emerald-500/40 border-emerald-400 text-emerald-50' : 'bg-white/10 border-white/10 text-white/50'}`}>
                  {isActive ? 'Balso ryšys įjungtas' : 'Tekstinis ryšys'}
                </div>
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40">
                  {contextTab === 'dashboard' ? 'Apžvalga' : contextTab === 'contacts' ? 'Kontaktai' : 'Kontekstas'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className={`p-5 rounded-[1.8rem] transition-all border-2 ${isMuted ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-white/5 text-white border-white/10 hover:bg-white/10 shadow-lg'}`}
              title={isMuted ? "Garsas išjungtas" : "Garsas įjungtas"}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <button 
              onClick={() => { if(confirm("Išvalyti visą pokalbių istoriją?")) { setMessages([]); localStorage.removeItem(STORAGE_KEY); } }} 
              className="p-5 bg-white/5 hover:bg-rose-500/40 rounded-[1.8rem] transition-all border-2 border-white/10 text-white/60 hover:text-white shadow-lg"
              title="Išvalyti"
            >
              <Trash2 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Conversation Area */}
      <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8 bg-gradient-to-b from-[#FBFBFF] to-white scrollbar-thin relative">
        
        {/* Refined Quick Actions */}
        <div className="flex overflow-x-auto pb-6 gap-3 no-scrollbar items-center sticky top-0 z-10 -mx-8 px-8 bg-gradient-to-b from-[#FBFBFF] via-[#FBFBFF] to-transparent">
          {activePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendText(p.prompt)}
              className="flex-shrink-0 flex items-center space-x-4 px-6 py-4 bg-white border border-slate-100 rounded-[1.6rem] text-[12px] font-black text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 group/btn"
            >
              <div className="p-2.5 bg-slate-50 rounded-2xl group-hover/btn:bg-emerald-50 transition-colors shadow-inner">
                {p.icon}
              </div>
              <span className="uppercase tracking-widest">{p.label}</span>
              <ArrowUpRight size={14} className="opacity-20 group-hover/btn:opacity-100 transition-all" />
            </button>
          ))}
        </div>

        {/* Dynamic Message Thread */}
        <div className="space-y-10 max-w-4xl mx-auto pb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-6 duration-700`}>
              <div className={`flex items-start space-x-5 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center flex-shrink-0 shadow-lg border-2 ${m.role === 'user' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-emerald-700 border-emerald-50'}`}>
                  {m.role === 'user' ? <Zap size={20} /> : <Heart size={20} />}
                </div>
                <div className={`p-7 rounded-[2.2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] text-[16px] font-bold leading-relaxed tracking-tight ${m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                  {m.text}
                  {m.type === 'voice' && (
                    <div className="flex items-center space-x-2 mt-4 opacity-40 pt-4 border-t border-current/10">
                      <Ear size={14} className="animate-pulse" />
                      <span className="text-[10px] uppercase tracking-widest font-black italic">Atpažinta iš balso</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start animate-in fade-in duration-500">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center space-x-4">
                <div className="relative">
                  <Loader2 className="animate-spin text-emerald-600" size={24} />
                  <div className="absolute inset-0 animate-ping bg-emerald-100 rounded-full -z-10 opacity-50" />
                </div>
                <span className="text-[12px] font-black uppercase tracking-widest text-slate-400">Pagalvėlė galvoja...</span>
              </div>
            </div>
          )}

          {/* Real-time transcription indicators */}
          {isActive && (currentInput || currentOutput) && (
            <div className="space-y-5 pt-8 border-t-2 border-dashed border-slate-100">
              {currentInput && (
                <div className="flex justify-end opacity-50">
                  <div className="bg-slate-100 p-5 rounded-[1.8rem] text-[14px] text-slate-700 font-bold italic border border-slate-200">
                    <span className="mr-2 text-emerald-600">●</span> {currentInput}
                  </div>
                </div>
              )}
              {currentOutput && (
                <div className="flex justify-start">
                  <div className="bg-emerald-50 p-5 rounded-[1.8rem] text-[14px] text-emerald-900 font-bold border border-emerald-100 animate-pulse shadow-sm">
                    {currentOutput}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Futuristic Control Center */}
      <div className="p-8 md:p-10 bg-white border-t border-slate-100 relative shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto flex items-end space-x-8">
          
          {/* Enhanced Text Input Area */}
          <div className="flex-1 relative group">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendText(); } }}
              placeholder="Jūsų mintys ar klausimai..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2.2rem] px-8 py-5 pr-20 text-[16px] font-bold outline-none focus:border-emerald-600 focus:bg-white focus:shadow-[0_0_30px_rgba(16,185,129,0.06)] transition-all resize-none max-h-32 scrollbar-none"
              rows={1}
            />
            <button 
              onClick={() => handleSendText()} 
              disabled={!inputText.trim() || isGenerating} 
              className={`absolute right-4 bottom-4 p-4 rounded-[1.4rem] transition-all transform active:scale-95 ${inputText.trim() ? 'bg-emerald-700 text-white shadow-xl hover:bg-emerald-800 hover:-translate-y-1' : 'bg-slate-200 text-slate-400'}`}
            >
              <Send size={22} />
            </button>
          </div>

          {/* Mic Control Module */}
          <div className="flex flex-col items-center">
            <button 
              onClick={isActive ? stopSession : startSession} 
              disabled={isGenerating} 
              className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all shadow-2xl relative group transform active:scale-90 ${isActive ? 'bg-rose-500 text-white' : 'bg-emerald-700 text-white hover:bg-emerald-800 hover:scale-105'}`}
            >
              {isActive ? <MicOff size={32} /> : <Mic size={32} />}
              {isActive && (
                <div className="absolute -inset-4 border-4 border-rose-500/10 rounded-[3.5rem] animate-ping" />
              )}
              {!isActive && !isGenerating && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-4 border-white animate-pulse" />
              )}
            </button>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-4">Balso valdymas</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 mt-8 opacity-40 select-none">
          <Info size={14} className="text-emerald-600" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Pokalbio kontekstas: <span className="text-slate-900">{contextTab}</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2); }
        }
        @keyframes wave-slow {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2.8); }
        }
        .animate-wave { animation: wave 1s ease-in-out infinite; transform-origin: center; }
        .animate-wave-slow { animation: wave-slow 1.4s ease-in-out infinite; transform-origin: center; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AIAssistant;