import { z } from 'zod';

export const getCollegesQuerySchema = z.object({
  search: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  collegeType: z.string().optional(),
  course: z.string().optional(),
  exam: z.string().optional(),
  minFees: z.coerce.number().nonnegative().optional(),
  maxFees: z.coerce.number().nonnegative().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum([
    'rating',
    'fees-low-to-high',
    'fees-high-to-low',
    'average-package',
    'placement-rate',
    'name'
  ]).optional().default('rating'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(12)
}).refine(data => {
  if (data.minFees !== undefined && data.maxFees !== undefined) {
    return data.minFees <= data.maxFees;
  }
  return true;
}, {
  message: "minFees cannot be greater than maxFees",
  path: ["minFees"]
});

export const compareCollegesQuerySchema = z.object({
  ids: z.string().min(1).transform(val => val.split(',').map(id => id.trim()).filter(Boolean))
    .refine(ids => ids.length >= 2 && ids.length <= 3, {
      message: "You must compare exactly 2 or 3 colleges"
    })
    .refine(ids => new Set(ids).size === ids.length, {
      message: "Duplicate college IDs are not allowed"
    })
});
