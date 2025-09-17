import './globals.css'
import '@/styles/cinematic.css'
import '@/styles/advanced-web-builder.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
// import StarBackground from '@/components/3d/StarBackground' // Temporarily disabled due to webpack module resolution error
import GlobalWidgets from '@/components/GlobalWidgets'
import PageTransitionLoader from '@/components/PageTransitionLoader'
import MobileOptimizer from '@/components/MobileOptimizer'
import LoadingScreenWrapper from '@/components/LoadingScreenWrapper'
import { LoadingProvider } from '@/contexts/LoadingContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Get Free Custom Website Quote | Professional Web Development | Ventaro AI',
  description: 'Get a free custom website quote today! Professional web development, e-commerce stores, SEO optimization, and more. Transform your business with our expert web solutions.',
  keywords: 'free website quote, custom website development, web design services, e-commerce development, SEO optimization, professional websites, web development quote, custom web solutions',
  authors: [{ name: 'Ventaro AI' }],
  creator: 'Ventaro AI',
  publisher: 'Ventaro AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ventaroai.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: ['/favicon-premium.svg'],
    shortcut: ['/favicon-premium.svg'],
    apple: ['/favicon-premium.svg'],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/favicon-premium.svg',
      },
      {
        rel: 'mask-icon',
        url: '/favicon-premium.svg',
        color: '#0f172a',
      }
    ],
  },
  openGraph: {
    title: 'Get Free Custom Website Quote | Professional Web Development | Ventaro AI',
    description: 'Get a free custom website quote today! Professional web development, e-commerce stores, SEO optimization, and more. Transform your business with our expert web solutions.',
    url: 'https://ventaroai.com',
    siteName: 'Ventaro AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Get Free Custom Website Quote - Ventaro AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Free Custom Website Quote | Professional Web Development | Ventaro AI',
    description: 'Get a free custom website quote today! Professional web development, e-commerce stores, SEO optimization, and more. Transform your business with our expert web solutions.',
    images: ['/og-image.jpg'],
    creator: '@VentaroAI',
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
  verification: {
    google: 'zXt_s8PvYsJRPZuS-Lxvv9r1sLkVqbaYfbPl2l64-B4',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="zXt_s8PvYsJRPZuS-Lxvv9r1sLkVqbaYfbPl2l64-B4" />
        
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2S8LVPJ747"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2S8LVPJ747');
            `,
          }}
        />
        
        {/* Structured Data for Local Business & Services */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "Ventaro AI",
                "description": "Professional custom website development and web design services. Get your free quote today for e-commerce, SEO, and custom web solutions.",
                "url": "https://ventaroai.com",
                "telephone": "+1-800-VENTARO",
                "email": "chris.t@ventarosales.com",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "US"
                },
                "serviceArea": {
                  "@type": "Country",
                  "name": "United States"
                },
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Web Development Services",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Custom Website Development",
                        "description": "Professional custom website development with modern technologies"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "E-commerce Store Development",
                        "description": "Complete e-commerce solutions with payment processing"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "SEO Optimization",
                        "description": "Search engine optimization for better visibility"
                      }
                    }
                  ]
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "reviewCount": "127"
                },
                "priceRange": "$$"
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        {/* <StarBackground enabled={true} simple={false} /> */} {/* Temporarily disabled due to webpack module resolution error */}
        <MobileOptimizer />
        <Providers>
          <LoadingProvider>
            <LoadingScreenWrapper />
            <PageTransitionLoader>
              <Navbar />
              <main className="relative z-10">
                {children}
              </main>
              <Footer />
              <GlobalWidgets />
            </PageTransitionLoader>
          </LoadingProvider>
        </Providers>
        <GoogleAnalytics gaId="G-2S8LVPJ747" />
        
        {/* Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16935172386"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16935172386');
            
            // Enhanced ecommerce and conversion tracking
            gtag('config', 'AW-16935172386', {
              custom_map: {
                'custom_parameter_1': 'lead_type',
                'custom_parameter_2': 'form_location'
              }
            });
          `}
        </Script>
      </body>
    </html>
  )
}