import AuthGuard from "@/components/AuthGuard";
import { MiniPCTable } from "@/components/MiniPCTable";

export default function MiniPCTablePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <MiniPCTable />
      </div>
    </AuthGuard>
  );
}
