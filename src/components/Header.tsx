"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: "/blog", label: "Blog" },
    // Puedes añadir más elementos de navegación aquí
    // { href: "/reviews", label: "Reviews" },
    // { href: "/guides", label: "Guides" },
  ];

  return (
    <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-bold hover:text-primary transition-colors flex items-center gap-2"
      >
        <Image
          src="/android-chrome-192x192.png"
          alt="Trophy"
          width={32}
          height={32}
          className="inline-block"
        />
        minipcranking.com
      </Link>

      <div className="flex items-center gap-4">
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Theme Toggle - Solo en desktop */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle className="text-left">Navigation</SheetTitle>
            </SheetHeader>
            <div className="px-6 py-4">
              <nav>
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block text-base font-medium hover:text-primary transition-colors py-3 px-3 rounded-md hover:bg-accent border border-1"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                
                {/* Theme Toggle in mobile */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}