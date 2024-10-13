import axios from 'axios';

const YOUTUBE_CLIENT_ID = import.meta.env.VITE_YOUTUBE_CLIENT_ID;
const YOUTUBE_REDIRECT_URI = import.meta.env.VITE_YOUTUBE_REDIRECT_URI;
const TWITCH_CLIENT_ID = import.meta.env.VITE_TWITCH_CLIENT_ID;
const TWITCH_REDIRECT_URI = import.meta.env.VITE_TWITCH_REDIRECT_URI;

export const initiateYouTubeOAuth = () => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${YOUTUBE_CLIENT_ID}&redirect_uri=${YOUTUBE_REDIRECT_URI}&response_type=token&scope=https://www.googleapis.com/auth/youtube.force-ssl`;
  window.location.href = authUrl;
};

export const initiateTwitchOAuth = () => {
  const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${TWITCH_CLIENT_ID}&redirect_uri=${TWITCH_REDIRECT_URI}&response_type=token&scope=chat:read chat:edit`;
  window.location.href = authUrl;
};

export const handleOAuthCallback = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const platform = window.location.pathname.includes('youtube') ? 'youtube' : 'twitch';

  if (accessToken) {
    localStorage.setItem(`${platform}_access_token`, accessToken);
    window.location.hash = '';
  }
};

export const checkOAuthStatus = () => {
  return {
    youtube: !!localStorage.getItem('youtube_access_token'),
    twitch: !!localStorage.getItem('twitch_access_token')
  };
};

export const getAccessToken = (platform: 'youtube' | 'twitch') => {
  return localStorage.getItem(`${platform}_access_token`);
};