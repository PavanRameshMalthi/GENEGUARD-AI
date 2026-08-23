import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ChatMessage from '@/components/features/ChatMessage';
import ChatInput from '@/components/features/ChatInput';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import EmergencyAlertModal from '@/components/features/EmergencyAlertModal';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { chatService } from '@/services/chat.service';
import { useToast } from '@/hooks/useToast';
import { Sparkles, Trash2 } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [emergencyAlert, setEmergencyAlert] = useState<{ isOpen: boolean; message?: string }>({ isOpen: false });
  const { error: showError } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const loadHistory = async () => {
    try {
      const res = await chatService.getHistory();
      const history = res.data || res || [];
      setMessages(Array.isArray(history) ? history.map((m: any, i: number) => ({
        id: m._id || `hist-${i}`,
        content: m.content,
        role: m.role === 'assistant' ? 'assistant' : 'user',
        timestamp: m.timestamp
      })) : []);
    } catch {
      // History load failed — start fresh
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async (text: string) => {
    const userMsg = { id: `user-${Date.now()}`, content: text, role: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await chatService.sendMessage(text);
      const responseData = res.data || res;
      const responseText = responseData?.response || 'Sorry, I could not generate a response.';
      
      // AI Safety Check
      if (
        responseData?.safety?.isEmergency || 
        responseText.includes('CALL 911') || 
        responseText.includes('IMMEDIATE MEDICAL ATTENTION')
      ) {
        setEmergencyAlert({
          isOpen: true,
          message: responseText
        });
      }

      const aiMsg = { id: `ai-${Date.now()}`, content: responseText, role: 'assistant' };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to get AI response. Please try again.';
      showError(errorMsg);
      const aiMsg = { id: `ai-${Date.now()}`, content: 'Sorry, I encountered an error. Please try again.', role: 'assistant' };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const clearChat = async () => {
    try {
      await chatService.clearHistory();
      setMessages([]);
    } catch {
      setMessages([]);
    }
  };

  return (
    <DashboardLayout title="Health AI Chat">
      <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto space-y-4">
        <div className="flex justify-between items-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 rounded-3xl border border-gray-200/80 dark:border-gray-800/80 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider mb-0.5">
              <Sparkles size={14} /> AI Health Intelligence
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
              Health AI Chat
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={clearChat} icon={<Trash2 size={14} />}>
            Clear History
          </Button>
        </div>

        <DisclaimerBanner />

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm custom-scrollbar">
          {loadingHistory ? (
            <div className="space-y-4 p-4">
              <LoadingSkeleton variant="text" rows={3} />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm space-y-2">
              <Sparkles size={32} className="text-primary-500 opacity-60" />
              <p>Start a conversation about preventive wellness, diet, or sleep.</p>
            </div>
          ) : (
            messages.map(m => <ChatMessage key={m.id} message={m} isTyping={false} />)
          )}
          {isTyping && <ChatMessage message={{ id: 'typing', content: '', role: 'assistant', timestamp: new Date().toISOString() } as any} isTyping={true} />}
        </div>

        <div className="p-4 bg-white/90 dark:bg-gray-900/90 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-lg">
          <ChatInput onSend={handleSend} disabled={isTyping} suggestions={['How can I improve my sleep quality?', 'What foods boost heart health?', 'How much water should I drink daily?', 'Tips for managing work stress', 'What exercises are best for beginners?']} />
        </div>

        {/* Emergency Safety Alert Modal */}
        <EmergencyAlertModal
          isOpen={emergencyAlert.isOpen}
          onClose={() => setEmergencyAlert({ isOpen: false })}
          message={emergencyAlert.message}
        />
      </div>
    </DashboardLayout>
  );
}
