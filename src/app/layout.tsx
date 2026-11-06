import type { Metadata, Viewport } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ashrut Tiwari · Unreal Engine 5 Game Developer & 3D Artist 🐼',
  description: 'Full-stack portfolio of Ashrut Tiwari — professional Unreal Engine 5 Game Developer & 3D Artist crafting immersive games and stylized 3D characters, featured in a cozy Panda OS interactive desktop experience.',
  keywords: [
    'Ashrut Tiwari',
    'Unreal Engine 5 Game Developer',
    '3D Artist',
    'Game Developer',
    'Unreal Engine 5',
    'Blender 3D',
    'Character Design',
    'Godot',
    'Freelance Game Dev',
    'Panda Theme',
  ],
  authors: [{ name: 'Ashrut Tiwari' }],
  creator: 'Ashrut Tiwari',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ashrut.dev',
    title: 'Ashrut Tiwari · Unreal Engine 5 Game Developer & 3D Artist 🐼',
    description: 'Explore games and 3D character art by Unreal Engine 5 Game Developer & 3D Artist Ashrut Tiwari.',
    siteName: 'Ashrut Tiwari Panda Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashrut Tiwari · Game Developer & 3D Artist 🐼',
    description: 'Immersive 3D games, stylized character art, and cinematic visual effects.',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#f3f8f4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="antialiased select-none font-sans bg-pastel-bg text-pastel-dark min-h-screen overflow-hidden">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
