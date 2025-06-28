import { AuthProvider ,useAuth} from '@/services/context/AuthContext';
import './globals.css';
import 'react-quill-new/dist/quill.snow.css';

import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import {  Locale, routing  } from '@/i18n/routing';
import { loadMessages } from '@/utils/loadMessages'; 

export default async function RootLayout({
   children,
  params
}: {
  children: React.ReactNode;
  params: { locale: Locale  };
}) {
  
  const locale = await params;

  if (!hasLocale(routing.locales, locale.locale)) {
    notFound();
  }

  const messages = await loadMessages(locale.locale);
  const dir = locale.locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale.locale} dir={dir}>
      <body className="bg-yellow-100 min-h-screen">
        <NextIntlClientProvider locale={locale.locale} messages={messages}>
          <AuthProvider>
              {children}
          </AuthProvider>
        </NextIntlClientProvider>
        
      </body>
    </html>
  );
}
