/** Social login providers by which our users can authenticate themselves */
export type AuthProvider = 'github';

export class JwtPayload {
  /** Internal user ID; we choose a property name of `sub` to hold our user ID value
   * to be consistent with JWT standards */

  readonly sub: string;
  /** Identifies the time at which the JWT was issued, e.g. 1644228687.
   * This property is added automatically by passport-jwt. */
  readonly iat: number;

  /** Expiration time, e.g. 1644229587. This property is added automatically by passport-jwt. */
  readonly exp: number;

  /** Basic user information */
  readonly user: {
    readonly github_id: string;
    readonly name: string;
    readonly avatar_url: string;
    readonly email: string;
    readonly username: string;
  };
}
