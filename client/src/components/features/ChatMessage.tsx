import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';
import { ChatMessageType } from '@/types';

interface ChatMessageProps {
  message?: ChatMessageType;
  isTyping?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isTyping }) => {
  if (isTyping) {
    return (
      <div className="flex justify-start mb-4">
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <Bot size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1 h-[44px]">
            <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
            <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
            <motion.div className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!message) return null;

  const isUser = message.role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex items-end gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
          {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-gray-500 dark:text-gray-400" />}
        </div>
        <div className={`px-4 py-3 rounded-2xl ${
          isUser 
            ? 'bg-primary-500 text-white rounded-br-none shadow-md shadow-primary-500/20' 
            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-gray-700 shadow-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
