import { google } from 'googleapis';
import 'dotenv/config';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY, // Make sure you have this key in your .env file
});

export async function findBestYouTubeVideos(query, maxResults = 2) {
  try {
    const response = await youtube.search.list({
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: maxResults,
      order: 'relevance', // 'relevance' is often better than 'viewCount' for specific educational topics
      videoDefinition: 'high',
      // videoCategoryId: '27', // Commented out to broaden the search and include great tutorials that might not be categorized as "Education".
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items.map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
      }));
    }
    // Return an empty array if no results are found
    return [];
  } catch (error) {
    // Log the error but don't crash the entire application
    console.error('Error fetching YouTube videos:', error.message);
    // Return an empty array as a safe fallback
    return [];
  }
}