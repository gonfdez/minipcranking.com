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
