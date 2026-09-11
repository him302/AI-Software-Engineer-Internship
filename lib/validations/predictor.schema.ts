import { z } from 'zod';

export const predictorSchema = z.object({
  exam: z.string().min(1, "Exam is required"),
  rank: z.coerce.number().positive("Rank must be a positive number"),
  category: z.enum(["General", "OBC", "SC", "ST", "EWS"]),
  course: z.string().optional(),
  budget: z.coerce.number().nonnegative().optional(),
  preferredState: z.string().optional()
});

export type PredictorInput = z.infer<typeof predictorSchema>;
