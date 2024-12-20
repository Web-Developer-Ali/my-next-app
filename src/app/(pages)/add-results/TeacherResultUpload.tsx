"use client";

import { useState, useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileImage } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import axios from 'axios';
import { useRouter, useSearchParams } from "next/navigation";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

const formSchema = z.object({
  rollNumber: z.number().int().positive("Roll number must be a positive integer"),
  name: z.string().min(3, "Student name is required"),
  marks: z.number().min(0, "Marks must be at least 0").max(100, "Marks cannot exceed 100"),
  resultImage: z.custom<File>()
    .refine((file) => file instanceof File, "Image is required.")
    .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type as typeof ACCEPTED_IMAGE_TYPES[number]),
      ".jpg, .jpeg, .png and .webp files are accepted."
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TeacherResultUpload() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");
  const { toast } = useToast();
const router = useRouter();
  const fetchJobData = useCallback(async () => {
    if (!jobId) return;

    try {
      const response = await axios.get(`/api/update_result/get_result?id=${jobId}`);
      console.log(response)
      form.reset(response.data);
    } catch (error) {
      console.error("Error fetching job data:", error);
      toast({
        title: "Error",
        description: "Could not fetch job data.",
        variant: "destructive",
      });
    }
  }, [jobId , toast]);

  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rollNumber: undefined,
      name: "",
      marks: undefined,
      resultImage: undefined,
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        form.setValue("resultImage", file);
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": ACCEPTED_IMAGE_TYPES,
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const clearImage = () => {
    form.setValue("resultImage", undefined);
    setPreviewUrl(null);
  };

  async function onSubmit(values: FormValues) {

    if (!values.resultImage) {
      toast({
        title: "Error",
        description: "Please upload an image before submitting.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("rollNumber", values.rollNumber.toString());
    formData.append("name", values.name);
    formData.append("marks", values.marks.toString());
    formData.append("resultImage", values.resultImage);
    if (jobId) {
      formData.append("id",jobId)
    }
    try {
      setUploadProgress(0);      
      const url = jobId
      ? "/api/update_result/update_studentResult"
      : "/api/upload-results";
    const method = jobId ? axios.put : axios.post;
      const response = await method(url, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          } else {
            console.warn("Progress total is undefined");
          }
        },
      });
      
      if (response.status !== 200) {
        throw new Error("Failed to upload result.");
      }

      toast({
        title: "Success",
        description: `Result uploaded for ${values.name} (Roll Number: ${values.rollNumber})`,
      });

      if (jobId && response.status === 200) {
        router.replace("/teacher-dashboard")
      }

      // Reset form and states
      form.reset({
        rollNumber:NaN,
        name: "",
        marks:NaN,
        resultImage: undefined,
      });
      setPreviewUrl(null);
      setUploadProgress(0);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to upload result. Please try again.",
        variant: "destructive",
      });
      setUploadProgress(0);
    }
  }

  const isSubmitDisabled = !form.getValues().resultImage || form.formState.isSubmitting || uploadProgress > 0;

  return (
    <div className="min-h-screen min-w-screen dark:bg-black flex items-center justify-center bg-gray-100 px-4 py-8">
      <Card className="w-full max-w-2xl transition-all duration-300 ease-in-out transform hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Upload Student Result
          </CardTitle>
          <CardDescription className="text-center">
            Upload result image and details for a student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Roll Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter student roll number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter student name"
                        {...field}
                        className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Marks</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter student marks"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resultImage"
                render={({ field: {  onChange, } }) => (
                  <FormItem>
                    <FormLabel>Result Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div
                          {...getRootProps()}
                          className={cn(
                            "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-all duration-300 ease-in-out",
                            "hover:border-primary cursor-pointer",
                            isDragActive
                              ? "border-primary bg-primary/10"
                              : "border-gray-300",
                            previewUrl ? "border-primary" : ""
                          )}
                        >
                          <input {...getInputProps({ onChange })} />
                          {previewUrl ? (
                            <div className="relative w-full">
                              <Image
                                src={previewUrl}
                                alt="Result Preview"
                                layout="responsive"
                                width={500}
                                height={300}
                                className="w-full h-auto rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearImage();
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              {isDragActive ? (
                                <FileImage className="h-10 w-10 text-primary animate-pulse" />
                              ) : (
                                <Upload className="h-10 w-10 text-gray-400" />
                              )}
                              <div className="text-sm text-gray-600 text-center">
                                {isDragActive ? (
                                  <span className="font-semibold">
                                    Drop the file here
                                  </span>
                                ) : (
                                  <>
                                    <span className="font-semibold">
                                      Click to upload
                                    </span>{" "}
                                    or drag and drop
                                  </>
                                )}
                                <div className="text-xs text-gray-500">
                                  JPG, PNG, WEBP (MAX. 5MB)
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-500 text-center">
                    {uploadProgress}% uploaded
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={isSubmitDisabled}
              >
                {form.formState.isSubmitting || uploadProgress > 0
                  ? "Uploading..."
                  : "Upload Result"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}