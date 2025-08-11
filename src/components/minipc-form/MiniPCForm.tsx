"use client";

import styles from "./minipcform.module.css";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BrandSelectAndCreate } from "./BrandSelectAndCreate";
import { CPUSelectAndCreate } from "./CPUSelectAndCreate";
import { GraphicsSelectAndCreate } from "./GraphicsSelectAndCreate";
import { DescriptionInput } from "./DescriptionInput";
import { DimensionsInput } from "./DimensionsInput";
import { ConnectivitySelectAndCreate } from "./ConnectivitySelectAndCreate";
import { VariantsInput } from "./VariantsInput";
import { ConfirmationDialog } from "./ConfirmationDialog";
import {
  createMiniPC,
  validateReferences,
  updateMiniPC,
} from "./supabase-functions";
import { supabase } from "@/lib/supabaseClient";
import {
  BrandData,
  ConnectivityData,
  CPUWithBrand,
  GraphicsWithBrand,
} from "./types";
import {
  Loader2,
  Save,
  SquarePlus,
  Table,
  TicketSlash,
  Trash2,
} from "lucide-react";
import { CleanInput } from "../ui/CleanInput";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const formSchema = z.object({
  model: z.string().min(1, "Model name is required"),
  fromURL: z.url("Product URL is required"),
  manualURL: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.url().safeParse(val).success,
      "Manual URL must be a valid URL"
    ),
  manualCollect: z.boolean(),
  maxRAMCapacityGB: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .or(z.nan().transform(() => undefined)),
  maxStorageCapacityGB: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .or(z.nan().transform(() => undefined)),
  weightKg: z
    .number()
    .positive()
    .optional()
    .or(z.nan().transform(() => undefined)),
  powerConsumptionW: z
    .number()
    .positive()
    .optional()
    .or(z.nan().transform(() => undefined)),
  releaseYear: z
    .number()
    .int()
    .optional()
    .or(z.nan().transform(() => undefined)),
  mainImgUrl: z
    .array(
      z.object({
        url: z.url("Image URL cannot be empty and must be a valid URL"),
      })
    )
    .min(1, "At least one image URL is required"),
  description: z.object({
    // es: z.string().min(1, "Spanish description is required"),
    en: z.string().optional(),
    // it: z.string().min(1, "Italian description is required"),
    // de: z.string().min(1, "German description is required"),
  }),
  brand: z.string().min(1, "Brand is required"),
  CPU: z.string().min(1, "CPU is required"),
  graphics: z.string().min(1, "Graphics is required"),
  dimensions: z.object({
    widthMM: z
      .number()
      .positive()
      .nullable()
      .optional()
      .or(z.nan().transform(() => null)),
    heightMM: z
      .number()
      .positive()
      .nullable()
      .optional()
      .or(z.nan().transform(() => null)),
    lengthMM: z
      .number()
      .positive()
      .nullable()
      .optional()
      .or(z.nan().transform(() => null)),
  }),
  portsImgUrl: z
    .array(
      z.object({
        url: z.url("Port image URL cannot be empty and must be a valid URL"),
      })
    )
    .min(1, "At least one port image URL is required"),
  ports: z.object({
    usb3: z.number().int().nonnegative().nullable().optional(),
    usb2: z.number().int().nonnegative().nullable().optional(),
    usbC: z.number().int().nonnegative().nullable().optional(),
    hdmi: z.number().int().nonnegative().nullable().optional(),
    displayPort: z.number().int().nonnegative().nullable().optional(),
    ethernet: z.number().int().nonnegative().nullable().optional(),
    jack35mm: z.number().int().nonnegative().nullable().optional(),
    sdCard: z.number().int().nonnegative().nullable().optional(),
    microSD: z.number().int().nonnegative().nullable().optional(),
    vga: z.number().int().nonnegative().nullable().optional(),
    dvi: z.number().int().nonnegative().nullable().optional(),
    thunderbolt: z.number().int().nonnegative().nullable().optional(),
  }),
  connectivity: z
    .array(z.number().int().positive())
    .min(1, "At least one connectivity option is required"),
  builtinMicrophone: z.boolean().optional(),
  builtinSpeakers: z.boolean().optional(),
  supportExternalDiscreteGraphicsCard: z.boolean().optional(),
  variants: z
    .array(
      z.object({
        id: z.number().optional(),
        RAMGB: z
          .number()
          .int()
          .positive()
          .min(1, "RAM capacity must be at least 1GB"),
        RAM_type: z.string().min(1, "RAM type is required"),
        storageGB: z
          .number()
          .int()
          .positive()
          .min(1, "Storage capacity must be at least 1GB"),
        storage_type: z.string().min(1, "Storage type is required"),
        offers: z
          .array(
            z.object({
              url: z.url().min(1, "Offer URL is required"),
              price: z
                .number()
                .positive()
                .min(0.01, "Price must be greater than 0"),
            })
          )
          .min(1, "At least one offer is required for each variant"),
      })
    )
    .min(1, "At least one variant is required"),
});

