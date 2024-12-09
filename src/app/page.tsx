import { GraduationCap, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
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

