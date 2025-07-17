import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { BrandSelectAndCreate } from "./BrandSelectAndCreate";

interface Graphics {
  id: number;
  model: string;
}

interface GraphicsSelectAndCreateProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

interface FormData {
  id: number | null;
  integrated: boolean;
  brand: string;
  model: string;
  frequencyMHz: string;
  maxTOPS: string;
  graphicCoresCU: string;
}

export function GraphicsSelectAndCreate({
  value,
  onChange,
}: GraphicsSelectAndCreateProps) {
  const [graphics, setGraphics] = useState<Graphics[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: null,
    integrated: true,
    brand: "",
    model: "",
    frequencyMHz: "",
    maxTOPS: "",
    graphicCoresCU: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGraphics();
  }, []);

  async function fetchGraphics() {
    setLoading(true);
    const { data, error } = await supabase
      .from("Graphics")
      .select("id, model")
      .order("model");

    if (error) {
      console.error("Error fetching graphics:", error);
    } else {
      setGraphics(data || []);
    }
    setLoading(false);
  }

  function handleEditGraphics(graphicsId: number) {
    supabase
      .from("Graphics")
      .select("*")
      .eq("id", graphicsId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error("Error fetching graphics details");
          return;
        }
        setFormData({
          id: data.id,
          integrated: data.integrated,
          brand: data.brand.toString(),
          model: data.model,
          frequencyMHz: data.frequencyMHz?.toString() || "",
          maxTOPS: data.maxTOPS?.toString() || "",
          graphicCoresCU: data.graphicCoresCU?.toString() || "",
        });
        setOpenModal(true);
      });
  }

  function resetForm() {
    setFormData({
      id: null,
      integrated: true,
      brand: "",
      model: "",
      frequencyMHz: "",
      maxTOPS: "",
      graphicCoresCU: "",
    });
    setError(null);
  }

  async function handleSave() {
    setError(null);

    if (!formData.brand.trim()) {
      setError("Brand is required.");
      return;
    }

    if (!formData.model.trim()) {
      setError("Model is required.");
      return;
    }

    const payload = {
      integrated: formData.integrated,
      brand: Number(formData.brand),
      model: formData.model.trim(),
      frequencyMHz: formData.frequencyMHz
        ? Number(formData.frequencyMHz)
        : null,
      maxTOPS: formData.maxTOPS ? Number(formData.maxTOPS) : null,
      graphicCoresCU: formData.graphicCoresCU
        ? Number(formData.graphicCoresCU)
        : null,
    };

    if (formData.id) {
      const { error } = await supabase
        .from("Graphics")
        .update(payload)
        .eq("id", formData.id);

      if (error) {
        toast.error(`Error updating Graphics: ${error.message}`);
        return;
      }

      toast.success("Graphics updated successfully");
      fetchGraphics();
    } else {
      const { data, error } = await supabase
        .from("Graphics")
        .insert(payload)
        .select()
        .single();

      if (error) {
        toast.error(`Error creating Graphics: ${error.message}`);
        return;
      }

      if (data) {
        setGraphics((prev) => [...prev, data]);
        onChange(data.id.toString());
        toast.success("Graphics created successfully");
      }
    }

    setOpenModal(false);
    resetForm();
  }

  return (
    <>
      <div className="flex space-x-2 items-center w-full">
        <Select
          onValueChange={onChange}
          value={value}
          disabled={graphics.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={loading ? "Loading Graphics..." : "Select Graphics"}
            />
          </SelectTrigger>
          <SelectContent>
            {graphics.map((g) => (
              <SelectItem key={g.id} value={g.id.toString()}>
                {g.model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          onClick={() => {
            if (!value) {
              toast.error("Select a Graphics to edit");
              return;
            }
            handleEditGraphics(parseInt(value));
          }}
          disabled={!value}
        >
          Edit Graphics
        </Button>

        <Button
          type="button"
          onClick={() => {
            resetForm();
            setOpenModal(true);
          }}
        >
          + Add Graphics
        </Button>
      </div>

      <Dialog
        open={openModal}
        onOpenChange={(open) => {
          setOpenModal(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {formData.id ? "Edit Graphics" : "Add New Graphics"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="graphics-brand">Brand *</Label>
              <BrandSelectAndCreate
                value={formData.brand || undefined}
                onChange={(newBrandId) => {
                  setFormData((prev) => ({
                    ...prev,
                    brand: newBrandId,
                  }));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graphics-model">Model *</Label>
              <Input
                id="graphics-model"
                placeholder="Enter graphics model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="graphics-integrated"
                checked={formData.integrated}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, integrated: !!checked })
                }
              />
              <Label htmlFor="graphics-integrated">Integrated</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="graphics-frequency">Frequency (MHz)</Label>
              <Input
                id="graphics-frequency"
                placeholder="Enter frequency in MHz"
                type="number"
                value={formData.frequencyMHz}
                onChange={(e) =>
                  setFormData({ ...formData, frequencyMHz: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graphics-max-tops">Max TOPS</Label>
              <Input
                id="graphics-max-tops"
                placeholder="Enter max TOPS"
                type="number"
                value={formData.maxTOPS}
                onChange={(e) =>
                  setFormData({ ...formData, maxTOPS: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graphics-cores">Graphic Cores CU</Label>
              <Input
                id="graphics-cores"
                placeholder="Enter number of graphic cores"
                type="number"
                value={formData.graphicCoresCU}
                onChange={(e) =>
                  setFormData({ ...formData, graphicCoresCU: e.target.value })
                }
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpenModal(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSave}>
                {formData.id ? "Save Changes" : "Create Graphics"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
