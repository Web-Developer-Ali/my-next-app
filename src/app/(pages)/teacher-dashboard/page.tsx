"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import Link from "next/link";
import Image from "next/image";
// Mock data for student results
const initialResults = [
  {
    id: 1,
    rollNumber: "001",
    name: "John Doe",
    score: 85,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    rollNumber: "002",
    name: "Jane Smith",
    score: 92,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    rollNumber: "003",
    name: "Bob Johnson",
    score: 78,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    rollNumber: "004",
    name: "Alice Brown",
    score: 95,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    rollNumber: "005",
    name: "Charlie Davis",
    score: 88,
    imageUrl: "/placeholder.svg?height=200&width=200",
  },
];

export default function TeacherResultsDashboard() {
  const [results, setResults] = useState(initialResults);
  const [selectedResult, setSelectedResult] = useState<
    (typeof initialResults)[0] | null
  >(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const { toast } = useToast();

  const handleUpdate = (id: number, newScore: number) => {
    setResults((prevResults) =>
      prevResults.map((result) =>
        result.id === id ? { ...result, score: newScore } : result
      )
    );
    setSelectedResult(null);
    setIsUpdateMode(false);
    toast({
      title: "Success",
      description: "Result updated successfully",
    });
  };

  

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Student Results Dashboard</h1>      
      <Link href="/add-results">
        <Button variant="outline" className="mb-5">
          Add Result of Student
        </Button>
      </Link>
      {/* Results Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{result.rollNumber}</TableCell>
                <TableCell>{result.name}</TableCell>
                <TableCell>{result.score}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedResult(result);
                            setIsUpdateMode(false);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            {isUpdateMode ? "Update Result" : "View Result"}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              value={selectedResult?.name}
                              className="col-span-3"
                              readOnly
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rollNumber" className="text-right">
                              Roll Number
                            </Label>
                            <Input
                              id="rollNumber"
                              value={selectedResult?.rollNumber}
                              className="col-span-3"
                              readOnly
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="score" className="text-right">
                              Score
                            </Label>
                            <Input
                              id="score"
                              value={selectedResult?.score}
                              className="col-span-3"
                              readOnly={!isUpdateMode}
                              onChange={(e) =>
                                setSelectedResult((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        score: parseInt(e.target.value),
                                      }
                                    : null
                                )
                              }
                            />
                          </div>
                          {selectedResult && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label className="text-right">Result Image</Label>
                              <div className="col-span-3">
                              <Image
                                  src={selectedResult.imageUrl}
                                  alt={`Result for ${selectedResult.name}`}
                                  width={200}
                                  height={200}
                                  className="w-full h-auto rounded-md"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          {isUpdateMode ? (
                            <>
                              <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                  Cancel
                                </Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  type="button"
                                  onClick={() =>
                                    selectedResult?.id &&
                                    selectedResult?.score &&
                                    handleUpdate(selectedResult.id, selectedResult.score)
                                  }
                                >
                                  Update
                                </Button>
                              </DialogClose>
                            </>
                          ) : (
                            <DialogClose asChild>
                              <Button type="button">Close</Button>
                            </DialogClose>
                          )}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
