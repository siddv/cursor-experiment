interface Window {
  Spotify: {
    Player: new (options: {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    }) => {
      addListener: (event: string, callback: (data: any) => void) => void;
      connect: () => Promise<boolean>;
      disconnect: () => void;
      togglePlay: () => Promise<void>;
      nextTrack: () => Promise<void>;
      previousTrack: () => Promise<void>;
    };
  };
} 