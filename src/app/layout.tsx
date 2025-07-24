import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import Image from "next/image";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
          {/* Header */}
          <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
            <Link
              href="/"
              className="text-2xl font-bold hover:text-primary transition-colors flex items-center gap-2"
            >
              <Image
                src="/favicon.svg"
                alt="Trophy"
                width={32}
                height={32}
                className="inline-block"
              />
              minipcranking.com
            </Link>

            <div className="flex items-center gap-6">
              <nav className="hidden sm:block">
                <ul className="flex items-center space-x-6">
                  <li>
                    <Link
                      href="/blog"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Mobile navigation */}
              <nav className="sm:hidden">
                <Link
                  href="/blog"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </nav>

              <ThemeToggle />
            </div>
          </header>
          <main className="flex-grow flex flex-col">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
