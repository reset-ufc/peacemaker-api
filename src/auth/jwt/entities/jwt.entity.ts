import { z } from 'zod';

/** Social login providers by which our users can authenticate themselves */
export type AuthProvider = 'github';

export const jwtPayloadSchema = z.object({
  /** Internal user ID; we choose a property name of `sub` to hold our user ID value
   * to be consistent with JWT standards */
  sub: z.string(),
  /** Identifies the time at which the JWT was issued, e.g. 1644228687.
   * This property is added automatically by passport-jwt. */
  iat: z.number().optional(),
  /** Expiration time, e.g. 1644229587. This property is added automatically by passport-jwt. */
  exp: z.number().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
