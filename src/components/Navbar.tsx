'use client'

import { useState, useEffect } from "react";
import { Moon, Sun, GraduationCap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useTheme } from 'next-themes';
import { useRouter } from "next/navigation";

// Fetch the token from the server-side
async function fetchToken() {
  const res = await fetch('/api/getToken');
  const data = await res.json();
  return data.token; // Returns the token or null
}

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track the login state
  const { setTheme } = useTheme();
  const router = useRouter(); // For redirection after logout

  useEffect(() => {
    setMounted(true);

    // Fetch the token from the API route to check login status
    const checkLogin = async () => {
      const token = await fetchToken();
      if (token) {
        setIsLoggedIn(true); // User is logged in
      }
    };

    checkLogin();
  }, []);

  const handleLogout = async () => {
   
    const response = await fetch('/api/log_out', { method: 'GET' });

    if (response.ok) {
 
      setIsLoggedIn(false);
      router.push("/sign-in"); 
    } else {
      console.error("Logout failed");
    }
  };

  const handleLogin = async () => {
       setIsLoggedIn(true);
    router.push("/teacher-dashboard");
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-20">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-3">
            <GraduationCap className="h-6 w-6" />
            <span className="inline-block text-xl font-bold">ResultHub</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center gap-4">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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
            
            {/* Logout Button (Only shown if user is logged in) */}
            {isLoggedIn ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button variant="outline" onClick={handleLogin}>
                Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
