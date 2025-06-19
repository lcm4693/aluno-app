export interface JwtPayload {
  sub: string;
  nome: string;
  admin: boolean;
  email: string;
  exp: number;
}
