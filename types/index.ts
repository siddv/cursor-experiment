export interface HistoricalEvent {
  date: string;
  title: string;
  description: string;
  category: string;
}

export interface DecadeTheme {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  backgroundPattern: string;
}

export interface SpotifyPlaylist {
  name: string;
  url: string;
  imageUrl: string;
}

export interface YearData {
  events: HistoricalEvent[];
  theme: DecadeTheme;
  playlist: SpotifyPlaylist;
} 