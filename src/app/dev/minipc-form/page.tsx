import AuthGuard from "@/components/AuthGuard";
import { MiniPCForm } from "@/components/minipc-form/MiniPCForm";

export default function MiniPCFormPage() {
  return (
    <AuthGuard>
        <MiniPCForm />
    </AuthGuard>
  );
}
