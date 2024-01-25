import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { fanyi } from './controllers/fanyi';
import { ip } from './controllers/ip';
import { base64 } from './controllers/image-to-base64';

const app = new Hono()

const allowedOrigins = ['http://localhost:52804', 'http://localhost:3000', 'https://tools.w3cub.com'];

app.use(
  '/api/*',
  cors({
    origin: allowedOrigins,
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.get('/', (c) => {
  return c.text('it work!')
})

app.get('/api/fanyi', fanyi)
app.get('/api/ip', ip)
app.get('/api/image-to-base64', base64)

export default app
