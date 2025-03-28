import { HistoricalEvent } from '@/types';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

async function fetchWikipediaEvents(year: number): Promise<string[]> {
  try {
    const url = new URL(WIKIPEDIA_API_URL);
    url.searchParams.append('action', 'parse');
    url.searchParams.append('page', `${year}`);
    url.searchParams.append('format', 'json');
    url.searchParams.append('prop', 'text');
    url.searchParams.append('section', '1'); // Get the "Events" section
    url.searchParams.append('origin', '*');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Wikipedia API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Wikipedia API response:', data); // Debug log

    if (!data.parse?.text?.['*']) {
      console.error('No content found in Wikipedia response');
      return [];
    }

    // Extract events from the HTML content
    const htmlContent = data.parse.text['*'];
    const eventMatches = htmlContent.match(/<li>(.*?)<\/li>/g) || [];
    
    // Clean up the events
    const events = eventMatches
      .map((event: string) => event.replace(/<[^>]*>/g, '')) // Remove HTML tags
      .map((event: string) => event.replace(/\[\d+\]/g, '')) // Remove citation numbers
      .filter((event: string) => event.length > 10) // Filter out empty or very short events
      .slice(0, 10); // Get top 10 events

    console.log('Extracted events:', events); // Debug log
    return events;
  } catch (error) {
    console.error('Error fetching Wikipedia events:', error);
    return [];
  }
}

async function generateEventSummary(event: string): Promise<HistoricalEvent> {
  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event }),
    });

    if (!response.ok) {
      throw new Error(`Summary API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Summary API response:', data); // Debug log

    return {
      date: new Date().toISOString().split('T')[0], // We'll get the actual date from Wikipedia later
      title: data.title,
      description: data.description,
      category: data.category,
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    return {
      date: new Date().toISOString().split('T')[0],
      title: event.split('.')[0],
      description: event,
      category: 'History',
    };
  }
}

export async function getHistoricalEvents(year: number): Promise<HistoricalEvent[]> {
  try {
    const events = await fetchWikipediaEvents(year);
    console.log(`Found ${events.length} events for year ${year}`); // Debug log

    if (events.length === 0) {
      return [];
    }

    const summaries = await Promise.all(
      events.slice(0, 5).map((event) => generateEventSummary(event))
    );

    return summaries;
  } catch (error) {
    console.error('Error in getHistoricalEvents:', error);
    return [];
  }
} 