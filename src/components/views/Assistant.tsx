import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Info, Sparkles, Trash2 } from 'lucide-react';
import type { ChatMessage } from '@/types';
import { uid } from '@/utils/helpers';
import { generateDemoResponse } from '@/utils/assistant';

interface AssistantProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const SUGGESTIONS = [
  'How do I study more effectively?',
  'Help me plan my exam week',
  'I feel overwhelmed with my tasks',
  'Tips for staying focused?',
];

export function Assistant({ messages, setMessages }: AssistantProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content,
      timestamp: Date.now(),
      isDemo: false,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateDemoResponse(content);
      const aiMsg: ChatMessage = {
        id: uid(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
        isDemo: true,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 600 + Math.random() * 400);
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="space-y-4 animate-slide-up flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            AI Assistant
          </h2>
          <p className="text-sm text-gray-400 mt-1">Study tips, productivity advice & motivation</p>
        </div>
        {messages.length > 0 && (
          <button onClick={handleClear} className="btn-ghost flex items-center gap-2 text-sm">
            <Trash2 size={16} />
            Clear
          </button>
        )}
      </div>

      {/* Demo banner */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <Info size={16} className="text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90">
          <span className="font-semibold">Demo Mode:</span> Responses are generated from built-in logic, not a real AI API.
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 glass-card p-4 overflow-y-auto space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-4 glow-purple">
              <Bot size={28} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">How can I help you today?</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Ask me about study strategies, productivity tips, planning your day, or motivation.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 max-w-lg w-full">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all hover:scale-[1.02]"
                >
                  <Sparkles size={14} className="inline mr-2 text-purple-400" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-blue-600/30 text-blue-300'
                      : 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                  }`}
                >
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-blue-600/20 text-white rounded-tr-sm'
                        : 'bg-white/5 text-gray-200 rounded-tl-sm border border-white/10'
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.isDemo && (
                    <div className="mt-1 text-[10px] text-amber-400/60 flex items-center gap-1">
                      <Info size={10} />
                      Demo response — not from a real AI API
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything about studying, productivity, or planning..."
          className="input-field flex-1"
          maxLength={500}
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="btn-primary flex items-center gap-2 px-4"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
