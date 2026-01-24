
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
  Activity,
  Heart,
  MessageSquare,
  ShieldCheck,
  Zap,
  Send,
  Loader2
} from 'lucide-react';
import { INITIAL_SPECIALISTS } from '../constants';

// --- Pagalbinės funkcijos audio kodavimui/dekodavimui ---
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

const STORAGE_KEY = 'vap_ai_live_transcripts_v2';

interface Message {
  role: 'user' | 'bot';
  text: string;
  type?: 'text' | 'voice';
}

interface AIAssistantProps {
  contextTab?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ contextTab = 'dashboard' }) => {
  const [isActive, setIsActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [{ role: 'bot', text: 'Sveiki. Esu Jūsų emocinė pagalvėlė. Galite man rašyti arba paspausti mikrofoną ir pasikalbėti balsu apie tai, kaip jaučiatės.' }];
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

  const systemPrompt = `
    Esi „DI emocinė pagalvėlė“ Vilniaus Antakalnio progimnazijoje. 
    Tavo tikslas - teikti emocinę paramą mokytojams ir darbuotojams, remiantis "Pagalbasau.lt" principais: 
    empatija, raminimas, streso valdymas, savirūpą ir konstruktyvus problemų sprendimas.
    
    KONTEKSTAS: Vartotojas žiūri puslapį "${contextTab}".
    SPECIALISTAI: ${INITIAL_SPECIALISTS.map(s => s.name).join(', ')}.
    
    TAISYKLĖS:
    1. Kalbėk tik lietuviškai, šiltai, ramiai.
    2. Jei mokytojas pervargęs, pasiūlyk trumpą kvėpavimo pratimą arba "STOP" techniką.
    3. Atsakyk trumpai ir glaustai. 
    4. Niekada nemoralizuok. Būk kolegiškas palaikytojas.
    5. Jei situacija kritinė, primink apie specialistus arba 112.
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
    for (const s of sourcesRef.current) s.stop();
    sourcesRef.current.clear();
    setIsActive(false);
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
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
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
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextInRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              setCurrentInput(prev => prev + message.serverContent!.inputTranscription!.text);
            }
            if (message.serverContent?.outputTranscription) {
              setCurrentOutput(prev => prev + message.serverContent!.outputTranscription!.text);
            }

            if (message.serverContent?.turnComplete) {
              setMessages(prev => [
                ...prev, 
                { role: 'user', text: currentInput || "(Balso užklausa)", type: 'voice' },
                { role: 'bot', text: currentOutput || "(Balso atsakymas)", type: 'voice' }
              ]);
              setCurrentInput('');
              setCurrentOutput('');
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && !isMuted) {
              const ctx = audioContextOutRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const s of sourcesRef.current) s.stop();
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsActive(false),
          onerror: (e) => {
            console.error(e);
            stopSession();
          }
        }
      });
      liveSessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      alert("Nepavyko pasiekti mikrofono.");
    }
  };

  const handleSendText = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isGenerating) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg, type: 'text' }]);
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: `Atsimink šias instrukcijas: ${systemPrompt}\n\nVartotojo žinutė: ${userMsg}` }] }
        ]
      });

      const botText = response.text || "Atsiprašau, įvyko klaida.";
      setMessages(prev => [...prev, { role: 'bot', text: botText, type: 'text' }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: "Nepavyko gauti atsakymo. Bandykite dar kartą." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearHistory = () => {
    if (confirm("Ištrinti pokalbių istoriją?")) {
      setMessages([{ role: 'bot', text: 'Istorija išvalyta. Pasikalbėkime iš naujo.' }]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-700">
      {/* Header */}
      <div className={`p-6 transition-all duration-500 ${isActive ? 'bg-green-700' : 'bg-slate-900'} text-white relative`}>
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles size={140} />
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500 ${isActive ? 'bg-white text-green-700 border-white/20 animate-pulse' : 'bg-white/10 text-amber-400 border-white/10'}`}>
              {isActive ? <Activity size={24} /> : <Heart size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase leading-tight">DI EMOCINĖ PAGALVĖLĖ</h2>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">
                {isActive ? 'RYŠYS AKTYVUS | PAGALBASAU.LT' : 'TEKSTAS IR BALSAS'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={clearHistory}
              className="p-2.5 bg-white/5 hover:bg-rose-500/20 rounded-lg transition-all border border-white/5 text-white/60 hover:text-rose-200"
              title="Valyti istoriją"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2.5 rounded-lg transition-all border ${isMuted ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
              title={isMuted ? 'Garsas išjungtas' : 'Garsas įjungtas'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scrollbar-thin">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
            <div className={`flex items-start space-x-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border ${msg.role === 'user' ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-green-700 border-green-100'}`}>
                {msg.role === 'user' ? <Zap size={14} /> : <Coffee size={14} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm text-[13.5px] font-bold leading-relaxed ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                {msg.text}
                {msg.type === 'voice' && <span className="block mt-1 text-[8px] uppercase tracking-widest opacity-30">Balso transkripcija</span>}
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-2">
              <Loader2 className="animate-spin text-green-600" size={16} />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Pagalvėlė galvoja...</span>
            </div>
          </div>
        )}

        {isActive && (currentInput || currentOutput) && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            {currentInput && (
              <div className="flex justify-end opacity-50 italic">
                <div className="bg-slate-100 p-3 rounded-2xl text-[12px] text-slate-600 font-bold border border-slate-200">
                  {currentInput}...
                </div>
              </div>
            )}
            {currentOutput && (
              <div className="flex justify-start">
                <div className="bg-green-50 p-3 rounded-2xl text-[12px] text-green-800 font-bold border border-green-100 animate-pulse">
                  {currentOutput}
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto flex items-end space-x-3">
          <div className="flex-1 relative">
            <form onSubmit={handleSendText}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendText();
                  }
                }}
                placeholder="Rašykite savo mintis čia..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-green-700 focus:ring-4 focus:ring-green-700/5 transition-all resize-none max-h-32 scrollbar-none"
                rows={1}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isGenerating}
                className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all ${
                  inputText.trim() && !isGenerating ? 'bg-green-700 text-white shadow-lg' : 'bg-slate-200 text-slate-400'
                }`}
              >
                <Send size={18} />
              </button>
            </form>
          </div>

          <div className="flex flex-col items-center pb-1">
            <button 
              onClick={isActive ? stopSession : startSession}
              disabled={isGenerating}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl relative group ${
                isActive 
                  ? 'bg-rose-500 text-white hover:bg-rose-600' 
                  : 'bg-green-700 text-white hover:bg-green-800'
              }`}
            >
              {isActive ? <MicOff size={20} /> : <Mic size={20} />}
              {isActive && <span className="absolute -inset-1 border-2 border-rose-500/20 rounded-2xl animate-ping"></span>}
            </button>
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-2">Balsas</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <div className="flex items-center space-x-1.5 opacity-50">
            <MessageSquare size={12} className="text-blue-500" />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">PagalbaSau.lt</span>
          </div>
          <div className="flex items-center space-x-1.5 opacity-50">
            <ShieldCheck size={12} className="text-green-600" />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Saugus susirašinėjimas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
