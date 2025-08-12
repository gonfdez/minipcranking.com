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
} from "@/components/ui/dialog";
import { Eye, Edit, Search, SquarePlus, Loader2 } from "lucide-react";
import { MiniPCDetailsView } from "./MiniPCDetailsView";
import { MiniPC } from "./minipc-form/types";

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
        toast.error(`Error fetching Mini PC's: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        setMiniPCs([]);
        return;
      }

      // Obtener todos los IDs únicos de connectivity de todos los MiniPCs
      const allConnectivityIds = new Set<number>();
      data.forEach((miniPC) => {
        if (miniPC.connectivity && Array.isArray(miniPC.connectivity)) {
          miniPC.connectivity.forEach((id: number) =>
            allConnectivityIds.add(id)
          );
        }
      });

      // Obtener todos los datos de connectivity de una sola vez
      const { data: connectivityData } = await supabase
        .from("Connectivity")
        .select("id, type, speed")
        .in("id", Array.from(allConnectivityIds));

      // Crear un mapa para acceso rápido
      const connectivityMap = new Map();
      connectivityData?.forEach((conn) => {
        connectivityMap.set(conn.id, conn);
      });

      // Mapear los datos de connectivity a cada MiniPC
      const miniPCsWithConnectivity = data.map((miniPC) => ({
        ...miniPC,
        connectivity: (miniPC.connectivity || [])
          .map((id: number) => connectivityMap.get(id))
          .filter(Boolean), // Filtrar valores undefined
      }));

      setMiniPCs(miniPCsWithConnectivity);
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Error fetching Mini PC's:", err);
    } finally {
      setLoading(false);
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

  const MiniPCTableTitle = () => (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Mini PC's</h1>
      <Button
        variant={"outline"}
        onClick={() => (window.location.href = "/dev/minipc-form")}
      >
        <SquarePlus className="h-4 w-4" /> Add new Mini PC
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div>
        <MiniPCTableTitle />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-800 dark:text-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <MiniPCTableTitle />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Mini PC's..."
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
              <TableHead>Variants</TableHead>
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
                    ? "No Mini PC's found matching your search."
                    : "No Mini PC's found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredMiniPCs.map((miniPC) => (
                <TableRow key={miniPC.id}>
                  <TableCell>
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
                    <Badge variant="secondary">
                      {miniPC.variants.length} variant
                      {miniPC.variants.length !== 1 ? "s" : ""}
                    </Badge>
                  </TableCell>

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
                          window.location.href = `/dev/minipc-form?id=${miniPC.id}`;
                        }}
                      >
                        <Edit className="h-4 w-4" />
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
          <DialogHeader className="mb-4">
            <DialogTitle>
              {selectedMiniPC?.brand.name} {selectedMiniPC?.model}
            </DialogTitle>
          </DialogHeader>

          {selectedMiniPC && (
            <MiniPCDetailsView miniPC={selectedMiniPC} showTitle={false} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
