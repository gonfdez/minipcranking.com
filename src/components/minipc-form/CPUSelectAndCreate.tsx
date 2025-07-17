"use client";

import React, { useEffect, useState } from "react";
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

type Brand = { id: number; name: string };
type CPU = {
  id: number;
  brand: number;
  model: string;
  cores: number;
  threads: number;
  baseClockGHz?: number | null;
  boostClockGHz?: number | null;
};

type Props = {
  value: string | undefined;
  onChange: (value: string) => void;
};

export function CPUSelectAndCreate({ value, onChange }: Props) {
  const [cpus, setCpus] = useState<CPU[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    fetchCPUs();
  }, []);

  async function fetchCPUs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("CPUs")
      .select("*")
      .order("model");
    if (!error && data) setCpus(data);
    setLoading(false);
  }

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
          ? parseInt(formData.baseClockGHz)
          : null,
        boostClockGHz: formData.boostClockGHz
          ? parseInt(formData.boostClockGHz)
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
      } else {
        // Insert
        const { data, error } = await supabase
          .from("CPUs")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        setCpus((prev) => [...prev, data]);
        onChange(data.id.toString());
        toast.success("CPU created successfully");
      }
      fetchCPUs();
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
          onValueChange={onChange}
          value={value}
          disabled={cpus.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={loading ? "Loading CPUs..." : "Select a CPU"}
            />
          </SelectTrigger>
          <SelectContent>
            {cpus.map((cpu) => (
              <SelectItem key={cpu.id} value={cpu.id.toString()}>
                {cpu.model}
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
        >
          Edit CPU
        </Button>

        <Button
          type="button"
          onClick={() => {
            resetForm();
            setOpenModal(true);
          }}
        >
          + Add CPU
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
            <DialogTitle>{formCpuId ? "Edit CPU" : "Add New CPU"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpu-brand">Brand *</Label>
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
              <Label htmlFor="cpu-model">Model *</Label>
              <Input
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
                {formCpuId ? "Save Changes" : "Create CPU"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
