import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import EmergencyAlertModal from '@/components/features/EmergencyAlertModal';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { copilotService } from '@/services/copilot.service';
import { CopilotContextSummary } from '@/types';
import { useToast } from '@/hooks/useToast';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Activity, 
  Target, 
  FileText, 
  Users, 
  ShieldAlert, 
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your **AI Health Copilot**. I analyze your assessments, daily logs, active goals, medical reports, and family history to provide personalized preventive health guidance.\n\nHow can I help optimize your health today?',
      suggestedActions: [
        'Analyze my last 7 days of metrics',
        'Review my cardiovascular and diabetes risk',
        'Formulate questions for my next doctor appointment',
        'Recommend adjustments to my daily hydration & sleep'
      ],
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextSummary, setContextSummary] = useState<CopilotContextSummary | null>(null);
  const [emergencyAlert, setEmergencyAlert] = useState<{ isOpen: boolean; message?: string; type?: string }>({ isOpen: false });
  const { error: showError } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContext();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const fetchContext = async () => {
    try {
      const res = await copilotService.getContextSummary();
      if (res.data) setContextSummary(res.data);
    } catch {
      // Ignored
    }
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
      showError(err.response?.data?.message || 'AI Health Copilot could not respond right now.');
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'I encountered an issue processing your health query. Please verify your connection or try again in a moment.',
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
        content: 'Conversation reset. What health topic or biometrics would you like to review?',
        suggestedActions: [
          'Analyze my last 7 days of metrics',
          'Review my cardiovascular and diabetes risk',
          'Formulate questions for my next doctor appointment'
        ],
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <DashboardLayout title="AI Health Copilot">
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Sparkles size={14} /> Multi-Source Clinical Assistant
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              AI Health Copilot
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleClear} icon={<RotateCcw size={14} />}>
            Reset Session
          </Button>
        </div>

        <DisclaimerBanner />

        {/* Live Patient Context Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Card glass className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600">
              <Bot size={18} />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Health Score</span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                {contextSummary?.healthScore ? `${contextSummary.healthScore}/100` : 'Assessed'}
              </span>
            </div>
          </Card>

          <Card glass className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
              <Activity size={18} />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Daily Logs</span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                {contextSummary?.trackingDaysCount || 0} recent days
              </span>
            </div>
          </Card>

          <Card glass className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600">
              <Target size={18} />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Active Goals</span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                {contextSummary?.activeGoalsCount || 0} in progress
              </span>
            </div>
          </Card>

          <Card glass className="p-3.5 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600">
              <FileText size={18} />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Lab Reports</span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                {contextSummary?.reportsCount || 0} recorded
              </span>
            </div>
          </Card>

          <Card glass className="p-3.5 flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600">
              <Users size={18} />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Family Lineage</span>
              <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                {contextSummary?.familyMembersCount || 0} relatives
              </span>
            </div>
          </Card>
        </div>

        {/* Chat Feed */}
        <div className="rounded-3xl border border-gray-200/80 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-lg flex flex-col h-[560px] overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-primary-500/20">
                    <Bot size={18} />
                  </div>
                )}

                <div className={`max-w-2xl space-y-2.5 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-4.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-primary-600 text-white rounded-tr-none'
                        : m.isEmergency
                        ? 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-950 dark:text-red-200 rounded-tl-none'
                        : 'bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-800 shadow-sm rounded-tl-none'
                    }`}
                  >
                    <ReactMarkdown className="prose dark:prose-invert text-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1">
                      {m.content}
                    </ReactMarkdown>
                  </div>

                  {/* Suggested Action Chips */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 justify-start">
                      {m.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(action)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/40 hover:bg-primary-100 dark:hover:bg-primary-900/60 transition-all flex items-center gap-1.5"
                        >
                          <Sparkles size={12} className="text-primary-500" />
                          <span>{action}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-9 h-9 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center justify-center shrink-0 text-xs font-bold">
                    You
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-gray-400 text-xs p-2">
                <div className="w-7 h-7 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-500 flex items-center justify-center animate-pulse">
                  <Bot size={16} />
                </div>
                <span>GeneGuard Copilot is synthesizing your health metrics...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white/90 dark:bg-gray-900/90 border-t border-gray-200/80 dark:border-gray-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask your Copilot (e.g., 'How can I lower my cholesterol based on my lab results?')"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500/30"
            />
            <Button
              onClick={() => handleSend()}
              loading={loading}
              disabled={!inputMessage.trim() || loading}
              icon={<Send size={16} />}
              className="px-5 py-3 rounded-2xl"
            >
              Ask
            </Button>
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
