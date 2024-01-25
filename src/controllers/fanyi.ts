import { Context } from 'hono';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/98.0',
  'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
  'Mozilla/5.0 (X11; Linux x86_64; rv:98.0) Gecko/20100101 Firefox/98.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/98.0.1108.62 Safari/537.36',
  'Mozilla/5.0 (Android 11; Mobile; rv:98.0) Gecko/98.0 Firefox/98.0',
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36',
  'Mozilla/5.0 (iPad; CPU OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Edge/98.0.1108.62'
];

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
