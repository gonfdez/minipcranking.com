import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      {/* Eliminamos las clases de grid-cols aquí para que cada post ocupe su propia línea */}
      <div className="flex flex-col gap-6">
        {" "}
        {/* Usamos flex-col para apilar los elementos y gap-6 para el espacio */}
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="w-full hover:shadow-lg transition-shadow cursor-pointer">
              {" "}
              {/* Aseguramos que la tarjeta ocupe todo el ancho */}
              <CardHeader>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription>
                  {new Date(post.date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              {post.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.description}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
