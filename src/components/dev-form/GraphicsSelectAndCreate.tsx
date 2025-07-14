import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    integrated: false,
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
      integrated: false,
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

    if (!formData.model.trim()) {
      setError("Model is required.");
      return;
    }

    if (!formData.brand.trim()) {
      setError("Brand is required.");
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
        <Select onValueChange={onChange} value={value}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                loading
                  ? "Loading Graphics..."
                  : graphics.length === 0
                  ? "No Graphics available"
                  : "Select Graphics"
              }
            />
          </SelectTrigger>
          {graphics.length > 0 && (
            <SelectContent>
              {graphics.map((g) => (
                <SelectItem key={g.id} value={g.id.toString()}>
                  {g.model}
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>

        <Button
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formData.id ? "Edit Graphics" : "Add New Graphics"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <BrandSelectAndCreate
              value={formData.brand || undefined}
              onChange={(newBrandId) => {
                setFormData((prev) => ({
                  ...prev,
                  brand: newBrandId,
                }));
              }}
            />
            <Input
              placeholder="Model"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
            />
            <Checkbox
              checked={formData.integrated}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, integrated: !!checked })
              }
            />{" "}
            Integrated
            <Input
              placeholder="Frequency (MHz)"
              value={formData.frequencyMHz}
              onChange={(e) =>
                setFormData({ ...formData, frequencyMHz: e.target.value })
              }
            />
            <Input
              placeholder="Max TOPS"
              value={formData.maxTOPS}
              onChange={(e) =>
                setFormData({ ...formData, maxTOPS: e.target.value })
              }
            />
            <Input
              placeholder="Graphic Cores CU"
              value={formData.graphicCoresCU}
              onChange={(e) =>
                setFormData({ ...formData, graphicCoresCU: e.target.value })
              }
            />
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {formData.id ? "Save Changes" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
