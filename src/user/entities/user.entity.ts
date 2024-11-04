import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  nodeId: z.string(),
  displayName: z.string(),
  username: z.string(),
  profileUrl: z.string(),
  photos: z.array(
    z.object({
      value: z.string(),
    }),
  ),
  createdAt: z.date().optional(),
  updateAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;
