import { Inter } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WasteSense AI — Smart Waste Segregation Helper',
  description:
    'Upload a photo of your waste and our AI instantly classifies it into Wet Waste, Dry Waste, Recyclable, or E-Waste. Powered by AWS Rekognition.',
  keywords: 'waste segregation, AI waste classifier, recycling, e-waste, environment',
  openGraph: {
    title: 'WasteSense AI — Smart Waste Segregation',
    description: 'AI-powered waste classification for a cleaner planet.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
