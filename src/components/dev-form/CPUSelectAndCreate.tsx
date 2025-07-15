"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        <Select onValueChange={onChange} value={value}>
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                loading
                  ? "Loading CPUs..."
                  : cpus.length === 0
                  ? "No CPUs available"
                  : "Select a CPU"
              }
            />
          </SelectTrigger>
          {cpus.length > 0 && (
            <SelectContent>
              {cpus.map((cpu) => (
                <SelectItem key={cpu.id} value={cpu.id.toString()}>
                  {cpu.model}
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>

        <Button
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

          <div className="space-y-3">
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

            <Input
              placeholder="Cores"
              type="number"
              value={formData.cores}
              onChange={(e) =>
                setFormData({ ...formData, cores: e.target.value })
              }
            />
            <Input
              placeholder="Threads"
              type="number"
              value={formData.threads}
              onChange={(e) =>
                setFormData({ ...formData, threads: e.target.value })
              }
            />
            <Input
              placeholder="Base Clock (GHz)"
              type="number"
              value={formData.baseClockGHz}
              onChange={(e) =>
                setFormData({ ...formData, baseClockGHz: e.target.value })
              }
            />
            <Input
              placeholder="Boost Clock (GHz)"
              type="number"
              value={formData.boostClockGHz}
              onChange={(e) =>
                setFormData({ ...formData, boostClockGHz: e.target.value })
              }
            />

            {error && <p className="text-red-600">{error}</p>}
            <div className="flex justify-end space-x-2">
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
