import type { Metadata, Viewport } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ashrut Tiwari · Game Developer, 3D Artist & Cinematographer',
  description: 'Full-stack portfolio of Ashrut Tiwari — crafting immersive 3D games in Unreal Engine 5 & Godot, character sculpting in Blender & ZBrush, and cinematic visual effects.',
  keywords: [
    'Ashrut Tiwari',
    'Game Developer',
    'Unreal Engine 5',
    'Godot',
    'Blender 3D',
    'Character Design',
    'Cinematography',
    'VFX',
    'Freelance Game Dev',
  ],
  authors: [{ name: 'Ashrut Tiwari' }],
  creator: 'Ashrut Tiwari',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ashrut.dev',
    title: 'Ashrut Tiwari · Game Developer & Cinematographer',
    description: 'Explore games, 3D character art, and cinematic productions by Ashrut Tiwari.',
    siteName: 'Ashrut Tiwari Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashrut Tiwari · Game Developer & 3D Artist',
    description: 'Immersive 3D games, stylized character art, and cinematic visual effects.',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#fef9e7',
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
        {children}
      </body>
    </html>
  );
}
