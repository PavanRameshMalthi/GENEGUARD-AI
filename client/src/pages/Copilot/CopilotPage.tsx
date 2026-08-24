import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Paperclip,
  RotateCcw,
  Copy,
  Check,
  Dna
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import EmergencyAlertModal from '@/components/features/EmergencyAlertModal';
import { copilotService } from '@/services/copilot.service';
import { useToast } from '@/hooks/useToast';

interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedActions?: string[];
  category?: string;
  isEmergency?: boolean;
  timestamp: string;
}

export default function CopilotPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');
  
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your **GeneGuard AI Assistant**. I synthesize your genetic traits, diagnostic reports, and biometric trends to answer your preventive health questions.\n\nWhat would you like to explore today?',
      suggestedActions: [
        'Explain my latest report',
        'What do my results mean?',
        'Summarize my genetic profile',
        'How can I improve my health score?'
      ],
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [emergencyAlert, setEmergencyAlert] = useState<{ isOpen: boolean; message?: string; type?: string }>({ isOpen: false });
  const { error: showError } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const initializedQuery = useRef(false);

  useEffect(() => {
    if (initialQuery && !initializedQuery.current) {
      initializedQuery.current = true;
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const res = await copilotService.chat(query, messages.slice(-6));
      if (res.data) {
        const { text, safety, suggestedActions, category } = res.data;

        if (safety?.isEmergency) {
          setEmergencyAlert({
            isOpen: true,
            message: safety.emergencyMessage || text,
            type: safety.emergencyType
          });
        }

        const aiMsg: CopilotMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: text,
          suggestedActions: suggestedActions || [],
          category: category || 'lifestyle',
          isEmergency: safety?.isEmergency,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err: any) {
      showError(err.response?.data?.message || 'AI Assistant could not respond right now.');
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'I encountered an issue processing your query. Please verify your connection or try again in a moment.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Session refreshed. How can I assist you with your genetic or medical data?',
        suggestedActions: [
          'Explain my latest report',
          'What do my results mean?',
          'Summarize my genetic profile'
        ],
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const defaultPills = [
    'Explain my latest report',
    'What do my results mean?',
    'Summarize my genetic profile',
    'How can I improve my health score?'
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-4xl mx-auto pb-8">
        
        {/* Header (Reference Design 5) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>AI Assistant</span>
              <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Ask anything about your genetics, reports, or health insights.
            </p>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClear} 
            icon={<RotateCcw size={13} />}
            className="text-xs font-semibold self-start sm:self-auto"
          >
            New Chat
          </Button>
        </div>

        {/* Quick Suggestion Pills (Reference Design 5) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {defaultPills.map((pill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(pill)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all whitespace-nowrap shadow-xs cursor-pointer"
            >
              {pill}
            </button>
          ))}
        </div>

        <DisclaimerBanner />

        {/* Chat Feed Card (Reference Design 5) */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-sm flex flex-col h-[560px] overflow-hidden">
          
          {/* Scrollable Conversation Stream */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
                    <Dna size={16} />
                  </div>
                )}

                <div className={`max-w-xl space-y-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed transition-colors ${
                      m.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-sm shadow-sm'
                        : m.isEmergency
                        ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-200 rounded-tl-sm'
                        : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700/60 rounded-tl-sm shadow-xs'
                    }`}
                  >
                    <ReactMarkdown className="prose dark:prose-invert text-xs sm:text-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5">
                      {m.content}
                    </ReactMarkdown>

                    {m.role === 'assistant' && (
                      <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-end gap-2 text-slate-400">
                        <button
                          type="button"
                          onClick={() => handleCopy(m.id, m.content)}
                          className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                          title="Copy response"
                        >
                          {copiedId === m.id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Contextual Suggested Actions */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 justify-start">
                      {m.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(action)}
                          className="px-3 py-1 text-[11px] font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold">
                    U
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-slate-400 text-xs p-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center animate-pulse">
                  <Dna size={16} />
                </div>
                <span>Analyzing your genetic & biometric context...</span>
              </div>
            )}
          </div>

          {/* Bottom Chat Input Bar (Reference Design 5) */}
          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center gap-2 flex-1 px-4 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <button
                  type="button"
                  title="Attach report"
                  onClick={() => showError('Select reports via the Reports page to analyze.')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 cursor-pointer"
                >
                  <Paperclip size={16} />
                </button>
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={loading}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shadow-sm shadow-indigo-500/20 transition-all shrink-0 cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </div>

        </div>

        {/* Emergency Alert Modal */}
        <EmergencyAlertModal
          isOpen={emergencyAlert.isOpen}
          onClose={() => setEmergencyAlert({ isOpen: false })}
          message={emergencyAlert.message}
          emergencyType={emergencyAlert.type}
        />

      </div>
    </DashboardLayout>
  );
}
