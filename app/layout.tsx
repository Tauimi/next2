import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import './globals.css'

// Инициализация шрифтов
const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-montserrat',
  display: 'swap',
})

// Метаданные сайта
export const metadata: Metadata = {
  title: 'TechnoMart - Интернет-магазин электроники и бытовой техники',
  description: 'Широкий выбор электроники, бытовой техники, смартфонов, ноутбуков и аксессуаров. Быстрая доставка, гарантия качества, профессиональные консультации.',
  keywords: [
    'электроника',
    'бытовая техника', 
    'смартфоны',
    'ноутбуки',
    'телевизоры',
    'интернет-магазин',
    'техномарт'
  ],
  authors: [{ name: 'TechnoMart' }],
  creator: 'TechnoMart',
  publisher: 'TechnoMart',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://technomart.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TechnoMart - Интернет-магазин электроники',
    description: 'Широкий выбор электроники и бытовой техники с гарантией качества',
    url: 'https://technomart.vercel.app',
    siteName: 'TechnoMart',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TechnoMart - Интернет-магазин электроники',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechnoMart - Интернет-магазин электроники',
    description: 'Широкий выбор электроники и бытовой техники с гарантией качества',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        {/* Дополнительные мета-теги */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        
        {/* Preload критических ресурсов */}
        <link
          rel="preload"
          href="/fonts/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Structured Data для SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              name: 'TechnoMart',
              description: 'Интернет-магазин электроники и бытовой техники',
              url: 'https://technomart.vercel.app',
              logo: 'https://technomart.vercel.app/logo.png',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+7 (800) 123-45-67',
                contactType: 'customer service',
                availableLanguage: 'Russian',
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'RU',
                addressLocality: 'Москва',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://technomart.vercel.app/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="font-body antialiased">
        {/* Основной контейнер */}
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <Header />
          
          {/* Основной контент */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* Footer */}
          <Footer />
        </div>

        {/* Toast уведомления */}
        <ToastProvider />
      </body>
    </html>
  )
} 