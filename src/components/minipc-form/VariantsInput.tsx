import {
  useFieldArray,
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  UseFormGetValues,
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
import { Trash2, SquarePlus } from "lucide-react";
import { FormData } from "./MiniPCForm";

interface VariantsInputProps {
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
  getValues: UseFormGetValues<FormData>;
}

const RAM_TYPES = ["DDR4", "DDR5", "LPDDR4", "LPDDR5", "DDR3", "LPDDR3"];

const STORAGE_TYPES = ["SSD", "HDD", "eMMC", "NVMe SSD", "SATA SSD", "M.2 SSD"];

export function VariantsInput({
  control,
  errors,
  register,
  setValue,
  watch,
  getValues
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
    <div className="border border-gray-300 rounded-xl p-4 space-y-4">
      <Label className="text-lg font-semibold">Variants *</Label>

      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No variants added yet. Click "Add Variant" to start.</p>
        </div>
      )}

      {fields.map((field, variantIndex) => {
        const variantData = getValues(`variants.${variantIndex}`);
        return (
        <VariantCard
          key={field.id}
          id={variantData.id}
          variantIndex={variantIndex}
          control={control}
          register={register}
          setValue={setValue}
          watch={watch}
          errors={errors}
          onRemove={() => removeVariant(variantIndex)}
        />
        )
      })}

      {/* Forzar mostrar error cuando no hay variantes Y hay error */}
      {(errors.variants || fields.length === 0) && (
        <span className="text-red-500">
          {errors.variants?.message ||
            (fields.length === 0 ? "At least one variant is required" : "")}
        </span>
      )}

      <div className="flex justify-end mt-4">
        <Button type="button" onClick={addVariant}>
          <SquarePlus className="h-4 w-4" />
          Add Variant
        </Button>
      </div>
    </div>
  );
}

interface VariantCardProps {
  id: number | undefined;
  variantIndex: number;
  control: Control<FormData>;
  register: UseFormRegister<FormData>;
  setValue: UseFormSetValue<FormData>;
  watch: UseFormWatch<FormData>;
  errors: FieldErrors<FormData>;
  onRemove: () => void;
}

function VariantCard({
  id,
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
    appendOffer({ url: "", price: NaN });
  };

  const currentRAMType = watch(`variants.${variantIndex}.RAM_type`);
  const currentStorageType = watch(`variants.${variantIndex}.storage_type`);

  const getVariantTitle = () => {
    if (id) {
      return `Variant ID: ${id}`;
    }
    return `New Variant`;
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{getVariantTitle()}</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700"
            title="Remove Variant"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* RAM Configuration */}
        <div className="space-y-2">
          <Label className=" font-medium">RAM Configuration *</Label>
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label htmlFor={`ram-capacity-${variantIndex}`} className="">
                Capacity (GB)
              </Label>
              <Input
                id={`ram-capacity-${variantIndex}`}
                type="number"
                min="1"
                placeholder="e.g., 16"
                {...register(`variants.${variantIndex}.RAMGB`, {
                  valueAsNumber: true,
                  required: "RAM capacity is required",
                })}
              />
              {errors.variants?.[variantIndex]?.RAMGB && (
                <span className="text-red-500 ">
                  {errors.variants[variantIndex].RAMGB.message}
                </span>
              )}
            </div>

            <div className="w-1/2">
              <Label htmlFor={`ram-type-${variantIndex}`} className="">
                Type
              </Label>
              <Select
                value={currentRAMType}
                onValueChange={(value) =>
                  setValue(`variants.${variantIndex}.RAM_type`, value)
                }
              >
                <SelectTrigger
                  id={`ram-type-${variantIndex}`}
                  className="w-full"
                >
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
                <span className="text-red-500 ">
                  {errors.variants[variantIndex].RAM_type.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Storage Configuration */}
        <div className="space-y-2">
          <Label className=" font-medium">Storage Configuration *</Label>
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label htmlFor={`storage-capacity-${variantIndex}`} className="">
                Capacity (GB)
              </Label>
              <Input
                id={`storage-capacity-${variantIndex}`}
                type="number"
                min="1"
                placeholder="e.g., 512"
                {...register(`variants.${variantIndex}.storageGB`, {
                  valueAsNumber: true,
                  required: "Storage capacity is required",
                })}
              />
              {errors.variants?.[variantIndex]?.storageGB && (
                <span className="text-red-500 ">
                  {errors.variants[variantIndex].storageGB.message}
                </span>
              )}
            </div>

            <div className="w-1/2">
              <Label htmlFor={`storage-type-${variantIndex}`} className="">
                Type
              </Label>
              <Select
                value={currentStorageType}
                onValueChange={(value) =>
                  setValue(`variants.${variantIndex}.storage_type`, value)
                }
              >
                <SelectTrigger
                  id={`storage-type-${variantIndex}`}
                  className="w-full"
                >
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
                <span className="text-red-500 ">
                  {errors.variants[variantIndex].storage_type.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Offers Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <Label className="font-medium">Offers *</Label>
            <Button
              type="button"
              onClick={addOffer}
              variant="outline"
              size="sm"
            >
              <SquarePlus className="h-4 w-4 mr-2" />
              Add Offer
            </Button>
          </div>

          {/* Headers para las columnas de ofertas */}
          <div className="grid grid-cols-12 gap-2 mb-2">
            <div className="col-span-8">
              <Label className="font-medium text-gray-600">URL</Label>
            </div>
            <div className="col-span-3">
              <Label className="font-medium text-gray-600">Price (USD)</Label>
            </div>
            <div className="col-span-1">
              <Label className="font-medium text-gray-600">Action</Label>
            </div>
          </div>

          {offerFields.map((offerField, offerIndex) => (
            <div
              key={offerField.id}
              className="grid grid-cols-12 gap-2 mb-3 items-start"
            >
              <div className="col-span-8">
                <Input
                  placeholder="https://example.com/product"
                  {...register(
                    `variants.${variantIndex}.offers.${offerIndex}.url`,
                    {
                      required: "Offer URL is required",
                    }
                  )}
                />
                {errors.variants?.[variantIndex]?.offers?.[offerIndex]?.url && (
                  <span className="text-red-500 block mt-1">
                    {
                      errors.variants[variantIndex].offers[offerIndex].url
                        .message
                    }
                  </span>
                )}
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="299.99"
                  {...register(
                    `variants.${variantIndex}.offers.${offerIndex}.price`,
                    {
                      valueAsNumber: true,
                      required: "Price is required",
                    }
                  )}
                />
                {errors.variants?.[variantIndex]?.offers?.[offerIndex]
                  ?.price && (
                  <span className="text-red-500 block mt-1">
                    {
                      errors.variants[variantIndex].offers[offerIndex].price
                        .message
                    }
                  </span>
                )}
              </div>
              <div className="col-span-1 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeOffer(offerIndex)}
                  disabled={offerFields.length === 1}
                  className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                  title="Remove row"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {errors.variants?.[variantIndex]?.offers && (
            <span className="text-red-500 ">
              {errors.variants[variantIndex].offers.message}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
