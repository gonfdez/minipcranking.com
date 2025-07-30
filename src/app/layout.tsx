import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini PC Ranking - Best Mini PCs Reviewed and Compared",
  description:
    "Expert reviews, comparisons, buying guides, and rankings of the best Mini PCs for all budgets and use cases. Discover which Mini PC fits your needs perfectly.",

  // Añadir estos:
  keywords:
    "mini pc, small form factor pc, compact computer, mini pc reviews, best mini pc, htpc, nuc, buy mini pc, MiniPC, buy MiniPC, minipc, buy minipc, best minipc",
  authors: [{ name: "gfs-studio" }],
  creator: "gfs-studio",
  publisher: "Mini PC Ranking",

  category: 'Technology',
  classification: 'Computer Hardware Reviews',

  // Open Graph (Facebook/LinkedIn)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://minipcranking.com",
    siteName: "Mini PC Ranking",
    title: "Mini PC Ranking - Best Mini PCs Reviewed and Compared",
    description:
      "Expert reviews, comparisons, buying guides, and rankings of the best Mini PCs for all budgets and use cases.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Mini PC Ranking - Best Mini PCs Reviews",
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    // site: '@tu_twitter',
    // creator: '@tu_twitter',
    title: "Mini PC Ranking - Best Mini PCs Reviewed and Compared",
    description:
      "Expert reviews, comparisons, buying guides, and rankings of the best Mini PCs for all budgets and use cases.",
    images: ["/android-chrome-512x512.png"], // 1200x600px
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verificación
  // verification: {
  //   google: 'tu-google-site-verification-code',
  //   // yandex: 'tu-yandex-verification',
  //   // bing: 'tu-bing-verification',
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://minipcranking.com" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Mini PC Ranking",
              description:
                "Expert reviews and comparisons of the best Mini PCs",
              url: "https://minipcranking.com",
              // potentialAction: {
              //   "@type": "SearchAction",
              //   target: "https://minipcranking.com/search?q={search_term_string}",
              //   "query-input": "required name=search_term_string",
              // },
            }),
          }}
        />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-grow flex flex-col">{children}</main>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
