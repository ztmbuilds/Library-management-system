export interface IUserSignup {
  username: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  username_or_email: string;
  password: string;
}

export interface RefreshTokenDecoded extends Jwt.JwtPayload {
  refreshToken: string;
  id: string;
}
