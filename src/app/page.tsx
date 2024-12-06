'use client'
import { useState, useEffect } from "react"
import { Moon, Sun, GraduationCap, Users } from 'lucide-react'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link";
import { useTheme } from 'next-themes'; // Import useTheme from next-themes

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { setTheme } = useTheme() // Use next-themes for theme management

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 mx-auto w-2/3 border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap />
              <span className="inline-block font-bold">ResultHub</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
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
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-center mb-8">Welcome to ResultHub</h1>
        <p className="text-xl text-center mb-12">Access and manage student results with ease</p>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />
                For Students
              </CardTitle>
              <CardDescription>View your results and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Access your latest results and track your academic progress.</p>
              <Button asChild>
                <Link href="/student-results">View My Results</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                For Teachers
              </CardTitle>
              <CardDescription>Manage and update student results</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Upload, view, and update student results efficiently.</p>
              <Button asChild>
                <Link href="/teacher-dashboard">Teacher Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2024 ResultHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
