import React, { useState, useEffect, useCallback } from 'react';
import ChatOverlay from './components/ChatOverlay';
import OAuthButtons from './components/OAuthButtons';
import { fetchYouTubeChats, fetchTwitchChats, sendMessage } from './api/chatApi';
import { ChatMessage } from './types';
import { handleOAuthCallback, checkOAuthStatus } from './utils/oauth';

function App() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [oauthStatus, setOauthStatus] = useState(checkOAuthStatus());

  const fetchChats = useCallback(async () => {
    if (oauthStatus.youtube || oauthStatus.twitch) {
      const youtubeChats = oauthStatus.youtube ? await fetchYouTubeChats() : [];
      const twitchChats = oauthStatus.twitch ? await fetchTwitchChats() : [];
      
      const allChats = [...youtubeChats, ...twitchChats].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setChatMessages(allChats);
    }
  }, [oauthStatus]);

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  useEffect(() => {
    if (oauthStatus.youtube || oauthStatus.twitch) {
      fetchChats();
      const interval = setInterval(fetchChats, 5000); // Fetch every 5 seconds
      return () => clearInterval(interval);
    }
  }, [oauthStatus, fetchChats]);

  const handleSendMessage = async (message: string) => {
    try {
      await sendMessage(message);
      const newMessage: ChatMessage = {
        username: 'You',
        content: message,
        timestamp: new Date().toISOString(),
        privilegeLevel: 'regular',
        platform: 'both'
      };
      setChatMessages(prevMessages => [newMessage, ...prevMessages]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleOAuthStatusChange = useCallback((status: { youtube: boolean; twitch: boolean }) => {
    setOauthStatus(status);
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="fixed top-4 right-4 z-10">
        <OAuthButtons onStatusChange={handleOAuthStatusChange} />
      </div>
      <ChatOverlay messages={chatMessages} onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;