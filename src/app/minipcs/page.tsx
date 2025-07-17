import AuthGuard from "@/components/AuthGuard";
import { MiniPCTable } from "@/components/MiniPCTable";

export default function MiniPCsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <MiniPCTable />
      </div>
    </AuthGuard>
  );
}
