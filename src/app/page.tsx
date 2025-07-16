import AuthGuard from "@/components/AuthGuard";
import { MiniPCForm } from "@/components/dev-form/MiniPCForm";

export default function Home() {
  return (
    <AuthGuard>
      <main className="p-8 flex items-center justify-center min-h-screen">
        <MiniPCForm />
      </main>
    </AuthGuard>
  );
}
