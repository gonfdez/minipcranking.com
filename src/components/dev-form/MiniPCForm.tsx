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
  brand: z.string().optional(),
  CPU: z.string(),
  graphics: z.string(),

  builtinMicrophone: z.boolean().optional(),
  builtinSpeakers: z.boolean().optional(),
  supportExternalDiscreteGraphicsCard: z.boolean().optional(),
});

export type FormData = z.infer<typeof formSchema>;

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
    defaultValues: {
      brand: "",
      manualCollect: true,
      mainImgUrl: [{ url: "" }],
    },
  });

  const brandValue = watch("brand");
  const onBrandChange = (value: string) => setValue("brand", value);

  const cpuValue = watch("CPU");
  const onCPUChange = (value: string) => setValue("CPU", value);

  const graphicsValue = watch("graphics");
  const onGraphicsChange = (value: string) => setValue("graphics", value);

  const { fields, append, remove } = useFieldArray<FormData>({
    name: "mainImgUrl",
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
          <Label>Main image URL</Label>
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
          <Label>Dimensions</Label>
          <span>TODO</span>
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

        <div>
          <Label>Ports</Label>
          <span>TODO ports images array and pc ports </span>
        </div>

        <div>
          <Label>Connectivity</Label>
          <span>TODO connectivity array</span>
        </div>

        <div>
          <Label>Variants</Label>
          <span>TODO</span>
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
