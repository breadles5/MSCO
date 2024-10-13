export interface ChatMessage {
  username: string;
  content: string;
  timestamp: string;
  privilegeLevel: 'regular' | 'moderator' | 'admin' | 'owner';
  platform: 'youtube' | 'twitch';
}