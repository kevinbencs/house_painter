import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "./_components/footer/footer";
import HeaderContainer from "./_components/header/headerContainer";
import TopBar from "./_components/header/topbar";
import { IsLoggedProvider } from "./_components/loggedContext/isLoggedContext";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Budapesten szobafestés',
    default: "Budapesten szobafestés",
  },
  description: "Megbízható, precíz szobafestés Budapesten és környékén",
  alternates: {
    canonical: 'https://your-budapest-painter.hu',
  },
  category: 'Szobafestés',
  pinterest: {
    richPin: true,
  },
  openGraph: {
    siteName: 'Budafestő',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: "/api/images", alt: 'Budafestő - festés Budapesten' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Képek",
    description: 'Megbízható, precíz szobafestés Budapesten és környékén',
    images: [{ url: "/api/images", alt: 'Budafestő - Képek' }],
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nocache: false,
    noimageindex: false,
    googleBot: {
      index: true,
      follow: true,
      noarchive: false,
      nocache: false,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    'name': 'Budapest Painter Pro',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Budapest',
      'addressCountry': 'HU',
      // Add specific district if applicable
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '47.4979',
      'longitude': '19.0402'
    },
    'url': 'https://your-budapest-painter.hu',
    'telephone': '+3612345678',
    'priceRange': '$$',
    'image': 'https://your-budapest-painter.hu/hero-painting.jpg'
  }
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}

    >
      <body className="min-h-full flex flex-col">
        <TopBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <IsLoggedProvider>
          <HeaderContainer>{children}</HeaderContainer>
        </IsLoggedProvider>
        <Footer />
      </body>
    </html>
  );
}
