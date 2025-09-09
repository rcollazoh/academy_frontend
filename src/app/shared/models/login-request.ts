export interface LoginRequest {
  username: string;
  password: string;
}

export interface LogoutRequest {
  personId: number;
}