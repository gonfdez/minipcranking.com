"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MiniPCForm } from "@/components/dev-form/MiniPCForm";

export default function DevFormPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_DEVELOPERS_PASS) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  }

  return (
    <main className="p-8 flex items-center justify-center min-h-screen">
      {authenticated ? (
        <MiniPCForm />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-sm w-full text-center"
        >
          <h2 className="text-xl font-semibold">Enter Password</h2>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Access Form
          </Button>
        </form>
      )}
    </main>
  );
}
