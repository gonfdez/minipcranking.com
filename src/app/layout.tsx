import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

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

  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%22 y=%2270%22 font-size=%2270%22 text-anchor=%22middle%22>🏆</text></svg>",
        sizes: "32x32",
        type: "image/svg+xml",
      },
      {
        url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%22 y=%2270%22 font-size=%2270%22 text-anchor=%22middle%22>🏆</text></svg>",
        sizes: "16x16",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%22 y=%2270%22 font-size=%2270%22 text-anchor=%22middle%22>🏆</text></svg>",
        sizes: "180x180",
        type: "image/svg+xml",
      },
    ],
  },

  // Para PWA y Android
  // manifest: "/manifest.json", // Si tienes uno
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
              <svg
                width="32"
                height="32"
                viewBox="0 0 100 100"
                className="inline-block"
              >
                <text
                  x="50"
                  y="50"
                  fontSize="60"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  🏆
                </text>
              </svg>
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
