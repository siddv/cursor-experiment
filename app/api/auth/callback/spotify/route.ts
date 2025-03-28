import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Spotify auth error:', error);
      return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
    }

    if (!code) {
      console.error('No code received from Spotify');
      return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }

    // Exchange the code for an access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || '',
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '',
        client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || '',
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Failed to exchange code for token:', await tokenResponse.text());
      return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    
    // Store the token in a cookie (you might want to use a more secure method in production)
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('spotify_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
    });

    return response;
  } catch (error) {
    console.error('Error in Spotify callback:', error);
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
} 