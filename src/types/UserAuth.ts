export interface UserAuthDto {
  userName: string;
  password: string;
}

export type ResetPasswordDto = {
  email: string;
  token: string;
  newPassword: string;
};