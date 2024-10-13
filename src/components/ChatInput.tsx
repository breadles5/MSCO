import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY > window.innerHeight - 60) {
        setIsVisible(true);
      } else if (!inputRef.current?.contains(e.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`fixed bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 py-2 flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow bg-gray-700 text-white rounded-l-md px-4 py-2 focus:outline-none"
          onFocus={() => setIsVisible(true)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-r-md px-4 py-2 hover:bg-blue-600 focus:outline-none"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;