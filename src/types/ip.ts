export type Ipapi = {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: any;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
};


export type IpApiError = { error: boolean, message: string, reason: string }

// curl ipinfo.io/61.144.45.18?token=[TOKEN]

// {
// "ip": "61.144.45.18",
// "city": "Shenzhen",
// "region": "Guangdong",
// "country": "CN",
// "loc": "22.5455,114.0683",
// "org": "AS4134 CHINANET-BACKBONE",
// "timezone": "Asia/Shanghai"
// }
export type Ipinfo = {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  timezone: string;
};

export type standardIp = {
  ip: string;
  country_name: string;
  country_code: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  org: string;
  timezone: string;
};


export type cfIp = {
  colo: string
  country: string
  city: string
  continent: string
  latitude: string
  longitude: string
  postalCode: string
  metroCode: string
  region: string
  regionCode: string
  timezone: string
}



