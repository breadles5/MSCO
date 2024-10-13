import { ChatMessage } from '../types';
import axios from 'axios';
import { getAccessToken } from '../utils/oauth';

const YOUTUBE_API_URL = import.meta.env.VITE_YOUTUBE_API_URL;
const TWITCH_API_URL = import.meta.env.VITE_TWITCH_API_URL;

export const fetchYouTubeChats = async (): Promise<ChatMessage[]> => {
  try {
    const accessToken = getAccessToken('youtube');
    if (!accessToken) {
      return [];
    }
    const response = await axios.get(`${YOUTUBE_API_URL}/liveChatMessages`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.items.map((item: any) => ({
      username: item.authorDetails.displayName,
      content: item.snippet.displayMessage,
      timestamp: item.snippet.publishedAt,
      privilegeLevel: item.authorDetails.isChatOwner ? 'owner' : item.authorDetails.isChatModerator ? 'moderator' : 'regular',
      platform: 'youtube',
    }));
  } catch (error) {
    console.error('Error fetching YouTube chats:', error);
    return [];
  }
};

export const fetchTwitchChats = async (): Promise<ChatMessage[]> => {
  try {
    const accessToken = getAccessToken('twitch');
    if (!accessToken) {
      return [];
    }
    const response = await axios.get(`${TWITCH_API_URL}/chat`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.messages.map((message: any) => ({
      username: message.user.displayName,
      content: message.message,
      timestamp: message.sentAt,
      privilegeLevel: message.user.isModerator ? 'moderator' : message.user.isBroadcaster ? 'owner' : 'regular',
      platform: 'twitch',
    }));
  } catch (error) {
    console.error('Error fetching Twitch chats:', error);
    return [];
  }
};

export const sendMessage = async (message: string): Promise<void> => {
  const youtubeAccessToken = getAccessToken('youtube');
  const twitchAccessToken = getAccessToken('twitch');

  if (youtubeAccessToken) {
    try {
      await axios.post(
        `${YOUTUBE_API_URL}/liveChatMessages`,
        { snippet: { liveChatId: 'LIVE_CHAT_ID', type: 'textMessageEvent', textMessageDetails: { messageText: message } } },
        { headers: { Authorization: `Bearer ${youtubeAccessToken}` } }
      );
    } catch (error) {
      console.error('Error sending message to YouTube:', error);
    }
  }

  if (twitchAccessToken) {
    try {
      await axios.post(
        `${TWITCH_API_URL}/chat`,
        { message },
        { headers: { Authorization: `Bearer ${twitchAccessToken}` } }
      );
    } catch (error) {
      console.error('Error sending message to Twitch:', error);
    }
  }
};