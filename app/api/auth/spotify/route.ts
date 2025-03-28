import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3000/api/auth/callback/spotify';

export async function GET() {
  if (!SPOTIFY_CLIENT_ID) {
    return NextResponse.json({ error: 'Spotify client ID not configured' }, { status: 500 });
  }

  const scope = 'user-read-private user-read-email';
  const state = Math.random().toString(36).substring(7);
  
  // Store state in cookie for verification
  cookies().set('spotify_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 // 1 hour
  });

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('client_id', SPOTIFY_CLIENT_ID);
  authUrl.searchParams.append('scope', scope);
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('state', state);

  return NextResponse.redirect(authUrl.toString());
} 