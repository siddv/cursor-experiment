import { cookies } from 'next/headers';

export async function getSpotifyToken(): Promise<string | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('spotify_token');
  const refreshToken = cookieStore.get('spotify_refresh_token');

  if (!token) {
    if (!refreshToken) {
      return null;
    }

    // Try to refresh the token
    try {
      const newToken = await refreshSpotifyToken(refreshToken.value);
      if (newToken) {
        cookieStore.set('spotify_token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 // 1 hour
        });
        return newToken;
      }
    } catch (error) {
      console.error('Error refreshing Spotify token:', error);
    }
    return null;
  }

  return token.value;
}

async function refreshSpotifyToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID || '',
        client_secret: process.env.SPOTIFY_CLIENT_SECRET || '',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { access_token } = await response.json();
    return access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

export function extractPlaylistId(url: string): string | null {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
} 