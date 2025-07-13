"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrandSelectAndCreate } from "./BrandSelectAndCreate";
import { CPUSelectAndCreate } from "./CPUSelectAndCreate";

const formSchema = z.object({
  model: z.string().min(1),
  fromURL: z.url(),
  manualCollect: z.boolean(),
  maxRAMCapacityGB: z.number().int().nonnegative().optional(),
  maxStorageCapacityGB: z.number().int().nonnegative().optional(),
  weightKg: z.number().positive().optional(),
  powerConsumptionW: z.number().positive().optional(),
  releaseYear: z.number().int().optional(),

  brand: z.string().optional(),
  CPU: z.string(),
  graphics: z.string(),

  builtinMicrophone: z.boolean().optional(),
  builtinSpeakers: z.boolean().optional(),
  supportExternalDiscreteGraphicsCard: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function MiniPCForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      manualCollect: true,
    },
  });

  const brandValue = watch("brand");
  const onBrandChange = (value: string) => setValue("brand", value);

  const cpuValue = watch("CPU");
  const onCPUChange = (value: string) => setValue("CPU", value);

  const onSubmit = (data: FormData) => {
    console.log("Form data submitted:", data);
    // TODO: Integrate with Supabase insert
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create a new MiniPC</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Brand</Label>
          <BrandSelectAndCreate value={brandValue} onChange={onBrandChange} />
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
          <span>TODO</span>
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
          <Select onValueChange={(value) => setValue("graphics", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Graphics Card" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Graphics 1</SelectItem>
              <SelectItem value="2">Graphics 2</SelectItem>
            </SelectContent>
          </Select>
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
          <Label>Description</Label>
          <span>TODO</span>
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
