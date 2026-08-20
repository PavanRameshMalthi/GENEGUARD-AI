import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ChatMessage from '@/components/features/ChatMessage';
import ChatInput from '@/components/features/ChatInput';
import DisclaimerBanner from '@/components/features/DisclaimerBanner';
import Button from '@/components/ui/Button';

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now(), content: text, role: 'user' }]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, content: 'This is an AI response based on your health context.', role: 'ai' }]);
      setIsTyping(false);
    }, 1500);
  };
  
  const clearChat = () => setMessages([]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <div className="flex justify-between items-center mb-4">
           <h1 className="text-2xl font-bold">Health AI Chat</h1>
           <Button variant="outline" size="sm" onClick={clearChat}>Clear Chat</Button>
        </div>
        <DisclaimerBanner />
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/30 dark:bg-gray-900/30 rounded-t-2xl mt-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <p>Start a conversation about your health</p>
            </div>
          ) : (
            messages.map(m => <ChatMessage key={m.id} message={m} isTyping={false} />)
          )}
          {isTyping && <ChatMessage message={{ id: 'typing', content: '', role: 'ai', createdAt: new Date() } as any} isTyping={true} />}
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-b-2xl border-t dark:border-gray-700 shadow-sm">
          <ChatInput onSend={handleSend} disabled={isTyping} suggestions={['How can I improve my sleep?', 'What foods boost immunity?', 'How much water should I drink daily?', 'Tips for managing stress', 'What exercises are good for beginners?']} />
        </div>
      </div>
    </DashboardLayout>
  );
}
