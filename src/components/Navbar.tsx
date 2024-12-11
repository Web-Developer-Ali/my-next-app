"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import logo from "@/../../public/logo.png";
export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="w-full">
      {/* Top Header */}
      <div className="bg-[#1e3a8a] text-white">
        <div className="container mx-auto px-6 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">+92 330 1713389</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm">info@salu.edu.pk</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <nav className="flex items-center space-x-4 text-sm">
              <Link href="/about-us" className="hover:text-blue-200">
                About Us
              </Link>
              <span>|</span>
              <Link href="/student-results" className="hover:text-blue-200">
                Results
              </Link>
              <span>|</span>
              <Link href="/sign-in" className="hover:text-blue-200">
                Admin Log-in
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-3 items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src={logo}
                alt="University Logo"
                width={100}
                height={100}
                className="rounded-full"
              />
            </Link>
            <div className="text-white text-center">
              <h1 className="text-2xl font-bold">
                Shah Abdul Latif University,
              </h1>
              <h2 className="text-xl">Khairpur</h2>
            </div>
            <div className="flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
