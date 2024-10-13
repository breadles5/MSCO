import React, { useEffect, useCallback } from 'react';
import { initiateYouTubeOAuth, initiateTwitchOAuth, checkOAuthStatus } from '../utils/oauth';

interface OAuthButtonsProps {
  onStatusChange: (status: { youtube: boolean; twitch: boolean }) => void;
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ onStatusChange }) => {
  const updateOAuthStatus = useCallback(() => {
    const status = checkOAuthStatus();
    onStatusChange(status);
  }, [onStatusChange]);

  useEffect(() => {
    updateOAuthStatus();
    // Set up an interval to check the status periodically
    const intervalId = setInterval(updateOAuthStatus, 5000);
    return () => clearInterval(intervalId);
  }, [updateOAuthStatus]);

  const handleYouTubeClick = () => {
    initiateYouTubeOAuth();
    updateOAuthStatus();
  };

  const handleTwitchClick = () => {
    initiateTwitchOAuth();
    updateOAuthStatus();
  };

  const oauthStatus = checkOAuthStatus();

  return (
    <div className="flex space-x-4">
      <button
        onClick={handleYouTubeClick}
        className={`px-4 py-2 rounded ${
          oauthStatus.youtube ? 'bg-green-500' : 'bg-red-500'
        } text-white`}
      >
        {oauthStatus.youtube ? 'YouTube Connected' : 'Connect YouTube'}
      </button>
      <button
        onClick={handleTwitchClick}
        className={`px-4 py-2 rounded ${
          oauthStatus.twitch ? 'bg-green-500' : 'bg-red-500'
        } text-white`}
      >
        {oauthStatus.twitch ? 'Twitch Connected' : 'Connect Twitch'}
      </button>
    </div>
  );
};

export default OAuthButtons;