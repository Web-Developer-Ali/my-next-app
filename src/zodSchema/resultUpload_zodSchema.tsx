export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf"
] as const;

import * as z from "zod";

export const formSchema = z.object({
  rollNumber: z.number().int().positive("Roll number must be a positive integer"),
  name: z.string().min(3, "Student name is required"),
  marks: z.number().min(0, "Marks must be at least 0").max(100, "Marks cannot exceed 100"),
  resultFile: z.custom<File>()
    .refine((file) => file instanceof File, "File is required.")
    .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => file instanceof File && ACCEPTED_FILE_TYPES.includes(file.type as typeof ACCEPTED_FILE_TYPES[number]),
      ".jpg, .jpeg, .png, .webp and .pdf files are accepted."
    )
    .optional(),
});

export type FormValues = z.infer<typeof formSchema>;

