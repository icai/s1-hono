import { Context, HonoRequest } from 'hono';
import { IpApiError, Ipapi, Ipinfo, cfIp, standardIp } from '../types/ip';


export const formatIpapi = (res: Ipapi) => {
  const { ip, country_name, country_code, city, region, latitude, longitude, org, timezone } = res
  return {
    ip,
    country_name,
    country_code,
    city,
    region,
    latitude,
    longitude,
    org,
    timezone
  } as standardIp
}
export const formatIpinfo = (res: Ipinfo) => {
  const { ip, country, city, region, loc, org, timezone } = res
  const [latitude, longitude]: number[] = loc.split(',').map(item => Number(item.trim()))
  return {
    ip,
    country_name: country,
    country_code: country,
    city,
    region,
    latitude,
    longitude,
    org,
    timezone
  } as standardIp
}


export const formatCfIp = (res: cfIp, ip: string) => {
  const { country, city, region, latitude, longitude,  timezone } = res
  return {
    ip,
    country_name: country,
    country_code: country,
    city,
    region,
    latitude: Number(latitude),
    longitude: Number(longitude),
    org: '',
    timezone
  } as standardIp
}

export async function ip(c: Context) {
  const env = c.env
  console.log(env)
  const clientIP = c.req.header("CF-Connecting-IP") as string;
  const ip = c.req.query('ip')
  if (!ip) {
    const geo = c.req.raw.cf;
    if (!geo) {
      let ip = clientIP
      // if (!ip) {
      //   // @ts-ignore
      //   ip = c.req.ip as string;
      // }
      // if (!ip) {
      //   ip = c.req.header('x-forwarded-for') as string;
      // }
      // if (!ip) {
      //   ip = c.req.header('x-real-ip') as string;
      // }
      // if (!ip) {
      //   ip = c.req.header('remote_addr') as string;
      // }
      // if (!ip) {
      //   ip = c.req.header('client_ip') as string;
      // }
      // if (!ip) {
      //   ip = c.req.header('fastly-client-ip') as string;
      // }
      // if (!ip) {
      //   ip = c.req.header('true-client-ip') as string;
      // }
      // if (!ip) {
      //   ip = c.req.header('x-true-client-ip') as string;
      // }
      // if (!ip) {
      //   ip = c.req.header('x-visitor-ip') as string;
      // }
      return c.json({
        ip: ip || 'unknown',
        country_name: 'unknown',
        country_code: 'unknown',
        city: 'unknown',
        region: 'unknown',
        latitude: 0,
        longitude: 0,
        org: 'unknown',
        timezone: 'unknown'
      } as standardIp)
    }
    const cfObj = formatCfIp(geo, clientIP);
    return c.json(cfObj);
  }
  try {
    // query another server api
    // use ipinfo.io/61.144.45.18?token=[TOKEN]
    const proxyUrl = `https://ipinfo.io/${encodeURIComponent(
      ip
    )}?token=[TOKEN]`;
    const headers = {
      accept: '*/*',
      'cache-control': 'no-cache'
    };
    const proxyResponse = await fetch(proxyUrl, {
      method: 'GET',
      headers: headers
    });
    const res: Ipinfo = await proxyResponse.json()
    const formatRes = formatIpinfo(res)
    return c.json(formatRes)
  } catch (error) { 
    try {
      const proxyUrl = `https://ipapi.co/${encodeURIComponent(
        ip
      )}/json/`;
      const headers = {
        accept: '*/*',
        'cache-control': 'no-cache'
      };
      const proxyResponse = await fetch(proxyUrl, {
        method: 'GET',
        headers: headers
      });
      const res: (Ipapi & IpApiError) = await proxyResponse.json()
      if (res.error) {
        throw new Error(res.reason)
      }
      const formatRes = formatIpapi(res)
      return c.json(formatRes)
    } catch (error) {
  
    }
  }
}
