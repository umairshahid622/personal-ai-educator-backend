import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "src/guards/auth/auth.guard";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUser(@Req() req: Request) {
    return this.usersService.getUserById(req["user"]["userId"]);
  }

  @Patch("updateName")
  async updateUserName(
    @Req() req: Request,
    @Body("name") name: string
  ): Promise<{ message: string }> {
    const userId = req["user"]["userId"];
    const message = await this.usersService.updateName(userId, name);
    return { message };
  }
}
