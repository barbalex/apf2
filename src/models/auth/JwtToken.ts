/** Represents the compositeType auth.jwt_token */
export default interface JwtToken {
  role: string | null;

  username: string | null;

  token: string | null;
}