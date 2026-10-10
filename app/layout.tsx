import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "./_components/footer/footer";
import HeaderContainer from "./_components/header/headerContainer";
import TopBar from "./_components/header/topbar";
import { FormProvided } from "./_components/sendMessage/formContext";
import ErrorBoundary from './custom-error-boundary'

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
  metadataBase: process.env.URL,
  description: "Megbízható, precíz szobafestő Budapesten és környékén",

  category: 'Szobafestés',
  pinterest: {
    richPin: true,
  },
  authors: [{ name: 'Kevin Bencs', url: 'https://kevinbencs.com' }],
  creator: 'Kevin Bencs',
  publisher: 'Bencs Kornél',
  openGraph: {
    title: '',
    description: '',
    url: process.env.URL,
    siteName: '',
    locale: 'hu_HU',
    type: 'website',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Budafestő - festés Budapesten' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Képek",

    description: 'Megbízható, precíz szobafestés Budapesten és környékén',
    images: [{ url: "/images/zold-fal.jpeg", alt: 'Budafestő - Képek' }],
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
    '@type': 'HousePainter',
    '@id': `${process.env.URL}/#business`,
    name: '',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Budapest',
      postalCode: '1119',
      addressCountry: 'HU',

    },
    areaServed: [{ '@type': 'City', name: 'Budapest' }, { '@type': 'AdministrativeArea', name: 'Pest megye' }],
    url: process.env.URL,
    telephone: '',
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00', closes: '17:00',
    }],
    image: `${process.env.URL}/img/zold-fal.jpeg`,

    sameAs: ['https://facebook.com/…', 'https://instagram.com/…'],
  }
  return (
    <html
      lang="hu"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}

    >
      <head>
        <link rel="llms-txt" href="/llms.txt" />
      </head>
      <body className="min-h-full flex flex-col">
        <ErrorBoundary title="Hiba a szolgáltatásoknál">
          <TopBar />
        </ErrorBoundary>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <FormProvided>
          <HeaderContainer>{children}</HeaderContainer>
          <Footer />
        </FormProvided>
      </body>
    </html>
  );
}
