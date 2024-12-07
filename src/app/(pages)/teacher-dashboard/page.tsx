"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Eye, Pencil, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

type Result = {
  _id: number;
  rollNumber: number;
  name: string;
  marks: number;
  resultImage: {
    imageUrl: string;
  };
};

export default function TeacherResultsDashboard() {
  const [results, setResults] = useState<Result[]>([]);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [resultToDelete, setResultToDelete] = useState<number | null>(null); // State to store result id for deletion
  const { toast } = useToast();
  const router = useRouter();
  
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
      const response = await axios.delete(`/api/deleteResult?id=${id}`);
      if (response.status === 200) {
        setResults((prevResults) =>
          prevResults.filter((result) => result._id !== id)
        );
        toast({
          title: "Success",
          description: "Result deleted successfully",
        });
        setIsDeleteDialogOpen(false); // Close the delete dialog after successful deletion
      } else {
        throw new Error("Failed to delete result");
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

  const handleViewResult = (result: Result) => {
    setSelectedResult(result);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setResultToDelete(id);
    setIsDeleteDialogOpen(true); // Open the confirmation dialog
  };

  const ResultCard = ({ result }: { result: Result }) => (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <p>
          <strong>Roll Number:</strong> {result.rollNumber}
        </p>
        <p>
          <strong>Name:</strong> {result.name}
        </p>
        <p>
          <strong>Score:</strong> {result.marks}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewResult(result)}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => redirectToUpdate(result._id)}
        >
          <Pencil className="h-4 w-4 mr-1" /> Update
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDeleteClick(result._id)} // Show the delete confirmation dialog
        >
          <Trash className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Student Results Dashboard</h1>
      <a href="/add-results">
        <Button variant="outline" className="mb-5">
          Add Result of Student
        </Button>
      </a>
      <div className="rounded-md border hidden md:block">
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
              <TableRow key={result._id}>
                <TableCell>{result.rollNumber.toString()}</TableCell>
                <TableCell>{result.name}</TableCell>
                <TableCell>{result.marks}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewResult(result)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => redirectToUpdate(result._id)}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Update
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(result._id)}
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
      <div className="md:hidden">
        {results.map((result) => (
          <ResultCard key={result._id} result={result} />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this result?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)} // Close the dialog without deleting
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (resultToDelete) {
                  deleteResult(resultToDelete);
                }
              }}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Result Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>View Result</DialogTitle>
          </DialogHeader>
          {selectedResult && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={selectedResult.name}
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
                  value={selectedResult.rollNumber.toString()}
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
                  value={selectedResult.marks.toString()}
                  className="col-span-3"
                  readOnly
                />
              </div>
              {selectedResult.resultImage && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Result Image</Label>
                  <div className="col-span-3">
                    <Image
                      src={selectedResult.resultImage.imageUrl}
                      alt={`Result for ${selectedResult.name}`}
                      className="w-full h-auto rounded-md"
                      layout="responsive"
                      width={500}
                      height={300}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
