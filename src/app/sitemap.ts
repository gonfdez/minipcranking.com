import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://minipcranking.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://minipcranking.com/blog",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://minipcranking.com/minipc",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // Añadir más URLs de tu sitio
  ];
}
