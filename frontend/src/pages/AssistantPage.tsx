import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type Message = {
  role: 'user' | 'model';
  text: string;
};

export const AssistantPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am GeneGuard AI Assistant. How can I help you with your wellness journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ message: userMsg, history: messages })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'model', text: data.text }]);
      } else {
        throw new Error();
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "How can I reduce diabetes risk?",
    "What foods improve heart health?",
    "How much water should I drink?"
  ];

  return (
    <div className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto w-full flex flex-col h-[calc(100vh-140px)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Health Assistant</h1>
        <p className="text-slate-600 dark:text-slate-400">Ask questions about your health and get AI-powered wellness advice.</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden p-0 border-slate-200 dark:border-slate-800">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
              )}
              <div className={`p-4 rounded-2xl max-w-[80%] ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-tl-none shadow-sm'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-slate-500">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {suggestedQuestions.map((q, i) => (
              <button 
                key={i}
                onClick={() => setInput(q)}
                className="whitespace-nowrap px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..." 
              className="flex-1"
            />
            <Button type="submit" disabled={!input.trim() || loading} className="px-6">
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AssistantPage;
