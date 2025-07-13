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

type Brand = {
  id: number;
  name: string;
  imgHref?: string | null;
};

type Props = {
  value: string | undefined;
  onChange: (value: string) => void;
};

export function BrandSelectAndCreate({ value, onChange }: Props) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [formBrandId, setFormBrandId] = useState<number | null>(null);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandImgHref, setNewBrandImgHref] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  async function fetchBrands() {
    setLoading(true);
    const { data, error } = await supabase
      .from("Brands")
      .select("id, name, imgHref")
      .order("name");
    if (error) {
      console.error("Error fetching brands:", error);
    } else {
      setBrands(data || []);
    }
    setLoading(false);
  }

  function handleEditBrand(brandId: number) {
    const brand = brands.find((b) => b.id === brandId);
    if (brand) {
      setFormBrandId(brand.id);
      setNewBrandName(brand.name);
      setNewBrandImgHref(brand.imgHref ?? "");
      setOpenModal(true);
    }
  }

  function resetForm() {
    setFormBrandId(null);
    setNewBrandName("");
    setNewBrandImgHref("");
    setError(null);
  }

  async function handleSave() {
    setError(null);

    if (!newBrandName.trim()) {
      setError("Brand name is required.");
      return;
    }
    if (newBrandName.trim().length < 2) {
      setError("Brand name must be at least 2 characters.");
      return;
    }
    if (newBrandImgHref && !isValidUrl(newBrandImgHref)) {
      setError("Image URL is invalid.");
      return;
    }

    if (formBrandId) {
      // Update existing
      const { error: updateError } = await supabase
        .from("Brands")
        .update({
          name: newBrandName.trim(),
          imgHref: newBrandImgHref || null,
        })
        .eq("id", formBrandId);

      if (updateError) {
        toast.error(`Error updating brand: ${updateError.message}`);
        return;
      }

      toast.success(`Brand updated successfully`);
      fetchBrands();
    } else {
      // Create new
      const { data, error: createError } = await supabase
        .from("Brands")
        .insert({ name: newBrandName.trim(), imgHref: newBrandImgHref || null })
        .select()
        .single();

      if (createError) {
        toast.error(`Error creating brand: ${createError.message}`);
        return;
      }

      if (data) {
        setBrands((prev) => [...prev, data]);
        onChange(data.id.toString());
        toast.success(`Brand "${data.name}" created successfully`);
      }
    }

    setOpenModal(false);
    resetForm();
  }

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
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
                  ? "Loading Brands..."
                  : brands.length === 0
                  ? "No Brands available"
                  : "Select a Brand"
              }
            />
          </SelectTrigger>
          {brands.length > 0 && (
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>

        <Button
          type="button"
          onClick={() => {
            if (!value) {
              toast.error("Select a brand first to edit");
              return;
            }
            const brandId = parseInt(value);
            handleEditBrand(brandId);
          }}
          disabled={!value}
        >
          Edit Brand
        </Button>

        <Button
          type="button"
          onClick={() => {
            resetForm();
            setOpenModal(true);
          }}
        >
          + Add Brand
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
              {formBrandId ? "Edit Brand" : "Add New Brand"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Brand name"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
            <Input
              placeholder="Image URL (optional)"
              value={newBrandImgHref}
              onChange={(e) => setNewBrandImgHref(e.target.value)}
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
                {formBrandId ? "Save Changes" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
