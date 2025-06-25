import { getRequestConfig } from 'next-intl/server';
import { loadMessages } from '@/utils/loadMessages';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = hasLocale(routing.locales, requestLocale)
    ? requestLocale
    : routing.defaultLocale;

  

  return {
    locale,
    messages: (await import(`@/locales/${locale}/home.json`)).default
  };
});
