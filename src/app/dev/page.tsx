"use client";

import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";

export default function DeveloperPanelPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex gap-6">
        <Button
          variant={"outline"}
          onClick={() => (window.location.href = "/dev/minipc-table")}
        >
          Go to Mini PC's Table
        </Button>
        <Button
          variant={"outline"}
          onClick={() => (window.location.href = "/dev/minipc-form")}
        >
          + Add New MiniPC
        </Button>
      </div>
    </AuthGuard>
  );
}