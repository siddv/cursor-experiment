'use client';

import { useState, useEffect } from 'react';
import YearSelector from '@/components/YearSelector';
import HistoricalEvents from '@/components/HistoricalEvents';
import SpotifyPlaylist from '@/components/SpotifyPlaylist';
import { getDecadeTheme } from '@/utils/themeConfig';
import { getHistoricalEvents } from '@/utils/historicalData';
import { YearData, HistoricalEvent, SpotifyPlaylist as SpotifyPlaylistType } from '@/types';

export default function Home() {
  const [currentYear, setCurrentYear] = useState(2024);
  const [yearData, setYearData] = useState<YearData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYearData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching events for year:', currentYear); // Debug log
        const events = await getHistoricalEvents(currentYear);
        console.log('Fetched events:', events); // Debug log

        if (events.length === 0) {
          setError('No historical events found for this year.');
          return;
        }

        const mockPlaylist: SpotifyPlaylistType = {
          name: `Top Hits of ${currentYear}`,
          url: `https://open.spotify.com/search/${currentYear}%20hits`,
          imageUrl: `https://source.unsplash.com/random/400x400/?music,${currentYear}`,
        };

        setYearData({
          events,
          theme: getDecadeTheme(currentYear),
          playlist: mockPlaylist,
        });
      } catch (error) {
        console.error('Error fetching year data:', error);
        setError('Failed to load historical events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchYearData();
  }, [currentYear]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen p-8"
      style={{
        background: yearData?.theme.backgroundPattern,
        fontFamily: yearData?.theme.fontFamily,
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
          <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-4 text-white text-center">
            {error}
          </div>
        )}

        {yearData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Historical Events</h2>
                <HistoricalEvents events={yearData.events} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Music of the Era</h2>
                <SpotifyPlaylist playlist={yearData.playlist} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
