import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-64px)] flex flex-col">
      <section className="flex-grow flex items-center justify-center">
        <Link href="/admin/dev-form">
          <Button>Go to Mini PC's Form</Button>
        </Link>
      </section>
    </main>
  );
}
