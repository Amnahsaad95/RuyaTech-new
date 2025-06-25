/* middleware.js
import { NextResponse } from 'next/server';
import  i18n  from './i18n-config';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request) {
  const headers = { 'accept-language': request.headers.get('accept-language') || '' };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, i18n.locales, i18n.defaultLocale);
}

export function middleware(request) {
  const { pathname } = new URL(request.url);
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};*/

// middleware.ts
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const nextIntlMiddleware = createMiddleware(routing);

export function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1) if exactly root, redirect to /ar/homePage
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${routing.defaultLocale}/homePage`, url));
  }

  // 2) otherwise let next-intl handle locale prefixing, etc.
  return nextIntlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'], 
};
