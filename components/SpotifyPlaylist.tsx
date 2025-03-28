'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotifyPlaylist as SpotifyPlaylistType } from '@/types';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  external_urls: {
    spotify: string;
  };
}

interface SpotifyPlaylistProps {
  playlist: SpotifyPlaylistType;
}

export default function SpotifyPlaylist({ playlist }: SpotifyPlaylistProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        const year = parseInt(playlist.name.match(/\d{4}/)?.[0] || '2024');
        const response = await fetch(`/api/spotify/search?year=${year}`);
        if (!response.ok) {
          if (response.status === 401) {
            setError('Please connect to Spotify to view songs');
            return;
          }
          throw new Error('Failed to fetch tracks');
        }
        const data = await response.json();
        setTracks(data.tracks.items);
      } catch (err) {
        setError('Failed to load tracks');
        console.error('Error fetching tracks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [playlist]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6"
    >
      <h3 className="text-xl font-semibold text-white mb-4">Top Songs from {playlist.name.match(/\d{4}/)?.[0]}</h3>
      
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg"
              >
                <div className="w-12 h-12 rounded bg-white/10 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-white/10 rounded w-1/2 animate-pulse" />
                  <div className="h-3 bg-white/10 rounded w-2/3 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p className="text-white mb-4">{error}</p>
            <a
              href="/api/auth/spotify"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Connect to Spotify
            </a>
          </motion.div>
        ) : (
          <motion.div
            key="tracks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {tracks.map((track, index) => (
              <motion.a
                key={track.id}
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <img
                  src={track.album.images[0]?.url}
                  alt={track.album.name}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <p className="text-white font-medium">{track.name}</p>
                  <p className="text-white/70 text-sm">{track.artists[0].name}</p>
                  <p className="text-white/50 text-xs">{track.album.name}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 