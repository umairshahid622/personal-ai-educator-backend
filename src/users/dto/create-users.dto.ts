import { IsEmail, IsNotEmpty, IsDateString } from "class-validator";

export class CreateAuthenticationDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  password: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;
}

export class LoginAuthenticationDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
