import {
  useFieldArray,
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

// Tipos para las variantes
export type VariantOffer = {
  url: string;
  price: number;
};

export type Variant = {
  RAMGB: number;
  RAM_type: string;
  storageGB: number;
  storage_type: string;
  offers: VariantOffer[];
};

// Importa FormData desde el archivo principal
import { FormData } from "./MiniPCForm";

interface VariantsInputProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
}

const RAM_TYPES = ["DDR4", "DDR5", "LPDDR4", "LPDDR5", "DDR3", "LPDDR3"];

const STORAGE_TYPES = ["SSD", "HDD", "eMMC", "NVMe SSD", "SATA SSD", "M.2 SSD"];

export function VariantsInput({
  control,
  errors,
  register,
  setValue,
  watch,
}: VariantsInputProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const addVariant = () => {
    append({
      RAMGB: NaN,
      RAM_type: "DDR4",
      storageGB: NaN,
      storage_type: "SSD",
      offers: [{ url: "", price: NaN }],
    });
  };

  const removeVariant = (index: number) => {
    remove(index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Variants *</Label>
        <Button type="button" onClick={addVariant}>
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No variants added yet. Click "Add Variant" to start.</p>
        </div>
      )}

      {fields.map((field, variantIndex) => (
        <VariantCard
          key={field.id}
          variantIndex={variantIndex}
          control={control}
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          onRemove={() => removeVariant(variantIndex)}
        />
      ))}

      {errors.variants && (
        <span className="text-red-500">{errors.variants.message}</span>
      )}
    </div>
  );
}

interface VariantCardProps {
  variantIndex: number;
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
  errors: FieldErrors<FormData>;
  onRemove: () => void;
}

function VariantCard({
  variantIndex,
  control,
  register,
  setValue,
  watch,
  errors,
  onRemove,
}: VariantCardProps) {
  const {
    fields: offerFields,
    append: appendOffer,
    remove: removeOffer,
  } = useFieldArray({
    control,
    name: `variants.${variantIndex}.offers` as const,
  });

  const addOffer = () => {
    appendOffer({ url: "", price: 0 });
  };

  const currentRAMType = watch(`variants.${variantIndex}.RAM_type`);
  const currentStorageType = watch(`variants.${variantIndex}.storage_type`);

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Variant {variantIndex + 1}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* RAM Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>RAM Capacity (GB)</Label>
            <Input
              type="number"
              min="1"
              {...register(`variants.${variantIndex}.RAMGB`, {
                valueAsNumber: true,
                required: "RAM capacity is required",
              })}
            />
            {errors.variants?.[variantIndex]?.RAMGB && (
              <span className="text-red-500">
                {errors.variants[variantIndex].RAMGB.message}
              </span>
            )}
          </div>

          <div>
            <Label>RAM Type</Label>
            <Select
              value={currentRAMType}
              onValueChange={(value) =>
                setValue(`variants.${variantIndex}.RAM_type`, value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select RAM type" />
              </SelectTrigger>
              <SelectContent>
                {RAM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.variants?.[variantIndex]?.RAM_type && (
              <span className="text-red-500">
                {errors.variants[variantIndex].RAM_type.message}
              </span>
            )}
          </div>
        </div>

        {/* Storage Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Storage Capacity (GB)</Label>
            <Input
              type="number"
              min="1"
              {...register(`variants.${variantIndex}.storageGB`, {
                valueAsNumber: true,
                required: "Storage capacity is required",
              })}
            />
            {errors.variants?.[variantIndex]?.storageGB && (
              <span className="text-red-500">
                {errors.variants[variantIndex].storageGB.message}
              </span>
            )}
          </div>

          <div>
            <Label>Storage Type</Label>
            <Select
              value={currentStorageType}
              onValueChange={(value) =>
                setValue(`variants.${variantIndex}.storage_type`, value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select storage type" />
              </SelectTrigger>
              <SelectContent>
                {STORAGE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.variants?.[variantIndex]?.storage_type && (
              <span className="text-red-500">
                {errors.variants[variantIndex].storage_type.message}
              </span>
            )}
          </div>
        </div>

        {/* Offers Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <Label className="font-medium">Offers</Label>
            <Button
              type="button"
              onClick={addOffer}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Offer
            </Button>
          </div>

          {offerFields.map((offerField, offerIndex) => (
            <div
              key={offerField.id}
              className="flex items-center space-x-2 mb-3"
            >
              <div className="flex-1">
                <Input
                  placeholder="Offer URL"
                  {...register(
                    `variants.${variantIndex}.offers.${offerIndex}.url`,
                    {
                      required: "Offer URL is required",
                    }
                  )}
                />
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Price"
                  {...register(
                    `variants.${variantIndex}.offers.${offerIndex}.price`,
                    {
                      valueAsNumber: true,
                      required: "Price is required",
                    }
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOffer(offerIndex)}
                disabled={offerFields.length === 1}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {errors.variants?.[variantIndex]?.offers && (
            <span className="text-red-500">
              {errors.variants[variantIndex].offers.message}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
