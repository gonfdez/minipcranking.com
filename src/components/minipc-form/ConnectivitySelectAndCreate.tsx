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
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";

type Connectivity = {
  id: number;
  type: string;
  speed?: {
    value: number;
    units: string;
  } | null;
};

type Props = {
  value: number[];
  onChange: (value: number[]) => void;
};

const speedUnits = ["Mbps", "Gbps", "MHz", "GHz", "kHz"];

export function ConnectivitySelectAndCreate({ value, onChange }: Props) {
  const [connectivities, setConnectivities] = useState<Connectivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newConnectivityType, setNewConnectivityType] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Campos para speed opcional
  const [speedValue, setSpeedValue] = useState<string>("");
  const [speedUnitsValue, setSpeedUnitsValue] = useState<string>("");

  useEffect(() => {
    fetchConnectivities();
  }, []);

  async function fetchConnectivities() {
    setLoading(true);
    const { data, error } = await supabase
      .from("Connectivity")
      .select("id, type, speed")
      .order("type");

    if (error) {
      console.error("Error fetching connectivity types:", error);
    } else {
      setConnectivities(data || []);
    }
    setLoading(false);
  }

  function resetForm() {
    setNewConnectivityType("");
    setSpeedValue("");
    setSpeedUnitsValue("");
    setError(null);
  }

  async function handleSave() {
    setError(null);

    if (!newConnectivityType.trim()) {
      setError("Connectivity type is required.");
      return;
    }

    // Validar speed si se proporcionó
    let speedData = null;
    if (speedValue.trim()) {
      const numericValue = parseFloat(speedValue);
      if (isNaN(numericValue) || numericValue <= 0) {
        setError("Speed value must be a positive number.");
        return;
      }
      if (!speedUnitsValue.trim()) {
        setError("Speed units are required when speed value is provided.");
        return;
      }
      speedData = {
        value: numericValue,
        units: speedUnitsValue
      };
    }

    // Preparar datos para insertar
    const insertData: any = {
      type: newConnectivityType.trim()
    };

    if (speedData) {
      insertData.speed = speedData;
    }

    const { data, error: createError } = await supabase
      .from("Connectivity")
      .insert(insertData)
      .select()
      .single();

    if (createError) {
      toast.error(`Error creating connectivity: ${createError.message}`);
      return;
    }

    if (data) {
      setConnectivities((prev) => [...prev, data]);
      onChange([...value, data.id]);
      toast.success(`Connectivity "${data.type}" created successfully`);
    }

    setOpenModal(false);
    resetForm();
  }

  function handleAddConnectivity(id: number) {
    if (!value.includes(id)) {
      onChange([...value, id]);
    }
  }

  function handleRemoveConnectivity(id: number) {
    onChange(value.filter((v) => v !== id));
  }

  const availableOptions = connectivities.filter((c) => !value.includes(c.id));

  return (
    <>
      <div className="space-y-2 mt-2">
        <div className="flex flex-wrap gap-2">
          {value.map((id) => {
            const connectivity = connectivities.find((c) => c.id === id);
            if (!connectivity) return null;
            return (
              <span
                key={id}
                className="flex items-center space-x-1 bg-gray-200 px-2 py-1 rounded-full text-sm"
              >
                <span>
                  {connectivity.type}
                  {connectivity.speed && (
                    <span className="text-blue-600 ml-1">
                      ({connectivity.speed.value} {connectivity.speed.units})
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveConnectivity(id)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Remove connectivity"
                >
                  <X size={14} />
                </button>
              </span>
            );
          })}
        </div>

        <div className="flex space-x-2 items-center">
          <div className="flex-1">
            <Select
              onValueChange={(val) => {
                const selectedId = Number(val);
                if (selectedId) {
                  handleAddConnectivity(selectedId);
                }
              }}
              value=""
              disabled={availableOptions.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={loading ? "Loading..." : "Select Connectivity"}
                />
              </SelectTrigger>
              {availableOptions.length > 0 && (
                <SelectContent>
                  {availableOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.type}
                      {c.speed && (
                        <span className="text-blue-600 ml-1">
                          ({c.speed.value} {c.speed.units})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              )}
            </Select>
          </div>

          <Button
            type="button"
            onClick={() => {
              resetForm();
              setOpenModal(true);
            }}
          >
            + Add Connectivity
          </Button>
        </div>
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
            <DialogTitle>Add New Connectivity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="connectivity-type">Connectivity Type *</Label>
              <Input
                id="connectivity-type"
                placeholder="e.g., Bluetooth 5.2, WiFi 6E"
                value={newConnectivityType}
                onChange={(e) => setNewConnectivityType(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Speed (Optional)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., 2.5"
                    value={speedValue}
                    onChange={(e) => setSpeedValue(e.target.value)}
                  />
                </div>
                <div>
                  <Select
                    value={speedUnitsValue}
                    onValueChange={setSpeedUnitsValue}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Units" />
                    </SelectTrigger>
                    <SelectContent>
                      {speedUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
                Create Connectivity
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}