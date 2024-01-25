import { Context } from 'hono';

export async function base64(c: Context) {
  // Extract the URL parameter from the request
  const urlParam = c.req.query('url');

  // If the URL parameter is missing, respond with an error
  if (!urlParam) {
    return c.body('Missing "url" parameter', 400);
  }

  // Fetch the remote image
  const imageResponse = await fetch(urlParam);

  // If the image fetch is unsuccessful, respond with an error
  if (!imageResponse.ok) {
    return c.body('Failed to fetch remote image', imageResponse.status);
  }
  
  // Convert the image data to base64
  const imageData = await imageResponse.arrayBuffer();
  const base64Data = btoa(String.fromCharCode(...new Uint8Array(imageData)));

  // Construct the base64 data URL
  const base64DataURL = `data:${imageResponse.headers.get('content-type') || 'image/png'};base64,${base64Data}`;

  // Respond with the base64 data URL and proper CORS headers
  return c.body(base64DataURL, 200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*', // Allow requests from any origin
    'Access-Control-Allow-Methods': 'GET, OPTIONS', // Specify the allowed methods
    'Access-Control-Allow-Headers': 'Content-Type', // Specify the allowed headers
  });
}

