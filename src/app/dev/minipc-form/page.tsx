"use client";

import AuthGuard from "@/components/AuthGuard";
import { MiniPCForm } from "@/components/minipc-form/MiniPCForm";
import { Suspense } from "react";

export default function MiniPCFormPage() {
  return (
    <AuthGuard>
      <Suspense>
        <MiniPCForm/>
      </Suspense>
    </AuthGuard>
  );
}
