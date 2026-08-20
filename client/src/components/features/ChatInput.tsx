import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  suggestions?: string[];
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled, suggestions }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full">
      {suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => onSend(suggestion)}
              disabled={disabled}
              className="text-xs px-3 py-1.5 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <div className="relative flex items-end gap-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-2 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your health..."
          disabled={disabled}
          className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none py-3 px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="p-3 mb-1 mr-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-all duration-300"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
