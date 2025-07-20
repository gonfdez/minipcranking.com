import AuthGuard from "@/components/AuthGuard";
import { MiniPCForm } from "@/components/minipc-form/MiniPCForm";

export default function MiniPCFormPage() {
  return (
    <AuthGuard>
      <div className="flex items-center justify-center min-h-screen">
        <MiniPCForm />
      </div>
    </AuthGuard>
  );
}