export type FormData = z.infer<typeof formSchema>;

const defaultValues = {
  model: "",
  brand: "",
  CPU: "",
  graphics: "",
  manualCollect: true,
  manualURL: "",
  mainImgUrl: [{ url: "" }],
  portsImgUrl: [{ url: "" }],
  description: { en: "" },
  dimensions: {
    widthMM: null,
    heightMM: null,
    lengthMM: null,
  },
  ports: {
    usb3: null,
    usb2: null,
    usbC: null,
    hdmi: null,
    displayPort: null,
    ethernet: null,
    jack35mm: null,
    sdCard: null,
    microSD: null,
    vga: null,
    dvi: null,
    thunderbolt: null,
  },
  connectivity: [],
  variants: [],
};

// helper para convertir la fila de la BBDD al formato que espera el form
function mapDbMiniPCToForm(data: any): FormData {
  if (!data) return defaultValues as unknown as FormData;

  const mapOffers = (offers: any) =>
    Array.isArray(offers) && offers.length
      ? offers.map((o: any) =>
          typeof o === "string"
            ? { url: o, price: NaN }
            : {
                url: o?.url ?? "",
                price: o?.price !== undefined ? Number(o.price) : NaN,
              }
        )
      : [{ url: "", price: NaN }];

  return {
    model: data.model ?? "",
    fromURL: data.fromURL ?? "",
    manualURL: data.manualURL ?? "",
    manualCollect: !!data.manualCollect,
    maxRAMCapacityGB: data.maxRAMCapacityGB ?? undefined,
    maxStorageCapacityGB: data.maxStorageCapacityGB ?? undefined,
    weightKg: data.weightKg ?? undefined,
    powerConsumptionW: data.powerConsumptionW ?? undefined,
    releaseYear: data.releaseYear ?? undefined,
    // mainImgUrl en la BBDD es string[] -> en el form es [{ url }]
    mainImgUrl:
      Array.isArray(data.mainImgUrl) && data.mainImgUrl.length
        ? data.mainImgUrl.map((u: string) => ({ url: u }))
        : [{ url: "" }],
    description: { en: data.description?.en ?? "" },
    // brand / CPU / graphics vienen como números (ids). el form quiere string ids.
    brand: data.brand ? String(data.brand) : "",
    CPU: data.CPU ? String(data.CPU) : "",
    graphics: data.graphics ? String(data.graphics) : "",
    dimensions: {
      widthMM: data.dimensions?.widthMM ?? null,
      heightMM: data.dimensions?.heightMM ?? null,
      lengthMM: data.dimensions?.lengthMM ?? null,
    },
    portsImgUrl:
      Array.isArray(data.portsImgUrl) && data.portsImgUrl.length
        ? data.portsImgUrl.map((u: string) => ({ url: u }))
        : [{ url: "" }],
    ports: {
      usb3: data.ports?.usb3 ?? null,
      usb2: data.ports?.usb2 ?? null,
      usbC: data.ports?.usbC ?? null,
      hdmi: data.ports?.hdmi ?? null,
      displayPort: data.ports?.displayPort ?? null,
      ethernet: data.ports?.ethernet ?? null,
      jack35mm: data.ports?.jack35mm ?? null,
      sdCard: data.ports?.sdCard ?? null,
      microSD: data.ports?.microSD ?? null,
      vga: data.ports?.vga ?? null,
      dvi: data.ports?.dvi ?? null,
      thunderbolt: data.ports?.thunderbolt ?? null,
    },
    connectivity: Array.isArray(data.connectivity)
      ? data.connectivity.map((n: any) => Number(n))
      : [],
    builtinMicrophone: !!data.builtinMicrophone,
    builtinSpeakers: !!data.builtinSpeakers,
    supportExternalDiscreteGraphicsCard:
      !!data.supportExternalDiscreteGraphicsCard,
    // variants: traídas desde la query (ver abajo) -> mapear a la forma del form
    variants:
      Array.isArray(data.variants) && data.variants.length
        ? data.variants.map((v: any) => ({
            id: v.id,
            RAMGB: Number(v.RAMGB),
            RAM_type: v.RAM_type ?? "DDR4",
            storageGB: Number(v.storageGB),
            storage_type: v.storage_type ?? "SSD",
            offers: mapOffers(v.offers),
          }))
        : [],
  };
}

