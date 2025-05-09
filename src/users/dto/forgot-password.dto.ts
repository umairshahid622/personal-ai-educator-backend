import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

// src/authentication/dto/reset-password.dto.ts
import { IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  newPassword: string;
}
