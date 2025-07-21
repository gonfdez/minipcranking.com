import fs from "fs";
import path from "path";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/blog-content/${slug}.mdx`);

  return (
    <div className="container mx-auto px-4 py-8 md:max-w-3xl lg:max-w-4xl">
      <article className="prose prose-lg dark:prose-invert">
        <Post />
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