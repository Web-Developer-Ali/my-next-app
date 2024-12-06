'use client'
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Download } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import axios from "axios"
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  rollNumber: z.string().min(1, "Roll number is required"),
});


export default function StudentResult() {
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rollNumber: "",
    },
  })

  async function onSubmit() {
    setIsLoading(true)
    const { name, rollNumber } = form.getValues() // Get both name and roll number
    try {
      // Make API call to fetch the student result image based on roll number
      const response = await axios.post('/api/getStudent-result', { rollNumber, name })

      if (response.status === 200) {
        const data = response.data
        if (data?.student.imageUrl) {
          setResultImage(data.student.imageUrl) // Set the result image URL returned from the API
        } else {
          console.error('No result image found')
        }
      } else {
        throw new Error('Student result not found')
      }
    } catch (error) {
      console.error('Error fetching result:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!resultImage) return

    try {
      const response = await fetch(resultImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `result-${form.getValues('rollNumber')}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading image:", error)
    }
  }

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center dark:bg-black bg-gray-100 px-4 py-8">
      <Card className="w-full max-w-2xl transition-all duration-300 ease-in-out transform hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Student Result Portal</CardTitle>
          <CardDescription className="text-center">Enter your details to view your result</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your roll number" {...field} className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "View Result"}
              </Button>
            </form>
          </Form>

          {resultImage && (
            <div className="space-y-4 animate-fade-in">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border transition-all duration-300 ease-in-out transform hover:scale-105">
              <Image
                  src={resultImage}
                  alt="Student Result"
                  layout="responsive"
                  width={1200} // You can adjust the width and height according to your design
                  height={900} // You can adjust the width and height according to your design
                  className="object-contain transition-opacity duration-300 ease-in-out"
                  style={{ opacity: isLoading ? 0.5 : 1 }}
                />
              </div>
              <Button 
                onClick={handleDownload} 
                className="w-full transition-all duration-300 ease-in-out transform hover:scale-105"
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Result
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}