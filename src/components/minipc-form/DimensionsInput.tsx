import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "./MiniPCForm";

interface DimensionsInputProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export function DimensionsInput({ register, errors }: DimensionsInputProps) {
  return (
    <div className="border border-gray-300 rounded-xl p-4 space-y-4">
      <Label className="text-lg font-semibold block">Dimensions (mm)</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex-1">
          <Label
            htmlFor="dimensions.widthMM"
            className="block text-sm font-medium"
          >
            Width (mm)
          </Label>
          <Input
            type="number"
            step={0.1}
            {...register("dimensions.widthMM", {
              valueAsNumber: true,
              setValueAs: (v) => (v === "" || v === 0 || isNaN(v) ? null : v),
            })}
            placeholder="e.g. 120"
          />
          {errors.dimensions?.widthMM && (
            <span className="text-red-500 text-sm">
              {errors.dimensions.widthMM.message}
            </span>
          )}
        </div>

         <div className="flex-1">
          <Label
            htmlFor="dimensions.lengthMM"
            className="block text-sm font-medium"
          >
            Length (mm)
          </Label>
          <Input
            type="number"
            step={0.1}
            {...register("dimensions.lengthMM", {
              valueAsNumber: true,
              setValueAs: (v) => (v === "" || v === 0 || isNaN(v) ? null : v),
            })}
            placeholder="e.g. 200"
          />
          {errors.dimensions?.lengthMM && (
            <span className="text-red-500 text-sm">
              {errors.dimensions.lengthMM.message}
            </span>
          )}
        </div>

        <div className="flex-1">
          <Label
            htmlFor="dimensions.heightMM"
            className="block text-sm font-medium"
          >
            Height (mm)
          </Label>
          <Input
            type="number"
            step={0.1}
            {...register("dimensions.heightMM", {
              valueAsNumber: true,
              setValueAs: (v) => (v === "" || v === 0 || isNaN(v) ? null : v),
            })}
            placeholder="e.g. 80"
          />
          {errors.dimensions?.heightMM && (
            <span className="text-red-500 text-sm">
              {errors.dimensions.heightMM.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}