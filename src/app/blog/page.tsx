import { Metadata } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import BlogClient from "./BlogClient";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags?: string[];
}

// SEO Metadata
const metadata: Metadata = {
  title: "Mini PC Blog - Reviews, Comparisons & Complete Buying Guides",
  description:
    "Discover everything about mini PCs: detailed comparisons, spec analysis, reviews of Intel NUC, ASUS, Beelink and more brands. Your complete guide to choosing the perfect mini PC.",

  keywords: [
    "mini pc",
    "mini computer",
    "mini pc comparison",
    "Intel NUC",
    "ASUS Mini PC",
    "Beelink",
    "mini pc specs",
    "mini pc reviews",
    "mini pc buying guide",
    "gaming mini pc",
    "office mini pc",
    "compact computer",
    "small form factor pc",
  ],

  authors: [{ name: "gfs-studio" }],

  // Open Graph for social media
  openGraph: {
    title: "Mini PC Blog - Reviews & Comparisons | MiniPCRanking",
    description:
      "The ultimate guide to mini PCs: comparisons, specifications and reviews of all major brands",
    url: "https://minipcranking.com/blog",
    siteName: "MiniPCRanking",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-minipc-blog.jpg", // 1200x630px image
        width: 1200,
        height: 630,
        alt: "Mini PC Blog - Reviews and Comparisons | MiniPCRanking",
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "Mini PC Blog - Reviews & Comparisons",
    description:
      "Discover the best mini PCs on the market with our detailed comparisons and technical analysis",
    images: ["/twitter-minipc-blog.jpg"],
  },

  // Additional structured data
  other: {
    "og:type": "blog",
    "article:section": "Technology",
    "article:tag": "Mini PC, Comparisons, Hardware Reviews",
  },

  // Robot configuration
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

  // Canonical URL
  alternates: {
    canonical: "https://minipcranking.com/blog",
  },

  // Additional configuration
  category: "technology",
  classification: "Mini PCs, Hardware, Technology Reviews",
};

// You can also generate dynamic metadata if you need to include recent posts information
export async function generateMetadata(): Promise<Metadata> {
  const posts = await getBlogPosts();
  const latestPosts = posts.slice(0, 3);

  const dynamicDescription = `Latest articles: ${latestPosts
    .map((post) => post.title)
    .join(
      ", "
    )}. Detailed comparisons and analysis of mini PCs from all major brands.`;

  return {
    ...metadata,
    description:
      dynamicDescription.length > 160
        ? "Discover everything about mini PCs: detailed comparisons, spec analysis and reviews of all major brands. Your complete guide."
        : dynamicDescription,
  };
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const contentDirectory = path.join(process.cwd(), "src/blog-content");
  const filenames = fs.readdirSync(contentDirectory);

  const posts = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => {
      const slug = filename.replace(".mdx", "");
      const filepath = path.join(contentDirectory, filename);
      const fileContent = fs.readFileSync(filepath, "utf8");
      const { data } = matter(fileContent);

      return {
        slug,
        title: data.title || slug,
        date: data.date || "1970-01-01",
        description: data.description || "",
        tags: data.tags || [],
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export default async function BlogHomePage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-8 md:max-w-3xl lg:max-w-4xl">
      <BlogClient posts={posts} />
    </div>
  );
}
