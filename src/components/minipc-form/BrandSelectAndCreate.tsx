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
    if (!newBrandImgHref.trim()) {
      setError("Image URL is required.");
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
          imgHref: newBrandImgHref.trim(),
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
        .insert({ name: newBrandName.trim(), imgHref: newBrandImgHref.trim() })
        .select()
        .single();

      if (createError) {
        toast.error(`Error creating brand: ${createError.message}`);
        return;
      }

      if (data) {
        setBrands((prev) => [...prev, data]);
        toast.success(`Brand "${data.name}" created successfully`);
        setTimeout(() => {
          onChange(data.id.toString());
        }, 100);
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
        <Select
          onValueChange={onChange}
          value={value}
          disabled={brands.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={loading ? "Loading Brands..." : "Select a Brand"}
            />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id.toString()}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
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
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>
              {formBrandId ? "Edit Brand" : "Add New Brand"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name *</Label>
              <Input
                id="brand-name"
                placeholder="Enter brand name"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-image">Image URL *</Label>
              <Input
                id="brand-image"
                placeholder="https://example.com/image.jpg"
                value={newBrandImgHref}
                onChange={(e) => setNewBrandImgHref(e.target.value)}
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
                {formBrandId ? "Save Changes" : "Create Brand"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
