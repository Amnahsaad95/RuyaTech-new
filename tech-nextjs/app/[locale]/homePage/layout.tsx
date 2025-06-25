import './globals.css';
import Navbar from '@/components/layoutHome/Navbar';
import Footer from '@/components/layoutHome/Footer';
import HeroCarousel from '@/components/home/HeroCarousel'
import { AuthProvider } from '@/services/context/AuthContext';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import {  Locale, routing  } from '@/i18n/routing';
import { loadMessages } from '@/utils/loadMessages'; 
import { dir } from 'i18next';
import { getMessages } from "next-intl/server";

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
  const { setting } = await fetchData();

  const messages = await loadMessages(locale.locale);
  const dir = locale.locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale.locale} dir={dir}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My app</title>
      </head>
      <body className="bg-gray-100 min-h-screen">
        <NextIntlClientProvider locale={locale.locale} messages={messages}>
          <AuthProvider>
            <Navbar />
            <HeroCarousel  />
            {children}
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

async function fetchData() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/settings', {
      next: { revalidate: 60 } // لجعلها static مع إمكانية التحديث كل 60 ثانية
    });

    if (!response.ok) {
      throw new Error('Failed to fetch home data');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error("Home API did not return success");
  }
}
