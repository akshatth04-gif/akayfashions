import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, Send, X, ArrowDown } from 'lucide-react';
import { ChatMessage } from '../types';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'bot', text: 'Step into AkayFashions. I am Elsa, your AI Stylist coordinator. Need a curated coordinate recommendation or support details?', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  // Auto scroll messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Math.floor(Math.random() * 10000),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, history: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })) })
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: 'msg-' + Math.floor(Math.random() * 10000),
        sender: 'bot',
        text: data.text || 'My stylistic signals are reflecting on this look. Tell me more?',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      // Offline mock response
      const botMsg: ChatMessage = {
        id: 'msg-' + Math.floor(Math.random() * 10000),
        sender: 'bot',
        text: 'Connection latency detected. However, our local coordinate engines suggest pairing our Classic Oversized cotton French Terry hoodies with the deep vintage washed cargo joggers and gold polarized aviators.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-xs">
      {isOpen ? (
        // Chat window panel
        <div className="w-[340px] h-[480px] bg-white border border-neutral-300 rounded shadow-2xl flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-neutral-900 text-white p-4 flex items-center justify-between border-b">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4.5 w-4.5 text-amber-500 fill-amber-500 animate-pulse" />
              <div>
                <h4 className="font-mono text-xs font-bold tracking-wider uppercase">Akay Intelligent Stylist</h4>
                <p className="text-[9px] text-zinc-400 font-mono">Elsa Lindqvist • Styling Advisor</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Lists */}
          <div ref={listRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 max-w-[85%] rounded leading-relaxed text-[11px] ${
                    msg.sender === 'user'
                      ? 'bg-zinc-900 text-white font-light'
                      : 'bg-white border rounded leading-relaxed text-stone-700 font-light whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[8px] text-stone-400 font-mono mt-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start space-y-1">
                <div className="bg-white border p-3 rounded text-zinc-400 font-mono flex items-center space-x-1">
                  <span className="inline-block animate-bounce h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  <span className="inline-block animate-bounce h-1.5 w-1.5 rounded-full bg-zinc-400 delay-100" />
                  <span className="inline-block animate-bounce h-1.5 w-1.5 rounded-full bg-zinc-400 delay-200" />
                </div>
              </div>
            )}
          </div>

          {/* Form input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t flex items-center bg-white">
            <input
              type="text"
              placeholder="Ask Elsa about sizes, cargos, returns..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 text-xs px-3 py-2 border border-neutral-200 outline-none focus:border-neutral-900 transition-colors"
            />
            <button
              type="submit"
              className="bg-neutral-900 text-white p-2 ml-1.5 hover:bg-stone-800 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : (
        // Hanging Bubble trigger
        <button
          onClick={() => setIsOpen(true)}
          className="bg-neutral-900 border border-neutral-800 text-white p-4 rounded-full flex items-center justify-center shadow-2xl hover:bg-stone-800 hover:scale-110 active:scale-95 transition-all animate-bounce"
          title="Styling Assistant Open"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-amber-500 h-2.5 w-2.5 rounded-full border border-neutral-950 animate-ping" />
        </button>
      )}
    </div>
  );
}
