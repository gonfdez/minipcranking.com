"use client";

import AuthGuard from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";

export default function DeveloperPanelPage() {
  return (
    <AuthGuard>
      <div className="flex gap-6 max-w-6xl sm:px-6 lg:px-8">
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