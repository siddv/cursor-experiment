'use client';

import { useState, useEffect } from 'react';
import YearSelector from '@/components/YearSelector';
import HistoricalEvents from '@/components/HistoricalEvents';
import SpotifyPlaylist from '@/components/SpotifyPlaylist';
import { getDecadeTheme } from '@/utils/themeConfig';
import { getHistoricalEvents } from '@/utils/historicalData';
import { getPlaylistForYear } from '@/utils/playlistConfig';
import { YearData, HistoricalEvent, SpotifyPlaylist as SpotifyPlaylistType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [yearData, setYearData] = useState<YearData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<SpotifyPlaylistType | null>(null);

  useEffect(() => {
    const fetchYearData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch historical events and create playlist config in parallel
        const [events, playlistConfig] = await Promise.all([
          getHistoricalEvents(currentYear),
          Promise.resolve(getPlaylistForYear(currentYear))
        ]);

        if (events.length === 0) {
          setError('No historical events found for this year.');
          return;
        }

        const mockPlaylist: SpotifyPlaylistType = {
          name: playlistConfig.name,
          url: playlistConfig.url,
          imageUrl: `https://source.unsplash.com/random/400x400/?music,${currentYear}`,
        };

        setYearData({
          events,
          theme: getDecadeTheme(currentYear),
          playlist: mockPlaylist,
        });
        setPlaylist(mockPlaylist);
      } catch (error) {
        console.error('Error fetching year data:', error);
        setError('Failed to load historical events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchYearData();
  }, [currentYear]);

  return (
    <main
      className="min-h-screen p-8"
      style={{
        background: yearData?.theme.backgroundPattern || getDecadeTheme(currentYear).backgroundPattern,
        fontFamily: yearData?.theme.fontFamily || getDecadeTheme(currentYear).fontFamily,
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Time Travel Journal</h1>
          <YearSelector
            onYearSelect={setCurrentYear}
            currentYear={currentYear}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/20 backdrop-blur-md rounded-xl p-4 text-white text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Historical Events</h2>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading-events"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-8 border-l-2 border-white/20"
                    >
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white/20" />
                      <div className="mb-2">
                        <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                        <div className="mt-2 h-4 w-16 bg-white/10 rounded animate-pulse" />
                      </div>
                      <div className="h-6 w-3/4 bg-white/10 rounded animate-pulse mb-2" />
                      <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                    </motion.div>
                  ))}
                </motion.div>
              ) : yearData ? (
                <motion.div
                  key="events"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <HistoricalEvents events={yearData.events} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Music of the Era</h2>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading-playlist"
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
              ) : playlist ? (
                <motion.div
                  key="playlist"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SpotifyPlaylist playlist={playlist} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
