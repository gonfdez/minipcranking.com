"use client";

import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { BrandSelectAndCreate } from "./BrandSelectAndCreate";
import { BrandData, CPUWithBrand } from "./types";
import { Edit, Save, SquarePlus } from "lucide-react";
import { CleanInput } from "../ui/CleanInput";

type Props = {
  value: string | undefined;
  onChangeAction: (value: string) => void;
  cpus: CPUWithBrand[];
  brands: BrandData[];
  onDataUpdateAction: () => Promise<void>;
  loading: boolean;
};

export function CPUSelectAndCreate({
  value,
  onChangeAction,
  cpus,
  brands,
  onDataUpdateAction,
  loading,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const [formCpuId, setFormCpuId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    cores: "",
    threads: "",
    baseClockGHz: "",
    boostClockGHz: "",
  });

  function resetForm() {
    setFormCpuId(null);
    setFormData({
      brand: "",
      model: "",
      cores: "",
      threads: "",
      baseClockGHz: "",
      boostClockGHz: "",
    });
  }

  function handleEditCPU(cpuId: number) {
    const cpu = cpus.find((c) => c.id === cpuId);
    if (cpu) {
      setFormCpuId(cpu.id);
      setFormData({
        brand: cpu.brand.toString(),
        model: cpu.model,
        cores: cpu.cores.toString(),
        threads: cpu.threads.toString(),
        baseClockGHz: cpu.baseClockGHz?.toString() || "",
        boostClockGHz: cpu.boostClockGHz?.toString() || "",
      });
      setOpenModal(true);
    }
  }

  async function handleSave() {
    setError(null);

    if (!formData.brand) {
      setError("Brand is required.");
      return;
    }
    if (!formData.model.trim()) {
      setError("Model is required.");
      return;
    }
    if (!formData.cores || Number(formData.cores) <= 0) {
      setError("Cores must be greater than 0.");
      return;
    }
    if (!formData.threads || Number(formData.threads) <= 0) {
      setError("Threads must be greater than 0.");
      return;
    }

    try {
      const payload: any = {
        brand: parseInt(formData.brand),
        model: formData.model.trim(),
        cores: parseInt(formData.cores),
        threads: parseInt(formData.threads),
        baseClockGHz: formData.baseClockGHz
          ? parseFloat(formData.baseClockGHz)
          : null,
        boostClockGHz: formData.boostClockGHz
          ? parseFloat(formData.boostClockGHz)
          : null,
      };

      if (formCpuId) {
        // Update
        const { error } = await supabase
          .from("CPUs")
          .update(payload)
          .eq("id", formCpuId);
        if (error) throw error;
        toast.success("CPU updated successfully");
        await onDataUpdateAction();
      } else {
        // Insert case
        const { data, error } = await supabase
          .from("CPUs")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;

        await onDataUpdateAction();
        toast.success("CPU created successfully");
        setTimeout(() => {
          onChangeAction(data.id.toString());
        }, 100);
      }
      resetForm();
      setOpenModal(false);
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  }

  return (
    <>
      <div className="flex space-x-2 items-center">
        <Select
          onValueChange={onChangeAction}
          value={value}
          disabled={cpus.length === 0 || loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={loading ? "Loading CPUs..." : "Select a CPU"}
            />
          </SelectTrigger>
          <SelectContent>
            {cpus.map((cpu) => (
              <SelectItem key={cpu.id} value={cpu.id.toString()}>
                {(cpu.brandData && (cpu.brandData as any).name) || "Unknown Brand"} {cpu.model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          onClick={() => {
            if (!value) {
              toast.error("Select a CPU to edit");
              return;
            }
            handleEditCPU(parseInt(value));
          }}
          disabled={!value}
          title="Edit CPU"
        >
          <Edit className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          onClick={() => {
            resetForm();
            setOpenModal(true);
          }}
          title="Create new CPU"
        >
          <SquarePlus className="h-4 w-4" />
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
            <DialogTitle>{formCpuId ? "Edit CPU" : "Add New CPU"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpu-brand">Brand *</Label>
              <BrandSelectAndCreate
                value={formData.brand || undefined}
                onChangeAction={(newBrandId) => {
                  setFormData((prev) => ({
                    ...prev,
                    brand: newBrandId,
                  }));
                }}
                brands={brands}
                onDataUpdateAction={onDataUpdateAction}
                loading={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpu-model">Model *</Label>
              <CleanInput
                id="cpu-model"
                placeholder="Enter CPU model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpu-cores">Cores *</Label>
              <Input
                id="cpu-cores"
                placeholder="Number of cores"
                type="number"
                value={formData.cores}
                onChange={(e) =>
                  setFormData({ ...formData, cores: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpu-threads">Threads *</Label>
              <Input
                id="cpu-threads"
                placeholder="Number of threads"
                type="number"
                value={formData.threads}
                onChange={(e) =>
                  setFormData({ ...formData, threads: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpu-base-clock">Base Clock (GHz)</Label>
              <Input
                id="cpu-base-clock"
                placeholder="Base clock frequency"
                type="number"
                value={formData.baseClockGHz}
                onChange={(e) =>
                  setFormData({ ...formData, baseClockGHz: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpu-boost-clock">Boost Clock (GHz)</Label>
              <Input
                id="cpu-boost-clock"
                placeholder="Boost clock frequency"
                type="number"
                value={formData.boostClockGHz}
                onChange={(e) =>
                  setFormData({ ...formData, boostClockGHz: e.target.value })
                }
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setOpenModal(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" /> {formCpuId ? "Save Changes" : "Create CPU"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
