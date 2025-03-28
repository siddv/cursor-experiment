'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SpotifyPlaylist as SpotifyPlaylistType } from '@/types';

interface SpotifyPlaylistProps {
  playlist: SpotifyPlaylistType;
}

export default function SpotifyPlaylist({ playlist }: SpotifyPlaylistProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error in URL
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      switch (error) {
        case 'auth_failed':
          setError('Authentication failed. Please try again.');
          break;
        case 'no_code':
          setError('No authorization code received. Please try again.');
          break;
        case 'token_exchange_failed':
          setError('Failed to complete authentication. Please try again.');
          break;
        case 'server_error':
          setError('A server error occurred. Please try again later.');
          break;
        default:
          setError('An error occurred. Please try again.');
      }
    }

    // Check if we have a Spotify token
    fetch('/api/auth/check')
      .then(response => response.json())
      .then(data => setIsAuthenticated(data.authenticated))
      .catch(error => {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      });
  }, []);

  const handleSpotifyLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
    const scope = 'user-read-private user-read-email playlist-read-private';

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', clientId || '');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri || '');
    authUrl.searchParams.append('scope', scope);

    window.location.href = authUrl.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6"
    >
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 rounded-lg text-white text-sm">
          {error}
        </div>
      )}
      
      <div className="aspect-square relative mb-4">
        <img
          src={playlist.imageUrl}
          alt={playlist.name}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
          {!isAuthenticated ? (
            <button
              onClick={handleSpotifyLogin}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Connect Spotify
            </button>
          ) : (
            <a
              href={playlist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
            >
              Open in Spotify
            </a>
          )}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{playlist.name}</h3>
      <p className="text-white/80 text-sm">
        {!isAuthenticated
          ? 'Connect your Spotify account to access this playlist'
          : 'Click to open this playlist in Spotify'}
      </p>
    </motion.div>
  );
} 