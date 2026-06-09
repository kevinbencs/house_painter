import Section from "@/app/_components/price/section"
import { getCategory, getPriceData } from "@/lib/data"
import { MongoData } from "@/typeScriptType/price"
import type { Metadata } from 'next'
import { cacheLife, cacheTag } from "next/cache"

export const metadata: Metadata = {
  title: 'Árak',
  description: 'Szobafestés árak Budapesten és környékén',
  keywords: ['',],
  authors: [{ name: 'Seb' }, { name: 'Josh', url: 'https://nextjs.org' }],
  creator: '',
  publisher: '',
  openGraph: {
    title: 'Árak - Budapest szobafestés',
    description: 'Szobafestés árak Budapesten és környékén',
    url: '',
    siteName: 'Next.js',
    images: [
      {
        url: '', // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: '', // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: 'My custom alt',
      },
    ],
    locale: 'hu_HU',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  twitter: {
    card: 'app',
    title: 'Árak',
    description: 'Árak - Budapest szobafestés',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: {
      url: '',
      alt: 'Next.js Logo',
    },
    app: {
      name: 'twitter_app',
      id: {
        iphone: 'twitter_app://iphone',
        ipad: 'twitter_app://ipad',
        googleplay: 'twitter_app://googleplay',
      },
      url: {
        iphone: 'https://iphone_url',
        ipad: 'https://ipad_url',
      },
    },
  },
  appleWebApp: {
    title: 'Apple Web App',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/assets/startup/apple-touch-startup-image-768x1004.png',
      {
        url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
  appLinks: {
    ios: {
      url: 'https://nextjs.org/ios',
      app_store_id: 'app_store_id',
    },
    android: {
      package: 'com.example.android/package',
      app_name: 'app_name_android',
    },
    web: {
      url: 'https://nextjs.org/web',
      should_fallback: true,
    },
  },
  facebook: {
    appId: '12345678',
  },
  pinterest: {
    richPin: true,
  },
}

const Page = async () => {
  'use cache'
  cacheTag('price-page')
  cacheLife('hours')


  const [res, cat] = await Promise.all([
    getPriceData(),
    getCategory()
  ])


  const catArr = cat.map((i) => i._id)



  const data: MongoData[][] = [];

  for (let i = 0; i < catArr.length; i++) {
    data.push([])
    for (let j = 0; j < res.length; j++) {
      if (catArr[i] === res[j].category) {
        data[i].push(res[j])
      }
    }
  }

  return (
    <>
      <h1 className="text-3xl mb-10 text-center">Szobafestés árak</h1>
      <div className="mb-40">
        {data.map((item) => <Section key={'price-cat-' + item[0].category} arrOfEl={item} />)}
      </div>

    </>
  )
}

export default Page