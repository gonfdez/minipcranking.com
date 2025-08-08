import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Monitor, BookOpen, BarChart3, Cpu, Zap, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Mini PC Ranking - Compare, Review & Find the Best Mini PCs",
  description: "The ultimate resource for mini PC enthusiasts. Compare specifications, read expert reviews, and discover the perfect mini PC for your needs. Find your ideal compact computing solution.",
  
  keywords: [
    "mini pc ranking",
    "mini pc comparison",
    "mini pc reviews",
    "Intel NUC",
    "ASUS Mini PC",
    "Beelink",
    "mini pc specifications",
    "compact computer",
    "small form factor pc",
    "mini pc buying guide",
    "best mini pc"
  ],

  authors: [{ name: "gfs-studio" }],
  
  openGraph: {
    title: "Mini PC Ranking - Compare & Review the Best Mini PCs",
    description: "The ultimate resource for mini PC enthusiasts. Compare specifications, read expert reviews, and find your perfect mini PC.",
    url: "https://minipcranking.com",
    siteName: "MiniPCRanking",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "Mini PC Ranking - The Ultimate Mini PC Resource"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "Mini PC Ranking - Compare & Review Mini PCs",
    description: "The ultimate resource for mini PC enthusiasts. Compare specs, read reviews, and find your perfect mini PC.",
    images: ["/twitter-homepage.jpg"]
  },

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

  alternates: {
    canonical: "https://minipcranking.com"
  },

  category: "technology",
  classification: "Mini PCs, Hardware Reviews, Technology Comparison"
};

export default function Home() {
  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 text-sm font-medium">
            Your Ultimate Mini PC Resource
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Discover the Perfect
            <span className="text-primary block mt-2">Mini PC</span>
            for Your Needs
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Compare specifications, read expert reviews, and explore the world of mini PCs. 
            <br/> Find your ideal compact computing solution.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Specifications Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Monitor className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Mini PC Specifications</CardTitle>
              <CardDescription>
                Detailed specs and comparisons of every mini PC model
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled
                  >
                    <Cpu className="w-4 h-4 mr-2" />
                    View Specifications
                  </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming Soon! Comprehensive spec database in development</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>

          {/* Blog Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 ring-2 ring-primary/20 flex flex-col justify-between">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Expert Reviews & Guides</CardTitle>
              <CardDescription>
                In-depth articles about the mini PC world and latest trends
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full">
                <Link href="/blog">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read Our Blog
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Comparison Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Mini PC Comparator</CardTitle>
              <CardDescription>
                Side-by-side comparisons to help you choose the right model
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Compare Mini PCs
                  </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming Soon! Advanced comparison tool in development</p>
                </TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}