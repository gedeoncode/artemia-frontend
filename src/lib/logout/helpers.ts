import { logger } from "../logger";

interface CookieOptions {
  path?: string;
  domain?: string;
  sameSite?: 'strict' | 'lax' | 'none';
  secure?: boolean;
  expires?: Date | string;
  partitioned?: boolean;
}

export const deleteCookie = (name: string, options: CookieOptions = {}) => {
  try {
    const domain = typeof window !== 'undefined' ? window.location.hostname : '';
    const defaultOptions: CookieOptions = {
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      ...options
    };

    // Handle domain for non-localhost environments
    if (domain && domain !== 'localhost' && !options.domain) {
      defaultOptions.domain = domain.includes('.') 
        ? domain.substring(domain.indexOf('.')) 
        : domain;
    }

    document.cookie = `${name}=; ${Object.entries(defaultOptions)
      .map(([key, value]) => {
        if (value === undefined) return '';
        return `${key}=${value instanceof Date ? value.toUTCString() : value}`;
      })
      .filter(Boolean)
      .join('; ')}`;
  } catch (error) {
    logger.error('Failed to delete cookie:', error);
  }
};

export const getCookie = (name: string): string | undefined => {
  try {
    if (typeof document === 'undefined') return undefined;
    
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(`${name}=`))
      ?.split('=')
      .slice(1)
      .join('=') // Handle values containing '='
      .replace(/%([0-9A-F]{2})/g, (_, p1) => 
        String.fromCharCode(parseInt(p1, 16))
      ); // Decode URI component
  } catch {
    return undefined;
  }
};

export const clearAuthCookies = (
  ACCESS_TOKEN_KEY: string,
  REFRESH_TOKEN_KEY: string,
  additionalCookies: string[] = []
) => {
  const cookieOptions: CookieOptions = {
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  };

  [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, ...additionalCookies].forEach(cookie => {
    deleteCookie(cookie, cookieOptions);
  });
};
