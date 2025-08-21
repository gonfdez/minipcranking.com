// Función para generar slug SEO-friendly
export function generateSlug(brand: string, model: string, cpuModel: string, graphicsModel: string): string {
  const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const modelSlug = model.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cpuSlug = cpuModel.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const graphicsSlug = graphicsModel.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  return `${brandSlug}-${modelSlug}-${cpuSlug}-${graphicsSlug}`.replace(/-+/g, '-');
}