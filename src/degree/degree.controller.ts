import {
  Controller,
  Get,
  Req,
  UseGuards,
} from "@nestjs/common";
import { DegreeService } from "./degree.service";
import { Degree } from "./entities/degree.entity";
import { AuthGuard } from "src/guards/auth/auth.guard";

@Controller("degree")
@UseGuards(AuthGuard)
export class DegreeController {
  constructor(private readonly degreeService: DegreeService) {}

  @Get()
  async findAll(@Req() req: Request): Promise<Degree[]> {
    const userId = req["user"]["userId"];
    return this.degreeService.findForUser(userId);
  }
}
