"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, Edit, Trash2, Search } from "lucide-react";

interface MiniPC {
  id: number;
  model: string;
  brand: {
    name: string;
  };
  CPU: {
    model: string;
    brand: {
      name: string;
    };
  };
  graphics: {
    model: string;
    brand: {
      name: string;
    };
  };
  maxRAMCapacityGB: number | null;
  maxStorageCapacityGB: number | null;
  weightKg: number | null;
  powerConsumptionW: number | null;
  releaseYear: number | null;
  fromURL: string;
  manualCollect: boolean;
  mainImgUrl: string[];
  variants: {
    id: number;
    RAMGB: number;
    RAM_type: string;
    storageGB: number;
    storage_type: string;
    offers: { url: string; price: number }[];
  }[];
  created_at: string;
}

export function MiniPCTable() {
  const [miniPCs, setMiniPCs] = useState<MiniPC[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMiniPC, setSelectedMiniPC] = useState<MiniPC | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchMiniPCs();
  }, []);

  const fetchMiniPCs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("MiniPCs")
        .select(
          `
          *,
          brand:Brands(name),
          CPU:CPUs(
            model,
            brand:Brands(name)
          ),
          graphics:Graphics(
            model,
            brand:Brands(name)
          ),
          variants:Variants(
            id,
            RAMGB,
            RAM_type,
            storageGB,
            storage_type,
            offers
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        toast.error(`Error fetching MiniPCs: ${error.message}`);
        return;
      }

      setMiniPCs(data || []);
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Error fetching MiniPCs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this MiniPC?")) {
      return;
    }

    try {
      const { error } = await supabase.from("MiniPCs").delete().eq("id", id);

      if (error) {
        toast.error(`Error deleting MiniPC: ${error.message}`);
        return;
      }

      toast.success("MiniPC deleted successfully");
      fetchMiniPCs();
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Error deleting MiniPC:", err);
    }
  };

  const filteredMiniPCs = miniPCs.filter(
    (miniPC) =>
      miniPC.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      miniPC.brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      miniPC.CPU.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      miniPC.graphics.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDetailsDialog = (miniPC: MiniPC) => {
    setSelectedMiniPC(miniPC);
    setShowDetailsDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading MiniPCs...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">MiniPCs</h1>
        <Button variant={'outline'} onClick={() => (window.location.href = "/")}>
          + Add New MiniPC
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search MiniPCs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>CPU</TableHead>
              <TableHead>Graphics</TableHead>
              <TableHead>Max RAM</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Release Year</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMiniPCs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  {searchTerm
                    ? "No MiniPCs found matching your search."
                    : "No MiniPCs found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredMiniPCs.map((miniPC) => (
                <TableRow key={miniPC.id}>
                  <TableCell className="font-medium">
                    {miniPC.brand.name}
                  </TableCell>
                  <TableCell>{miniPC.model}</TableCell>
                  <TableCell>
                    {miniPC.CPU.brand.name} {miniPC.CPU.model}
                  </TableCell>
                  <TableCell>
                    {miniPC.graphics.brand.name} {miniPC.graphics.model}
                  </TableCell>
                  <TableCell>
                    {miniPC.maxRAMCapacityGB
                      ? `${miniPC.maxRAMCapacityGB} GB`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {miniPC.variants.length} variant
                      {miniPC.variants.length !== 1 ? "s" : ""}
                    </Badge>
                  </TableCell>
                  <TableCell>{miniPC.releaseYear || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailsDialog(miniPC)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Implementar edición
                          toast.info("Edit functionality not implemented yet");
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(miniPC.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMiniPC?.brand.name} {selectedMiniPC?.model}
            </DialogTitle>
          </DialogHeader>

          {selectedMiniPC && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">Brand:</span>{" "}
                  {selectedMiniPC.brand.name}
                </div>
                <div>
                  <span className="font-semibold">Model:</span>{" "}
                  {selectedMiniPC.model}
                </div>
                <div>
                  <span className="font-semibold">CPU:</span>{" "}
                  {selectedMiniPC.CPU.brand.name} {selectedMiniPC.CPU.model}
                </div>
                <div>
                  <span className="font-semibold">Graphics:</span>{" "}
                  {selectedMiniPC.graphics.brand.name}{" "}
                  {selectedMiniPC.graphics.model}
                </div>
                <div>
                  <span className="font-semibold">Max RAM:</span>{" "}
                  {selectedMiniPC.maxRAMCapacityGB
                    ? `${selectedMiniPC.maxRAMCapacityGB} GB`
                    : "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Max Storage:</span>{" "}
                  {selectedMiniPC.maxStorageCapacityGB
                    ? `${selectedMiniPC.maxStorageCapacityGB} GB`
                    : "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Weight:</span>{" "}
                  {selectedMiniPC.weightKg
                    ? `${selectedMiniPC.weightKg} kg`
                    : "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Power:</span>{" "}
                  {selectedMiniPC.powerConsumptionW
                    ? `${selectedMiniPC.powerConsumptionW} W`
                    : "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Release Year:</span>{" "}
                  {selectedMiniPC.releaseYear || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Manual Collect:</span>{" "}
                  {selectedMiniPC.manualCollect ? "Yes" : "No"}
                </div>
              </div>

              {/* Source URL */}
              <div>
                <span className="font-semibold">Source URL:</span>{" "}
                <a
                  href={selectedMiniPC.fromURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {selectedMiniPC.fromURL}
                </a>
              </div>

              {/* Main Images */}
              <div>
                <span className="font-semibold">Main Images:</span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {selectedMiniPC.mainImgUrl.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${selectedMiniPC.model} image ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Variants */}
              <div>
                <span className="font-semibold">Variants:</span>
                <div className="mt-2 space-y-4">
                  {selectedMiniPC.variants.map((variant) => (
                    <div key={variant.id} className="border rounded p-4">
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <span className="font-medium">RAM:</span>{" "}
                          {variant.RAMGB} GB ({variant.RAM_type})
                        </div>
                        <div>
                          <span className="font-medium">Storage:</span>{" "}
                          {variant.storageGB} GB ({variant.storage_type})
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Offers:</span>
                        <div className="mt-1 space-y-1">
                          {variant.offers.map((offer, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <span className="font-medium">
                                ${offer.price}
                              </span>
                              <a
                                href={offer.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                              >
                                View Offer
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
