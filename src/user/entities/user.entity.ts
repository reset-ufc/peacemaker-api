import { z } from 'zod';

/**
 * Schema definition for a User entity using Zod library.
 *
 * @property {string} [id] - Optional unique identifier for the user.
 * @property {string} email - Email address of the user.
 * @property {string} name - Name of the user.
 * @property {string} password - Password for the user.
 * @property {Date} [createdAt] - Optional date when the user was created.
 * @property {Date} [updateAt] - Optional date when the user was last updated.
 */

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
  githubId: z.string(),
  avatar: z.string(),
  createdAt: z.date().optional(),
  updateAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;
