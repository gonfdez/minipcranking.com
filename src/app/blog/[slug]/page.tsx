import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { useMDXComponents } from "@/mdx-components";
import type { Metadata } from "next"; // Importa el tipo Metadata

interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), `src/blog-content/${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContent);
  const metadata = data as PostMetadata;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.tags ? metadata.tags.join(", ") : undefined,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "article",
      publishedTime: metadata.date,
      url: `https://minipcranking.com/blog/${slug}`,
      // images: [{ url: 'https://tu-dominio.com/imagen-portada.jpg' }], // Si tienes imágenes de portada
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      // creator: '@tuusuario', // Si tienes usuario de Twitter
    },
    authors: [{ name: "gfs-studio" }], // O el autor del post
    creator: "gfs-studio",
    publisher: "Mini PC Ranking",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), `src/blog-content/${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { content } = matter(fileContent);
  const components = useMDXComponents({});

  return (
    <div className="container mx-auto px-4 py-8 md:max-w-3xl lg:max-w-4xl">
      <article className="prose prose-lg dark:prose-invert pt-9">
        <MDXRemote source={content} components={components} />
      </article>
    </div>
  );
}

export function generateStaticParams() {
  const contentDirectory = path.join(process.cwd(), "src/blog-content");
  const filenames = fs.readdirSync(contentDirectory);
  const slugs = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => filename.replace(".mdx", ""));

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export const dynamicParams = false;
