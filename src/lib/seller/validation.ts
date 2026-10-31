import { z } from 'zod'

export const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  inventory: z.number().min(0, 'Inventory must be positive'),
  isActive: z.boolean(),
  content: z.string().min(10, 'Content must be at least 10 characters'),
})

export const OrderFilterSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']).optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
  search: z.string().optional(),
})