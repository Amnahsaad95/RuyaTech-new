import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { DirectoryProvider } from '@/services/DirectoryContext';
import mockUsers  from '@/utils/mockData';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DirectoryProvider users={mockUsers}>
      <Component {...pageProps} />
    </DirectoryProvider>
  );
}

