import React from 'react';
import { ChatMessage } from '../types';
import { Shield, User, Crown, AlertCircle, CheckCircle } from 'lucide-react';
import ChatInput from './ChatInput';

interface ChatOverlayProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

const ChatOverlay: React.FC<ChatOverlayProps> = ({ messages, onSendMessage }) => {
  // ... (keep the existing code)

  return (
    <>
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-60px)]">
        {/* ... (keep the existing message rendering code) */}
      </div>
      <ChatInput onSendMessage={onSendMessage} />
    </>
  );
};

export default ChatOverlay;