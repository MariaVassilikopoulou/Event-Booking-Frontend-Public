"use client"
import Header from '@/components/Header';
import '../styles/globals.css';
import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  
  return (
    <html lang="en">
      <body> <Header/>
      {children}
       
      </body>
    </html>
  );
}
