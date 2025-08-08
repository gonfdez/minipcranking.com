"use client";

import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { SquarePlus, Table } from "lucide-react";

export default function DeveloperPanelPage() {
  return (
    <AuthGuard>
      <div className="flex gap-6 max-w-6xl sm:px-6 lg:px-8">
        <Button
          variant={"outline"}
          onClick={() => (window.location.href = "/dev/minipc-table")}
        >
         <Table className="h-4 w-4" /> See Mini PC's Table
        </Button>
        <Button
          variant={"outline"}
          onClick={() => (window.location.href = "/dev/minipc-form")}
        >
          <SquarePlus className="h-4 w-4" /> Create new Mini PC
        </Button>
      </div>
    </AuthGuard>
  );
}