import { Context, HonoRequest } from 'hono';

import { env } from 'hono/adapter'
import { IpApiError, Ipapi, Ipinfo, cfIp, standardIp } from '../types/ip';

export const formatIpapi = (res: Ipapi) => {
  const { ip, country_name, country_code, city, region, latitude, longitude, org, timezone } = res
  return {
    ip,
    country: country_name,
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
    country: country,
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
  const { country, city, region, latitude, longitude,  timezone, asOrganization } = res
  return {
    ip,
    country: country,
    country_code: country,
    city,
    region,
    latitude: Number(latitude),
    longitude: Number(longitude),
    org: asOrganization,
    timezone
  } as standardIp
}

// https://github.com/cloudflare/workers-sdk/blob/c40e7cbaa9cabbfb77e27642c70f013e052b357e/packages/miniflare/src/cf.ts#L13


export async function ip(c: Context) {
  const clientIP = c.req.header("CF-Connecting-IP") as string;
  const ip = c.req.query('ip')
  if (!ip) {
    const geo = c.req.raw.cf as cfIp;
    const cfObj = formatCfIp(geo, clientIP);
    return c.json(cfObj);
  }
  const token = env(c).IPINFO_TOKEN
  try {
    // query another server api
    const proxyUrl = `https://ipinfo.io/${encodeURIComponent(
      ip
    )}?token=${token}`;
    const proxyResponse = await fetch(proxyUrl, {
      method: 'GET'
    });
    const res: Ipinfo = await proxyResponse.json()
    const formatRes = formatIpinfo(res)
    return c.json(formatRes)
  } catch (error) {
  }
}
