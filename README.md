# Time Travel Journal

A modern web application that allows users to explore historical events and music from different years. Built with Next.js and deployed on Netlify.

## Features

- Year selection with decade-based theming
- Historical events timeline
- Spotify playlist integration for each era
- Responsive design
- Smooth animations and transitions

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd cursor-experiment
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Netlify

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Log in to [Netlify](https://www.netlify.com/) and click "New site from Git".

3. Choose your Git provider and select the repository.

4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

5. Click "Deploy site".

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback/spotify
```

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Spotify Web API

## License

MIT