export function MiniPCForm() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<FormData | null>(
    null
  );
  const [centralData, setCentralData] = useState({
    brands: [] as BrandData[],
    cpus: [] as CPUWithBrand[],
    graphics: [] as GraphicsWithBrand[],
    connectivity: [] as ConnectivityData[],
    loading: true,
  });
  const [formLoading, setFormLoading] = useState(false);

  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [tabsWithErrors, setTabsWithErrors] = useState<string[]>([]);
  const checkTabErrors = (errors: any) => {
    const tabErrors = [];
    // Errores en basicInfo (todos los campos excepto variants)
    const hasBasicInfoErrors = Object.keys(errors).some(
      (field) => field !== "variants"
    );
    if (hasBasicInfoErrors) {
      tabErrors.push("basicInfo");
    }
    // Errores en variants
    if (errors.variants) {
      tabErrors.push("variants");
    }
    return tabErrors;
  };
  useEffect(() => {
    const tabErrors = checkTabErrors(errors);
    setTabsWithErrors(tabErrors);

    // Si hay errores, hacer scroll hacia arriba para ver las tabs
    if (tabErrors.length > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [errors]);

  const brandValue = watch("brand");
  const onBrandChange = (value: string) => setValue("brand", value);

  const cpuValue = watch("CPU");
  const onCPUChange = (value: string) => setValue("CPU", value);

  const graphicsValue = watch("graphics");
  const onGraphicsChange = (value: string) => setValue("graphics", value);

  const connectivityValue = watch("connectivity");
  const onConnectivityChange = (value: number[]) =>
    setValue("connectivity", value);

  const { fields, append, remove } = useFieldArray<FormData>({
    name: "mainImgUrl",
    control,
  });

  const {
    fields: portsImagesFields,
    append: appendPortsImage,
    remove: removePortsImage,
  } = useFieldArray<FormData>({
    name: "portsImgUrl",
    control,
  });

  const fetchAllCentralData = async () => {
    setCentralData((prev) => ({ ...prev, loading: true }));

    try {
      const [brandsRes, cpusRes, graphicsRes, connectivityRes] =
        await Promise.all([
          supabase.from("Brands").select("id, name, imgHref").order("name"),
          supabase
            .from("CPUs")
            .select(
              `
          id, brand, model, cores, threads, baseClockGHz, boostClockGHz,
          brandData:Brands(id, name)
        `
            )
            .order("model"),
          supabase
            .from("Graphics")
            .select(
              `
          id, model, integrated, brand, frequencyMHz, maxTOPS, graphicCoresCU,
          brandData:Brands(id, name)
        `
            )
            .order("model"),
          supabase.from("Connectivity").select("id, type, speed").order("type"),
        ]);

      setCentralData({
        brands: brandsRes.data || [],
        cpus: (cpusRes.data as any) || [],
        graphics: (graphicsRes.data as any) || [],
        connectivity: connectivityRes.data || [],
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching central data:", error);
      setCentralData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchAllCentralData();
  }, []);

  useEffect(() => {
    if (!editId) return;

    setFormLoading(true);

    // espera a que centralData esté cargado para que los selects (brand/cpu/graphics) puedan mostrar la opción
    if (centralData.loading) return;

    (async () => {
      const { data, error } = await supabase
        .from("MiniPCs")
        .select(
          `
        *,
        variants:Variants(
          id,
          RAMGB,
          RAM_type,
          storageGB,
          storage_type,
          offers
        )
      `
        )
        .eq("id", editId)
        .single();

      if (error) {
        toast.error("Error loading Mini PC data");
        console.error(error);
        return;
      }

      // transforma y resetea el formulario
      const formValues = mapDbMiniPCToForm(data);
      reset(formValues);
      setFormLoading(false);
    })();
  }, [editId, centralData.loading, reset]);

  const onSubmit = async (data: FormData) => {
    console.log("Form data:", data);
    console.log("Form errors:", errors);

    try {
      // Validar referencias antes de mostrar el diálogo
      const validation = await validateReferences(data);

      if (!validation.isValid) {
        toast.error("Validation Error", {
          description: validation.errors.join(", "),
        });
        return;
      }

      // Guardar los datos y mostrar el diálogo de confirmación
      setFormDataToSubmit(data);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error during validation:", error);
      toast.error("Error", {
        description: "An error occurred during validation. Please try again.",
      });
    }
  };

  const handleConfirmSubmit = async () => {
    if (!formDataToSubmit) return;

    setIsSubmitting(true);

    try {
      let result;
      if (editId) {
        result = await updateMiniPC(editId, formDataToSubmit);
        toast.success("Mini PC updated successfully");
      } else {
        result = await createMiniPC(formDataToSubmit);
        toast.success("Mini PC created successfully");
      }

      if (result.success) {
        toast.success("Success!", {
          description: "Mini PC created successfully",
        });

        reset();
        setShowConfirmation(false);
        setFormDataToSubmit(null);

        if (editId) {
          window.location.href = "/dev/minipc-table";
        }
      } else {
        toast.error("Error", {
          description: result.error || "Failed to create/edit Mini PC",
        });
      }
    } catch (error) {
      console.error("Error creating/editing Mini PC:", error);
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setFormDataToSubmit(null);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">
          {editId ? "Edit Mini PC" : "Create new Mini PC"}
        </h1>
        <Button
          variant={"outline"}
          onClick={() => (window.location.href = "/dev/minipc-table")}
        >
          <Table className="h-4 w-4" /> See Mini PC's Table
        </Button>
      </div>
      <div className="relative">
        {(formLoading || centralData.loading) && (
          <div className="absolute inset-0 z-50 pointer-events-auto backdrop-blur-[1px] transition-opacity duration-200">
            <div className="sticky top-0 flex justify-center items-center h-[400px] py-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-800 dark:text-gray-200" />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.minipcform}>
          <Tabs defaultValue="basicInfo">
            <TabsList className="mb-6 gap-2">
              <TabsTrigger
                className={`text-lg p-3 ${
                  tabsWithErrors.includes("basicInfo") ? styles.tabError : ""
                }`}
                value="basicInfo"
              >
                Basic information
              </TabsTrigger>
              <TabsTrigger
                className={`text-lg p-3 ${
                  tabsWithErrors.includes("variants") ? styles.tabError : ""
                }`}
                value="variants"
              >
                Variants & offers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basicInfo" className="space-y-4">
              <div>
                <Label>Brand *</Label>
                <BrandSelectAndCreate
                  value={brandValue}
                  onChangeAction={onBrandChange}
                  brands={centralData.brands}
                  onDataUpdateAction={fetchAllCentralData}
                  loading={centralData.loading}
                />
                {errors.brand && (
                  <span className="text-red-500">{errors.brand.message}</span>
                )}
              </div>

              <div>
                <Label>Model name *</Label>
                <CleanInput
                  {...register("model")}
                  placeholder="Model name of the Mini PC"
                />
                {errors.model && (
                  <span className="text-red-500">{errors.model.message}</span>
                )}
              </div>

              <div>
                <Label>CPU *</Label>
                <CPUSelectAndCreate
                  value={cpuValue}
                  onChangeAction={onCPUChange}
                  cpus={centralData.cpus}
                  brands={centralData.brands}
                  onDataUpdateAction={fetchAllCentralData}
                  loading={centralData.loading}
                />
                {errors.CPU && (
                  <span className="text-red-500">{errors.CPU.message}</span>
                )}
              </div>

              <div>
                <Label>Graphics *</Label>
                <GraphicsSelectAndCreate
                  value={graphicsValue}
                  onChangeAction={onGraphicsChange}
                  graphics={centralData.graphics}
                  brands={centralData.brands}
                  onDataUpdateAction={fetchAllCentralData}
                  loading={centralData.loading}
                />
                {errors.graphics && (
                  <span className="text-red-500">
                    {errors.graphics.message}
                  </span>
                )}
              </div>

              <div>
                <Label>Product manual URL</Label>
                <Input
                  {...register("manualURL")}
                  placeholder="URL of the product manual "
                />
                {errors.manualURL && (
                  <span className="text-red-500">
                    {errors.manualURL.message}
                  </span>
                )}
              </div>

              <div>
                <Label>Product URL *</Label>
                <Input
                  {...register("fromURL")}
                  placeholder="URL of the product where you are taking the data"
                />
                {errors.fromURL && (
                  <span className="text-red-500">{errors.fromURL.message}</span>
                )}
              </div>

              <div>
                <Label>Product Images URL *</Label>
                {fields.map((field, index) => (
                  <div key={field.id} className="mb-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        {...register(`mainImgUrl.${index}.url`)}
                        placeholder="https://example.com/minipc_main_image.jpg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        title="Remove row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.mainImgUrl?.[index]?.url && (
                      <span className="text-red-500 block mt-1">
                        {errors.mainImgUrl[index].url.message}
                      </span>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() => append({ url: "" })}
                  className="mt-1"
                >
                  <SquarePlus className="h-4 w-4" /> Add Image URL
                </Button>

                {errors.mainImgUrl && (
                  <span className="text-red-500 block mt-1">
                    {errors.mainImgUrl.message}
                  </span>
                )}
              </div>

              <div>
                <Label>Ports Images URL *</Label>
                {portsImagesFields.map((field, index) => (
                  <div key={field.id} className="mb-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        {...register(`portsImgUrl.${index}.url`)}
                        placeholder="https://example.com/minipc_ports_image.jpg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removePortsImage(index)}
                        disabled={portsImagesFields.length === 1}
                        title="Remove row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.portsImgUrl?.[index]?.url && (
                      <span className="text-red-500 block mt-1">
                        {errors.portsImgUrl[index].url.message}
                      </span>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={() => appendPortsImage({ url: "" })}
                  className="mt-1"
                >
                  <SquarePlus className="h-4 w-4" /> Add Port Image URL
                </Button>

                {errors.portsImgUrl && (
                  <span className="text-red-500 block mt-1">
                    {errors.portsImgUrl.message}
                  </span>
                )}
              </div>

              <div className="border border-gray-300 rounded-xl p-4 space-y-4">
                <Label className="text-lg font-semibold block">
                  Ports Quantity *
                </Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {Object.keys(defaultValues.ports).map((portKey) => (
                    <div key={portKey}>
                      <Label>{portKey.toUpperCase()}</Label>
                      <Input
                        type="number"
                        min="0"
                        {...register(
                          `ports.${
                            portKey as keyof typeof defaultValues.ports
                          }`,
                          { valueAsNumber: true }
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Connectivity *</Label>
                <ConnectivitySelectAndCreate
                  value={connectivityValue}
                  onChangeAction={onConnectivityChange}
                  connectivity={centralData.connectivity}
                  onDataUpdateAction={fetchAllCentralData}
                  loading={centralData.loading}
                />
                {errors.connectivity && (
                  <span className="text-red-500">
                    {errors.connectivity.message}
                  </span>
                )}
              </div>

              <div>
                <DescriptionInput register={register} errors={errors} />
              </div>

              <div>
                <Label>Max RAM Capacity (GB)</Label>
                <Input
                  type="number"
                  {...register("maxRAMCapacityGB", {
                    valueAsNumber: true,
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                />
                {errors.maxRAMCapacityGB && (
                  <span className="text-red-500">
                    {errors.maxRAMCapacityGB.message}
                  </span>
                )}
              </div>

              <div>
                <Label>Max Storage Capacity (GB)</Label>
                <Input
                  type="number"
                  {...register("maxStorageCapacityGB", {
                    valueAsNumber: true,
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                />
                {errors.maxStorageCapacityGB && (
                  <span className="text-red-500">
                    {errors.maxStorageCapacityGB.message}
                  </span>
                )}
              </div>

              <div>
                <Label>Weight (Kg)</Label>
                <Input
                  type="number"
                  step={0.01}
                  {...register("weightKg", {
                    valueAsNumber: true,
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                />
                {errors.weightKg && (
                  <span className="text-red-500">
                    {errors.weightKg.message}
                  </span>
                )}
              </div>

              <div>
                <DimensionsInput errors={errors} register={register} />
              </div>

              <div>
                <Label>Power Consumption (W)</Label>
                <Input
                  type="number"
                  {...register("powerConsumptionW", {
                    valueAsNumber: true,
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                />
                {errors.powerConsumptionW && (
                  <span className="text-red-500">
                    {errors.powerConsumptionW.message}
                  </span>
                )}
              </div>

              <div>
                <Label>Release Year</Label>
                <Input
                  type="number"
                  {...register("releaseYear", {
                    valueAsNumber: true,
                    setValueAs: (value) =>
                      value === "" ? undefined : Number(value),
                  })}
                />
                {errors.releaseYear && (
                  <span className="text-red-500">
                    {errors.releaseYear.message}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manualCollect"
                  checked={watch("manualCollect")}
                  onCheckedChange={(checked) =>
                    setValue("manualCollect", !!checked)
                  }
                  disabled
                />
                <Label htmlFor="manualCollect">Manual Collect *</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="builtinMicrophone"
                  checked={watch("builtinMicrophone")}
                  onCheckedChange={(checked) =>
                    setValue("builtinMicrophone", !!checked)
                  }
                />
                <Label htmlFor="builtinMicrophone">Builtin Microphone</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="builtinSpeakers"
                  checked={watch("builtinSpeakers")}
                  onCheckedChange={(checked) =>
                    setValue("builtinSpeakers", !!checked)
                  }
                />
                <Label htmlFor="builtinSpeakers">Builtin Speakers</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="supportExternalDiscreteGraphicsCard"
                  checked={watch("supportExternalDiscreteGraphicsCard")}
                  onCheckedChange={(checked) =>
                    setValue("supportExternalDiscreteGraphicsCard", !!checked)
                  }
                />
                <Label htmlFor="supportExternalDiscreteGraphicsCard">
                  Supports External Discrete Graphics Card
                </Label>
              </div>
            </TabsContent>
            <TabsContent value="variants">
              <div>
                <VariantsInput
                  control={control}
                  errors={errors}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  getValues={getValues}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-10">
            <Button
              type="submit"
              className="font-semibold text-lg w-full"
              size={"lg"}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <TicketSlash className="h-4 w-4" /> Validating...
                </>
              ) : (
                <>
                  <Save className="h-6 w-6" />{" "}
                  {editId ? "Save changes" : "Create new Mini PC"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Diálogo de confirmación */}
      {formDataToSubmit && (
        <ConfirmationDialog
          isOpen={showConfirmation}
          onClose={handleCloseConfirmation}
          onConfirm={handleConfirmSubmit}
          formData={formDataToSubmit}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
