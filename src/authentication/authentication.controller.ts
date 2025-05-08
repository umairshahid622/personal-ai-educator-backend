import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  Query,
} from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import {
  CreateAuthenticationDto,
  LoginAuthenticationDto,
} from "src/users/dto/create-users.dto";
import { UpdateAuthenticationDto } from "src/users/dto/update-users.dto";

@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("register")
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  create(@Body() createAuthenticationDto: CreateAuthenticationDto) {
    return this.authenticationService.create(createAuthenticationDto);
  }

  @Post("login")
  login(@Body() loginAuthenticationDto: LoginAuthenticationDto) {
    return this.authenticationService.logIn(loginAuthenticationDto);
  }

  @Get('verify')
  async verifyEmail(
    @Query('token') token: string,
  ): Promise<{ message: string; accessToken?: string }> {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }
    return this.authenticationService.verifyEmailToken(token);
  }

}
