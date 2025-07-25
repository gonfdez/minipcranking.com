"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
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
  getFormDataWithLabels,
  FormDataWithLabels,
} from "./supabase-functions";

const formSchema = z.object({
  model: z.string().min(1, "Model name is required"),
  fromURL: z.url("Product URL is required"),
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
    es: z.string().min(1, "Spanish description is required"),
    en: z.string().min(1, "English description is required"),
    it: z.string().min(1, "Italian description is required"),
    de: z.string().min(1, "German description is required"),
  }),
  brand: z.string().min(1, "Brand is required"),
  CPU: z.string().min(1, "CPU is required"),
  graphics: z.string().min(1, "Graphics is required"),
  dimensions: z.object({
    widthMM: z.number().int().positive().nullable().optional(),
    heightMM: z.number().int().positive().nullable().optional(),
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
  brand: "",
  CPU: "",
  graphics: "",
  manualCollect: true,
  mainImgUrl: [{ url: "" }],
  portsImgUrl: [{ url: "" }],
  dimensions: {
    widthMM: null,
    heightMM: null,
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

export function MiniPCForm() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] =
    useState<FormDataWithLabels | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

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

      // Obtener los labels para mostrar información legible
      const formDataWithLabels = await getFormDataWithLabels(data);

      // Guardar los datos y mostrar el diálogo de confirmación
      setFormDataToSubmit(formDataWithLabels);
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
      const result = await createMiniPC(formDataToSubmit);

      if (result.success) {
        toast.success("Success!", {
          description: "Mini PC created successfully",
        });

        // Limpiar el formulario
        reset();
        setShowConfirmation(false);
        setFormDataToSubmit(null);
      } else {
        toast.error("Error", {
          description: result.error || "Failed to create Mini PC",
        });
      }
    } catch (error) {
      console.error("Error creating Mini PC:", error);
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
    <div className="w-full mx-auto">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Create a new Mini PC</h1>
        <Button variant={'outline'} onClick={() => (window.location.href = "/dev/minipc-table")}>
          Go to Mini PC's Table
        </Button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Brand *</Label>
          <BrandSelectAndCreate value={brandValue} onChange={onBrandChange} />
          {errors.brand && (
            <span className="text-red-500">{errors.brand.message}</span>
          )}
        </div>

        <div>
          <Label>Model name *</Label>
          <Input
            {...register("model")}
            placeholder="Model name of the Mini PC"
          />
          {errors.model && (
            <span className="text-red-500">{errors.model.message}</span>
          )}
        </div>

        <div>
          <Label>CPU *</Label>
          <CPUSelectAndCreate value={cpuValue} onChange={onCPUChange} />
          {errors.CPU && (
            <span className="text-red-500">{errors.CPU.message}</span>
          )}
        </div>

        <div>
          <Label>Graphics *</Label>
          <GraphicsSelectAndCreate
            value={graphicsValue}
            onChange={onGraphicsChange}
          />
          {errors.graphics && (
            <span className="text-red-500">{errors.graphics.message}</span>
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
          {fields.length === 0 && (
            <Button
              type="button"
              onClick={() => append({ url: "" })}
              className="mt-1"
            >
              + Add First Image URL
            </Button>
          )}

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
                >
                  Remove
                </Button>
              </div>
              {errors.mainImgUrl?.[index]?.url && (
                <span className="text-red-500 block mt-1">
                  {errors.mainImgUrl[index].url.message}
                </span>
              )}
            </div>
          ))}

          {fields.length > 0 && (
            <Button
              type="button"
              onClick={() => append({ url: "" })}
              className="mt-1"
            >
              + Add Image URL
            </Button>
          )}

          {errors.mainImgUrl && (
            <span className="text-red-500 block mt-1">
              {errors.mainImgUrl.message}
            </span>
          )}
        </div>

        <div>
          <Label>Ports Images URL *</Label>
          {portsImagesFields.length === 0 && (
            <Button
              type="button"
              onClick={() => appendPortsImage({ url: "" })}
              className="mt-1"
            >
              + Add First Port Image URL
            </Button>
          )}

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
                >
                  Remove
                </Button>
              </div>
              {errors.portsImgUrl?.[index]?.url && (
                <span className="text-red-500 block mt-1">
                  {errors.portsImgUrl[index].url.message}
                </span>
              )}
            </div>
          ))}

          {portsImagesFields.length > 0 && (
            <Button
              type="button"
              onClick={() => appendPortsImage({ url: "" })}
              className="mt-1"
            >
              + Add Port Image URL
            </Button>
          )}

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
                    `ports.${portKey as keyof typeof defaultValues.ports}`,
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
            onChange={onConnectivityChange}
          />
          {errors.connectivity && (
            <span className="text-red-500">{errors.connectivity.message}</span>
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
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
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
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
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
            {...register("weightKg", {
              valueAsNumber: true,
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {errors.weightKg && (
            <span className="text-red-500">{errors.weightKg.message}</span>
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
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
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
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
          />
          {errors.releaseYear && (
            <span className="text-red-500">{errors.releaseYear.message}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="manualCollect"
            checked={watch("manualCollect")}
            onCheckedChange={(checked) => setValue("manualCollect", !!checked)}
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

        <div>
          <VariantsInput
            control={control}
            errors={errors}
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </div>

        <Button type="submit" size={"lg"} disabled={isSubmitting}>
          {isSubmitting ? "Validating..." : "Create Mini PC"}
        </Button>
      </form>

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
