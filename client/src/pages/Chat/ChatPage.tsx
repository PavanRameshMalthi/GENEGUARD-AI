import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ChatMessage from '@/components/features/ChatMessage';
import ChatInput from '@/components/features/ChatInput';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import Button from '@/components/ui/Button';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { chatService } from '@/services/chat.service';
import { useToast } from '@/hooks/useToast';

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
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
      const responseText = res.data?.response || res.response || 'Sorry, I could not generate a response.';
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
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <div className="flex justify-between items-center mb-4">
           <h1 className="text-2xl font-bold">Health AI Chat</h1>
           <Button variant="outline" size="sm" onClick={clearChat}>Clear Chat</Button>
        </div>
        <DisclaimerBanner />
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/30 dark:bg-gray-900/30 rounded-t-2xl mt-4">
          {loadingHistory ? (
            <div className="space-y-4 p-4">
              <LoadingSkeleton variant="text" rows={3} />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p>Start a conversation about your health</p>
            </div>
          ) : (
            messages.map(m => <ChatMessage key={m.id} message={m} isTyping={false} />)
          )}
          {isTyping && <ChatMessage message={{ id: 'typing', content: '', role: 'assistant', timestamp: new Date().toISOString() } as any} isTyping={true} />}
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-b-2xl border-t dark:border-gray-700 shadow-sm">
          <ChatInput onSend={handleSend} disabled={isTyping} suggestions={['How can I improve my sleep?', 'What foods boost immunity?', 'How much water should I drink daily?', 'Tips for managing stress', 'What exercises are good for beginners?']} />
        </div>
      </div>
    </DashboardLayout>
  );
}
