import { Context } from 'hono';


export async function fanyi(c: Context) {
  // Check if the "text" parameter is present
  const text = c.req.query('text')
  if (!text) {
    return c.body('Error: Missing "text" parameter in the request.', 400, {
      'Content-Type': 'text/plain',
    });
  }
  // Construct the dynamic proxy URL
  const proxyUrl = `https://fanyi.baidu.com/gettts?lan=zh&text=${encodeURIComponent(
    text
  )}&spd=5&source=web`;

  // Define the headers for the proxy request
  const headers = {
    accept: '*/*',
    'accept-language':
      'zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ar-XB;q=0.6,ar;q=0.5',
    'cache-control': 'no-cache',
    pragma: 'no-cache',
    range: 'bytes=0-',
    'sec-ch-ua':
      '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'audio',
    'sec-fetch-mode': 'no-cors',
    'sec-fetch-site': 'same-origin',
    Referer: 'https://fanyi.baidu.com/',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // 'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
  };

  // Make the proxy request
  const proxyResponse = await fetch(proxyUrl, {
    method: 'GET',
    headers: headers
  });

  proxyResponse.headers.forEach((value, key) => {
    c.header(key, value);
  })
  
  return c.body(proxyResponse.body, proxyResponse.status, {
    statusText: proxyResponse.statusText
  });
}
