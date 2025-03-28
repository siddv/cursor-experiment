import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { event } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes historical events into a title, description, and category. The category should be one of: Politics, Technology, Science, Culture, Sports, or Other."
        },
        {
          role: "user",
          content: `Please summarize this historical event into a title, description, and category: ${event}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const response = completion.choices[0].message.content;
    const [title, description, category] = response?.split('\n') || [];

    return NextResponse.json({
      title: title?.replace('Title: ', '') || event.split('.')[0],
      description: description?.replace('Description: ', '') || event,
      category: category?.replace('Category: ', '') || 'History',
    });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
} 