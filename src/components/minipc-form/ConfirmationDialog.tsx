import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormDataWithLabels } from "./supabase-functions";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  formData: FormDataWithLabels;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  formData,
  isLoading = false,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-h-[85vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Confirm MiniPC Creation</DialogTitle>
          <DialogDescription>
            Please review the information below before creating the MiniPC
            entry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Brand:</span>{" "}
                {formData.brandLabel || formData.brand}
              </div>
              <div>
                <span className="font-medium">Model:</span> {formData.model}
              </div>
              <div>
                <span className="font-medium">CPU:</span>{" "}
                {formData.cpuLabel || formData.CPU}
              </div>
              <div>
                <span className="font-medium">Graphics:</span>{" "}
                {formData.graphicsLabel || formData.graphics}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Product URL:</span>{" "}
                <a
                  href={formData.fromURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {formData.fromURL}
                </a>
              </div>
              {formData.manualURL && (
                <div className="col-span-2">
                  <span className="font-medium">Manual URL:</span>{" "}
                  <a
                    href={formData.manualURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {formData.manualURL}
                  </a>
                </div>
              )}
              <div>
                <span className="font-medium">Manual Collect:</span>{" "}
                {formData.manualCollect ? "Yes" : "No"}
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.maxRAMCapacityGB && (
                <div>
                  <span className="font-medium">Max RAM Capacity:</span>{" "}
                  {formData.maxRAMCapacityGB} GB
                </div>
              )}
              {formData.maxStorageCapacityGB && (
                <div>
                  <span className="font-medium">Max Storage Capacity:</span>{" "}
                  {formData.maxStorageCapacityGB} GB
                </div>
              )}
              {formData.weightKg && (
                <div>
                  <span className="font-medium">Weight:</span>{" "}
                  {formData.weightKg} kg
                </div>
              )}
              {formData.powerConsumptionW && (
                <div>
                  <span className="font-medium">Power Consumption:</span>{" "}
                  {formData.powerConsumptionW} W
                </div>
              )}
              {formData.releaseYear && (
                <div>
                  <span className="font-medium">Release Year:</span>{" "}
                  {formData.releaseYear}
                </div>
              )}
            </div>
          </div>

          {/* Dimensions */}
          {(formData.dimensions.widthMM || formData.dimensions.heightMM || formData.dimensions.lengthMM) && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Dimensions</h3>
              <div className="grid grid-cols-3 gap-4">
                {formData.dimensions.widthMM && (
                  <div>
                    <span className="font-medium">Width:</span>{" "}
                    {formData.dimensions.widthMM} mm
                  </div>
                )}
                {formData.dimensions.heightMM && (
                  <div>
                    <span className="font-medium">Height:</span>{" "}
                    {formData.dimensions.heightMM} mm
                  </div>
                )}
                {formData.dimensions.lengthMM && (
                  <div>
                    <span className="font-medium">Length:</span>{" "}
                    {formData.dimensions.lengthMM} mm
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Features</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Builtin Microphone:</span>{" "}
                {formData.builtinMicrophone ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-medium">Builtin Speakers:</span>{" "}
                {formData.builtinSpeakers ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-medium">
                  Supports External Graphics Card:
                </span>{" "}
                {formData.supportExternalDiscreteGraphicsCard ? "Yes" : "No"}
              </div>
            </div>
          </div>

          {/* Ports */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Ports</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(formData.ports).map(
                ([portKey, value]) =>
                  value !== null &&
                  value !== undefined && (
                    <div key={portKey}>
                      <span className="font-medium">
                        {portKey.toUpperCase()}:
                      </span>{" "}
                      {value}
                    </div>
                  )
              )}
            </div>
          </div>

          {/* Connectivity */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Connectivity</h3>
            <div className="flex flex-wrap gap-2">
              {formData.connectivityLabels
                ? formData.connectivityLabels.map((label, index) => (
                    <Badge key={index} variant="outline">
                      {label}
                    </Badge>
                  ))
                : formData.connectivity.map((conn, index) => (
                    <Badge key={index} variant="outline">
                      {conn}
                    </Badge>
                  ))}
            </div>
          </div>

          {/* Images */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Images</h3>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Main Images:</span>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {formData.mainImgUrl.map((img, index) => (
                    <li key={index} className="text-sm">
                      <a
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {img.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-medium">Port Images:</span>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {formData.portsImgUrl.map((img, index) => (
                    <li key={index} className="text-sm">
                      <a
                        href={img.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {img.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Descriptions</h3>
            <div className="space-y-3">
              {Object.entries(formData.description).map(([lang, desc]) => (
                <div key={lang}>
                  <span className="font-medium">{lang.toUpperCase()}:</span>
                  <p className="text-sm text-gray-600 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Variants */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">
              Variants ({formData.variants.length})
            </h3>
            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">Variant {index + 1}</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="font-medium">RAM:</span> {variant.RAMGB}{" "}
                      GB ({variant.RAM_type})
                    </div>
                    <div>
                      <span className="font-medium">Storage:</span>{" "}
                      {variant.storageGB} GB ({variant.storage_type})
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="font-medium">Offers:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {variant.offers.map((offer, offerIndex) => (
                        <li key={offerIndex} className="text-sm">
                          <span className="font-medium">${offer.price}</span> -{" "}
                          <a
                            href={offer.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {offer.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create MiniPC"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}