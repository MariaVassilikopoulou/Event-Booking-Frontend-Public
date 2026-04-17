"use client"
import Header from '@/components/Header';
import '../styles/globals.css';
import Footer from '../components/Footer';
import { Toaster } from 'sonner';
import WarmUpBanner from '@/components/WarmUpBanner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
        <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
        <WarmUpBanner />
      </body>
    </html>
  );
}
