import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ChevronDown, Send, Bot, Loader2, Settings, Sparkles, Briefcase, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface ChatHistory {
  role: "user" | "assistant";
  content: string;
}

type PersonalityTone = "friendly" | "professional" | "playful" | "concise";

const PERSONALITY_OPTIONS: { value: PersonalityTone; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "friendly", label: "Friendly", icon: <MessageCircle className="w-4 h-4" />, desc: "Warm & approachable" },
  { value: "professional", label: "Professional", icon: <Briefcase className="w-4 h-4" />, desc: "Formal & precise" },
  { value: "playful", label: "Playful", icon: <Sparkles className="w-4 h-4" />, desc: "Fun & energetic" },
  { value: "concise", label: "Concise", icon: <Zap className="w-4 h-4" />, desc: "Brief & direct" },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [personality, setPersonality] = useState<PersonalityTone>("friendly");
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Hi there! I'm Basma, your AI companion for Tree'd. I'm here to help you discover how we're transforming museum experiences through conversational AI. Whether you're curious about our screen-free Handsets, the Tree hub, or our analytics Dashboard—ask me anything!",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    const userMsg = { 
      text: userMessage, 
      isBot: false, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const history: ChatHistory[] = messages
        .slice(1)
        .map(m => ({
          role: m.isBot ? "assistant" as const : "user" as const,
          content: m.text
        }));

      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          history,
          personality
        })
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      
      const botMsg = { 
        text: data.response, 
        isBot: true, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMsg = { 
        text: "I'm having a little trouble connecting right now. Please try again in a moment!", 
        isBot: true, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalityChange = (newPersonality: PersonalityTone) => {
    setPersonality(newPersonality);
    setShowSettings(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-[380px] max-h-[80vh] h-[600px] glass rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border-white/10"
          >
            <div className="p-6 bg-gradient-to-r from-primary/20 to-primary/5 border-b border-white/5 flex justify-between items-center backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Bot className="w-7 h-7 text-black" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-[#121212]"></div>
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Basma</h4>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[10px] text-primary uppercase tracking-widest font-bold">
                      {isLoading ? "Thinking..." : PERSONALITY_OPTIONS.find(p => p.value === personality)?.label || "Friendly"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setShowSettings(!showSettings)} 
                  className={`hover:bg-white/10 p-2 rounded-xl transition-colors ${showSettings ? 'bg-white/10 text-primary' : 'text-zinc-400 hover:text-white'}`}
                  data-testid="button-settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="hover:bg-white/10 p-2 rounded-xl transition-colors text-zinc-400 hover:text-white"
                  data-testid="button-close-chat"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-zinc-900/80 border-b border-white/5"
                >
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-widest font-bold text-zinc-500 mb-3">Personality</p>
                    <div className="grid grid-cols-2 gap-2">
                      {PERSONALITY_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handlePersonalityChange(option.value)}
                          className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
                            personality === option.value
                              ? "bg-primary text-black"
                              : "bg-white/5 text-zinc-300 hover:bg-white/10"
                          }`}
                          data-testid={`button-personality-${option.value}`}
                        >
                          {option.icon}
                          <div className="text-left">
                            <p className="text-sm font-medium">{option.label}</p>
                            <p className={`text-[10px] ${personality === option.value ? "text-black/60" : "text-zinc-500"}`}>
                              {option.desc}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide bg-black/20 overscroll-contain"
              onWheel={(e) => e.stopPropagation()}
            >
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.isBot ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex ${m.isBot ? "justify-start" : "justify-end"} items-end gap-2`}
                >
                  {m.isBot && <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center mb-1 shrink-0"><Bot className="w-3.5 h-3.5 text-primary" /></div>}
                  <div className="flex flex-col gap-1 max-w-[85%]">
                    <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                      m.isBot 
                        ? "bg-zinc-900/80 text-zinc-200 border border-white/5 rounded-bl-none" 
                        : "bg-primary text-black font-medium rounded-br-none shadow-lg shadow-primary/5"
                    }`}>
                      {m.text}
                    </div>
                    <span className={`text-[9px] text-zinc-600 font-bold uppercase ${m.isBot ? "text-left ml-1" : "text-right mr-1"}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start items-end gap-2"
                >
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center mb-1 shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="p-4 rounded-3xl rounded-bl-none bg-zinc-900/80 border border-white/5">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-6 bg-zinc-900/50 border-t border-white/5 backdrop-blur-xl">
              <div className="relative flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask me anything..."
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-zinc-600 resize-none max-h-32 overflow-y-auto disabled:opacity-50"
                  style={{ height: 'auto', minHeight: '54px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                  }}
                  data-testid="input-chat-message"
                />
                <Button 
                  onClick={handleSend} 
                  size="icon" 
                  disabled={isLoading || !input.trim()}
                  className="rounded-xl w-12 h-12 bg-primary text-black hover:bg-primary/90 shrink-0 shadow-lg shadow-primary/10 disabled:opacity-50"
                  data-testid="button-send-message"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="chat-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(true)}
            className="group relative w-16 h-16 rounded-[1.5rem] bg-primary text-black shadow-2xl overflow-hidden"
            data-testid="button-open-chat"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-center h-full">
              <MessageSquare className="w-7 h-7" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
