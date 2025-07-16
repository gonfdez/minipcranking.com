import AuthGuard from "@/components/AuthGuard";
import { MiniPCForm } from "@/components/minipc-form/MiniPCForm";

export default function Home() {
  return (
    <AuthGuard>
      <main className="flex items-center justify-center min-h-screen">
        <MiniPCForm />
      </main>
    </AuthGuard>
  );
}
