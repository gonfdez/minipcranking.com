import fs from "fs";
import path from "path";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/blog-content/${slug}.mdx`);

  return <Post />;
}

export function generateStaticParams() {
  // Obtener la ruta del directorio de contenido
  const contentDirectory = path.join(process.cwd(), "src/blog-content");

  // Leer todos los archivos del directorio
  const filenames = fs.readdirSync(contentDirectory);

  // Filtrar solo archivos .mdx y obtener el slug
  const slugs = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => filename.replace(".mdx", ""));

  // Retornar array de params
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export const dynamicParams = false;
