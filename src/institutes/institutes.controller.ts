import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { InstitutesService } from "./institutes.service";
import { CreateInstituteDto } from "./dto/create-institute.dto";
import { UpdateInstituteDto } from "./dto/update-institute.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";

@ApiTags("institutes")
@Controller("institutes")
export class InstitutesController {
  constructor(private readonly institutesService: InstitutesService) {}

  @Post()
  async create(@Body() createInstituteDto: CreateInstituteDto) {
    return this.institutesService.create(createInstituteDto);
  }

  @Post("bulk")
  @ApiBody({ type: [CreateInstituteDto] }) // <-- tells Swagger this is an array
  async bulkCreate(@Body() list: CreateInstituteDto[]) {
    return this.institutesService.bulkCreate(list);
  }

  @Get("search")
  async findByCourseName(@Query("courseName") courseName: string) {
    return this.institutesService.findByCourseName(courseName);
  }
}
