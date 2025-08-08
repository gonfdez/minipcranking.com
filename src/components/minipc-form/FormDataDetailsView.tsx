import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FormData } from "./MiniPCForm";
import { MiniPCDetailsView } from "../MiniPCDetailsView";

interface FormDataDetailsViewProps {
  formData: FormData;
  showTitle?: boolean;
}

export function FormDataDetailsView({ formData, showTitle = true }: FormDataDetailsViewProps) {
  const [transformedData, setTransformedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabelsAndTransform = async () => {
      try {
        setLoading(true);

        // Obtener todos los labels necesarios
        const [brandRes, cpuRes, graphicsRes, connectivityRes] = await Promise.all([
          supabase
            .from("Brands")
            .select("name")
            .eq("id", parseInt(formData.brand))
            .single(),
          supabase
            .from("CPUs")
            .select("model, brand:Brands(name)")
            .eq("id", parseInt(formData.CPU))
            .single(),
          supabase
            .from("Graphics")
            .select("model, brand:Brands(name)")
            .eq("id", parseInt(formData.graphics))
            .single(),
          formData.connectivity.length > 0
            ? supabase
                .from("Connectivity")
                .select("type, speed")
                .in("id", formData.connectivity)
            : Promise.resolve({ data: [] })
        ]);

        // Transformar los datos
        const cpu = cpuRes.data as any;
        const graphics = graphicsRes.data as any;

        const transformed = {
          brand: { 
            name: brandRes.data?.name || "Unknown Brand" 
          },
          model: formData.model,
          CPU: {
            model: cpu?.model || "Unknown CPU",
            brand: { 
              name: cpu?.brand?.name || "Unknown Brand" 
            }
          },
          graphics: {
            model: graphics?.model || "Unknown Graphics",
            brand: { 
              name: graphics?.brand?.name || "Unknown Brand" 
            }
          },
          maxRAMCapacityGB: formData.maxRAMCapacityGB || null,
          maxStorageCapacityGB: formData.maxStorageCapacityGB || null,
          weightKg: formData.weightKg || null,
          powerConsumptionW: formData.powerConsumptionW || null,
          releaseYear: formData.releaseYear || null,
          manualCollect: formData.manualCollect,
          fromURL: formData.fromURL,
          manualURL: formData.manualURL || null,
          mainImgUrl: formData.mainImgUrl.map(img => img.url),
          portsImgUrl: formData.portsImgUrl?.map(img => img.url) || [],
          description: formData.description,
          dimensions: formData.dimensions,
          ports: formData.ports,
          connectivity: connectivityRes.data?.map((conn: any) => ({
            type: conn.type,
            speed: conn.speed
          })) || [],
          builtinMicrophone: formData.builtinMicrophone || false,
          builtinSpeakers: formData.builtinSpeakers || false,
          supportExternalDiscreteGraphicsCard: formData.supportExternalDiscreteGraphicsCard || false,
          variants: formData.variants || []
        };

        setTransformedData(transformed);
      } catch (error) {
        console.error("Error fetching labels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLabelsAndTransform();
  }, [formData]);

  if (loading) {
    return <div className="text-center py-4">Loading details...</div>;
  }

  if (!transformedData) {
    return <div className="text-center py-4 text-red-500">Error loading details</div>;
  }

  return <MiniPCDetailsView miniPC={transformedData} showTitle={showTitle} />;
}