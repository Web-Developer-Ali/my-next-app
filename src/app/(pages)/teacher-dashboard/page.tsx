"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
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
import { Eye, Pencil, Trash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

type Result = {
  id: number;
  rollNumber: number;
  name: string;
  score: number;
  imageUrl: string;
};

export default function TeacherResultsDashboard() {
  const [results, setResults] = useState<Result[]>([]);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("/api/getAllAdeddResults");
        if (response.data.student) {
          setResults(response.data.student);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch students",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching student results:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching data",
          variant: "destructive",
        });
      }
    };
    fetchResults();
  }, [toast]);

  const deleteResult = async (id: number) => {
    try {
      const response = await axios.delete(`/api/deleteResult/${id}`);
      if (response.status === 200) {
        setResults((prevResults) => prevResults.filter((result) => result.id !== id));
        toast({
          title: "Success",
          description: "Result deleted successfully",
        });
      } else {
        throw new Error('Failed to delete result');
      }
    } catch (error) {
      console.error("Error deleting result:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the result",
        variant: "destructive",
      });
    }
  };

  const redirectToUpdate = (id: number) => {
    router.push(`/add-results?id=${id}`);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Student Results Dashboard</h1>
      <Link href="/add-results">
        <Button variant="outline" className="mb-5">
          Add Result of Student
        </Button>
      </Link>
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
                <TableCell>{result.rollNumber.toString()}</TableCell>
                <TableCell>{result.name}</TableCell>
                <TableCell>{result.score}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedResult(result)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>View Result</DialogTitle>
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
                              value={selectedResult?.rollNumber.toString()}
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
                              readOnly
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button">Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => redirectToUpdate(result.id)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Update
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteResult(result.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
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

