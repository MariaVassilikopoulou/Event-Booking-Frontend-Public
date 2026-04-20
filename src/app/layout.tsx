import Header from '@/components/Header';
import '../styles/globals.css';
import Footer from '../components/Footer';
import { Toaster } from 'sonner';
import WarmUpBanner from '@/components/WarmUpBanner';
import GlobalAiButton from '@/components/GlobalAiButton';
import AiAssistantModal from '@/components/AiAssistantModal';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="siteMain">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
        <WarmUpBanner />
        <GlobalAiButton />
        <AiAssistantModal />
      </body>
    </html>
  );
}
