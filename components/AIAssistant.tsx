
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  User, 
  Coffee, 
  Mic, 
  MicOff, 
  Loader2, 
  BrainCircuit, 
  HeartPulse, 
  ExternalLink,
  Download,
  Trash2
} from 'lucide-react';

// Pagalbinės funkcijos pagal Gemini API gaires
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

const STORAGE_KEY = 'vap_ai_chat_history';
const INITIAL_MESSAGE = { role: 'bot' as const, text: 'Sveiki. Esu Jūsų emocinė pagalvėlė 🛋️. Kai darbe tampa per karšta arba nežinote, kaip reaguoti į situaciją, aš čia. Galite man rašyti arba tiesiog išsikalbėti paspaudę mikrofono piktogramą. Kuo galiu pasitarnauti?' };

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string; audio?: string }[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Išsaugome žinutes pasikeitus būsenai
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContextRef.current;
  };

  const playAudio = async (base64Audio: string) => {
    if (isMuted) return;
    try {
      setIsSpeaking(true);
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
      
      const audioBytes = decode(base64Audio);
      const buffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
    } catch (e) {
      console.error("Audio playback error:", e);
      setIsSpeaking(false);
    }
  };

  const systemInstruction = `Esi „DI emocinė pagalvėlė“ Vilniaus Antakalnio progimnazijoje. 
  Tavo charakteris: empatiškas, raminantis, bet griežtai besilaikantis saugumo schemų. 
  REMKIS PagalbaSau.lt MEDŽIAGA: Tavo psichologiniai patarimai turėtų atspindėti PagalbaSau.lt vertybes: emocinį raštingumą, savitarpio pagalbą ir profesionalią savireguliaciją.
  STRESINĖSE SITUACIJOSE VEIK PAGAL ŠIAS SCHEMAS:
  1. UAK (Ugdymo aplinkos keitimas): Jei mokinys trukdo pamoką, pirmiausia 2-3 žodinės pastabos. Jei nepadeda - kviečiamas budintis vadovas palydėti mokinį savarankiškam darbui.
  2. SOS (Suicidinis pavojus): Nepalik mokinio vieno! Kviesk psichologą, socialinį pedagogą arba vadovą. Jei bando žalotis - skubiai 112.
  3. SMURTAS / GINČAS: Nedelsiant atskirti dalyvius. Kviesti slaugytoją ir budintį vadovą. Informuoti tėvus.
  Tavo tikslas - nuraminti mokytoją naudojant PagalbaSau.lt principais grįstą empatiją, pripažinti jo nuovargį ar stresą, ir tada pasiūlyti konkretų saugumo schemų žingsį. Atsakyk trumpai ir aiškiai.`;

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input.trim();
    if (!textToSend || isLoading) return;

    if (!textOverride) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const streamResponse = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: textToSend,
        config: { systemInstruction }
      });

      let fullBotText = "";
      setMessages(prev => [...prev, { role: 'bot', text: "" }]);

      for await (const chunk of streamResponse) {
        const textChunk = chunk.text || "";
        fullBotText += textChunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], text: fullBotText };
          return newMessages;
        });
      }
      
      setIsLoading(false);

      if (!isMuted) {
        try {
          const ttsResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: fullBotText }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
              },
            },
          });
          const audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
          if (audioBase64) {
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], audio: audioBase64 };
              return newMessages;
            });
            playAudio(audioBase64);
          }
        } catch (e) { console.warn("TTS error:", e); }
      }

    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Įvyko klaida susisiekiant su pagalvėle.' }]);
      setIsLoading(false);
    }
  };

  const startVoiceMode = async () => {
    if (isListening) {
      stopVoiceMode();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let currentInputTranscription = '';
      let currentOutputTranscription = '';

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const base64 = encode(new Uint8Array(int16.buffer));
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              currentInputTranscription += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription += message.serverContent.outputTranscription.text;
            }
            
            if (message.serverContent?.turnComplete) {
              if (currentInputTranscription) setMessages(prev => [...prev, { role: 'user', text: currentInputTranscription }]);
              if (currentOutputTranscription) setMessages(prev => [...prev, { role: 'bot', text: currentOutputTranscription }]);
              currentInputTranscription = '';
              currentOutputTranscription = '';
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && !isMuted) {
              const ctx = getAudioContext();
              if (ctx.state === 'suspended') await ctx.resume();
              
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBytes = decode(base64Audio);
              const buffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
              
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsListening(false),
          onerror: () => setIsListening(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });
      liveSessionRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const stopVoiceMode = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.then((session: any) => session.close());
    }
    setIsListening(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      for (const source of sourcesRef.current.values()) {
        try { source.stop(); } catch(e) {}
      }
      sourcesRef.current.clear();
      setIsSpeaking(false);
    }
  };

  const clearHistory = () => {
    if (confirm("Ar tikrai norite ištrinti visą pokalbių istoriją?")) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const downloadHistory = () => {
    const chatContent = messages.map(m => {
      const roleName = m.role === 'user' ? 'AŠ' : 'PAGALVĖLĖ';
      return `[${roleName}]: ${m.text}`;
    }).join('\n\n---\n\n');
    
    const blob = new Blob([`DI EMOCINĖS PAGALVĖLĖS POKALBIO ISTORIJA\nData: ${new Date().toLocaleString()}\n\n${chatContent}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VAP_Pokalbis_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-t-[2.5rem] text-white shadow-xl relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <Sparkles size={32} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">DI emocinė pagalvėlė ✨</h2>
              <div className="flex items-center space-x-2 text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-1">
                <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-400 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
                <span>{isListening ? 'Klausausi Jūsų balsu...' : 'Pasiruošusi išklausyti'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={downloadHistory}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md transition-all text-white"
              title="Atsisiųsti pokalbį"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={clearHistory}
              className="p-3 bg-white/10 hover:bg-red-500/40 rounded-2xl backdrop-blur-md transition-all text-white"
              title="Valyti istoriją"
            >
              <Trash2 size={20} />
            </button>
            <button 
              onClick={toggleMute}
              className={`p-3 rounded-2xl backdrop-blur-md transition-all ${isMuted ? 'bg-red-500/40 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
              title={isMuted ? "Įjungti garsą" : "Išjungti garsą"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white border-x border-slate-200 overflow-y-auto p-6 space-y-6 scrollbar-thin flex flex-col">
        <div className="flex-1 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 rounded-xl flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'}`}>
                  {msg.role === 'user' ? <User size={20} /> : <Coffee size={20} />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm border ${msg.role === 'user' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-50 text-slate-800 border-slate-100'}`}>
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text || (idx === messages.length - 1 && isLoading ? "..." : "")}</p>
                  {msg.audio && !isListening && (
                    <button 
                      onClick={() => playAudio(msg.audio!)} 
                      disabled={isSpeaking || isMuted} 
                      className={`mt-2 text-[10px] font-black uppercase tracking-widest flex items-center space-x-1 ${isMuted ? 'opacity-30 cursor-not-allowed' : 'opacity-70 hover:opacity-100'}`}
                    >
                      {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                      <span>{isMuted ? 'Garsas išjungtas' : isSpeaking ? 'Kalba...' : 'Paklausyti'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && !messages[messages.length-1].text && (
            <div className="flex justify-start">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center space-x-2">
                <Loader2 size={16} className="animate-spin text-purple-500" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Purenama pagalvėlė...</span>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-slate-50 p-6 rounded-b-[2.5rem] border border-slate-200 shadow-inner">
        <div className="flex items-center space-x-3">
          <button 
            onClick={startVoiceMode}
            className={`p-4 rounded-2xl shadow-lg transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-indigo-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          <div className="flex-1 flex items-center space-x-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <input 
              type="text" 
              placeholder={isListening ? "Kalbėkite..." : "Pasidalykite situacija..."}
              className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-medium disabled:opacity-50"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isListening}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading || isListening}
              className={`p-3 rounded-xl ${input.trim() && !isLoading && !isListening ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300'}`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest order-2 md:order-1">
            <div className="flex items-center space-x-1"><HeartPulse size={12} className="text-pink-500" /><span>Empatija</span></div>
            <div className="flex items-center space-x-1"><span>Saugumas</span></div>
            <div className="flex items-center space-x-1"><BrainCircuit size={12} className="text-indigo-400" /><span>DI Balso rėžimas</span></div>
          </div>
          
          <a 
            href="https://pagalbasau.lt/" 
            target="_blank" 
            className="flex items-center space-x-2 px-4 py-2 bg-white/50 border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm order-1 md:order-2"
          >
            <span>PagalbaSau.lt</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
