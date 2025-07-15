"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BrandSelectAndCreate } from "./BrandSelectAndCreate";
import { CPUSelectAndCreate } from "./CPUSelectAndCreate";
import { GraphicsSelectAndCreate } from "./GraphicsSelectAndCreate";
import { DescriptionInput } from "./DescriptionInput";
import { DimensionsInput } from "./DimensionsInput";
import { ConnectivitySelectAndCreate } from "./ConnectivitySelectAndCreate";
import { VariantsInput } from "./VariantsInput";

const formSchema = z.object({
  model: z.string().min(1),
  fromURL: z.url(),
  manualCollect: z.boolean(),
  maxRAMCapacityGB: z.number().int().nonnegative().optional(),
  maxStorageCapacityGB: z.number().int().nonnegative().optional(),
  weightKg: z.number().positive().optional(),
  powerConsumptionW: z.number().positive().optional(),
  releaseYear: z.number().int().optional(),
  mainImgUrl: z
    .array(
      z.object({
        url: z.url().min(1),
      })
    )
    .min(1, "At least one image URL is required"),
  description: z.object({
    es: z.string().min(1, "Spanish description is required"),
    en: z.string().min(1, "English description is required"),
    it: z.string().min(1, "Italian description is required"),
    de: z.string().min(1, "German description is required"),
  }),
  brand: z.string(),
  CPU: z.string(),
  graphics: z.string(),
  dimensions: z.object({
    widthMM: z.number().int().positive().nullable().optional(),
    heightMM: z.number().int().positive().nullable().optional(),
  }),
  portsImgUrl: z
    .array(
      z.object({
        url: z.url().min(1),
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
  // Nueva sección de variantes
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
  manualCollect: true,
  mainImgUrl: [{ url: "" }],
  dimensions: {
    widthMM: null,
    heightMM: null,
  },
  portsImgUrl: [{ url: "" }],
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
  // Nuevos valores por defecto para variantes
  variants: [],
};

export function MiniPCForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
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

  const onSubmit = (data: FormData) => {
    console.log("Form data submitted:", data);
    // TODO: Integrate with Supabase insert
  };

  return (
    <div className="w-full max-w-[800px] mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a new MiniPC</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Brand</Label>
          <BrandSelectAndCreate value={brandValue} onChange={onBrandChange} />
          {errors.brand && (
            <span className="text-red-500">{errors.brand.message}</span>
          )}
        </div>

        <div>
          <Label>Model name</Label>
          <Input {...register("model")} />
          {errors.model && (
            <span className="text-red-500">{errors.model.message}</span>
          )}
        </div>

        <div>
          <Label>Product Images URL</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
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
          ))}

          <Button
            type="button"
            onClick={() => append({ url: "" })}
            className="mt-2"
          >
            + Add Image URL
          </Button>

          {errors.mainImgUrl && (
            <span className="text-red-500">
              {errors.mainImgUrl.message as string}
            </span>
          )}
        </div>

        <div>
          <Label>CPU</Label>
          <CPUSelectAndCreate value={cpuValue} onChange={onCPUChange} />
          {errors.CPU && (
            <span className="text-red-500">{errors.CPU.message}</span>
          )}
        </div>

        <div>
          <Label>Graphics</Label>
          <GraphicsSelectAndCreate
            value={graphicsValue}
            onChange={onGraphicsChange}
          />
          {errors.graphics && (
            <span className="text-red-500">{errors.graphics.message}</span>
          )}
        </div>

        <div>
          <Label>Product URL</Label>
          <Input {...register("fromURL")} />
          {errors.fromURL && (
            <span className="text-red-500">{errors.fromURL.message}</span>
          )}
        </div>

        <div>
          <DescriptionInput register={register} errors={errors} />
        </div>

        <div>
          <Label>Max RAM Capacity (GB)</Label>
          <Input
            type="number"
            {...register("maxRAMCapacityGB", { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label>Max Storage Capacity (GB)</Label>
          <Input
            type="number"
            {...register("maxStorageCapacityGB", { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label>Weight (Kg)</Label>
          <Input
            type="number"
            {...register("weightKg", { valueAsNumber: true })}
          />
        </div>

        <div>
          <DimensionsInput errors={errors} register={register} />
        </div>

        <div>
          <Label>Power Consumption (W)</Label>
          <Input
            type="number"
            {...register("powerConsumptionW", { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label>Release Year</Label>
          <Input
            type="number"
            {...register("releaseYear", { valueAsNumber: true })}
          />
        </div>

        {/* Ports Images Section */}
        <div>
          <Label>Ports Images URL</Label>
          {portsImagesFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mb-2">
              <Input
                {...register(`portsImgUrl.${index}.url`)}
                placeholder="https://example.com/ports_image.jpg"
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
          ))}

          <Button
            type="button"
            onClick={() => appendPortsImage({ url: "" })}
            className="mt-2"
          >
            + Add Ports Image
          </Button>

          {errors.portsImgUrl && (
            <span className="text-red-500">{errors.portsImgUrl.message}</span>
          )}
        </div>

        {/* Ports Types Quantities */}
        <div className="border border-gray-300 rounded-xl p-4 space-y-4">
          <Label className="text-lg font-semibold block">Ports Quantity</Label>
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
          <Label>Connectivity</Label>
          <ConnectivitySelectAndCreate
            value={connectivityValue}
            onChange={onConnectivityChange}
          />
          {errors.connectivity && (
            <span className="text-red-500">{errors.connectivity.message}</span>
          )}
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

        <div className="flex items-center space-x-2">
          <Checkbox
            id="manualCollect"
            checked={watch("manualCollect")}
            onCheckedChange={(checked) => setValue("manualCollect", !!checked)}
            disabled
          />
          <Label id="manualCollect">Manual Collect</Label>
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

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
