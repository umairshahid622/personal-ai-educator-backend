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

  @Post("forgot-password")
  async forgotPassword(
    @Body("email") email: string,
    @Body("newPassword") newPassword: string,
    @Body("confirmPassword") confirmPassword: string
  ) {
    if (!email || !newPassword || !confirmPassword) {
      throw new BadRequestException(
        "Email, New Password and Confirm Password are required"
      );
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        "New Password and Confirm Password do not match"
      );
    }

    return this.authenticationService.forgotPassword(email, newPassword);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.authenticationService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAuthenticationDto: UpdateAuthenticationDto
  ) {
    return this.authenticationService.update(+id, updateAuthenticationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.authenticationService.remove(+id);
  }
}
