import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const contentSubmissionSchema = z.object({
  contentType: z.enum(['Page', 'Article', 'Event']),
  domain: z.enum(['mejuvante.ai', 'products.mejuvante.ai', 'mejuvante.com', 'mejuvante.co.in']),
  title: z.string().min(3),
  goal: z.string().min(3),
  requirements: z.string().min(10)
})

export type ContentSubmission = z.infer<typeof contentSubmissionSchema>

export type StoredSubmission = ContentSubmission & {
  id: string
  status: 'draft' | 'review' | 'published'
  createdAt: string
  createdBy: string
}
