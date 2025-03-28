interface PlaylistConfig {
  url: string;
  name: string;
}

export function getPlaylistForYear(year: number): PlaylistConfig {
  return {
    url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
    name: `Top Songs from ${year}`,
  };
} 