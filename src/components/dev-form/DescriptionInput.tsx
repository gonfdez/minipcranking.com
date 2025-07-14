import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData } from "./MiniPCForm";

interface DescriptionInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<FormData>;
}

export function DescriptionInput({ register, errors }: DescriptionInputProps) {
  return (
    <div className="space-y-4">
      <Label className="text-lg">Product Description</Label>

      <div>
        <Label>Spanish (ES)</Label>
        <Textarea
          {...register("description.es")}
          placeholder="Descripción en español"
        />
        {errors.description?.es && (
          <span className="text-red-500">{errors.description.es.message}</span>
        )}
      </div>

      <div>
        <Label>English (EN)</Label>
        <Textarea
          {...register("description.en")}
          placeholder="Description in English"
        />
        {errors.description?.en && (
          <span className="text-red-500">{errors.description.en.message}</span>
        )}
      </div>

      <div>
        <Label>Italian (IT)</Label>
        <Textarea
          {...register("description.it")}
          placeholder="Description in italian"
        />
        {errors.description?.it && (
          <span className="text-red-500">{errors.description.it.message}</span>
        )}
      </div>

      <div>
        <Label>German (DE)</Label>
        <Textarea
          {...register("description.de")}
          placeholder="Description in German"
        />
        {errors.description?.de && (
          <span className="text-red-500">{errors.description.de.message}</span>
        )}
      </div>
    </div>
  );
}
