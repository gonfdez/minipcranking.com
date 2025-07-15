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
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";

type Connectivity = {
  id: number;
  type: string;
};

type Props = {
  value: number[];
  onChange: (value: number[]) => void;
};

export function ConnectivitySelectAndCreate({ value, onChange }: Props) {
  const [connectivities, setConnectivities] = useState<Connectivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newConnectivityType, setNewConnectivityType] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConnectivities();
  }, []);

  async function fetchConnectivities() {
    setLoading(true);
    const { data, error } = await supabase
      .from("Connectivity")
      .select("id, type")
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
    setError(null);
  }

  async function handleSave() {
    setError(null);

    if (!newConnectivityType.trim()) {
      setError("Connectivity type is required.");
      return;
    }

    const { data, error: createError } = await supabase
      .from("Connectivity")
      .insert({ type: newConnectivityType.trim() })
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
                <span>{connectivity.type}</span>
                <button
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Connectivity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Connectivity type (e.g., Bluetooth 5.2)"
              value={newConnectivityType}
              onChange={(e) => setNewConnectivityType(e.target.value)}
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
              <Button onClick={handleSave}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
