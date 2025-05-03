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
import { ApiTags } from "@nestjs/swagger";

@ApiTags("institutes")
@Controller("institutes")
export class InstitutesController {
  constructor(private readonly institutesService: InstitutesService) {}

  @Post()
  async create(@Body() createInstituteDto: CreateInstituteDto) {
    return this.institutesService.create(createInstituteDto);
  }

  @Get("search")
  async findByCourse(@Query("courseName") courseName: string) {
    return this.institutesService.findByCourseName(courseName);
  }

  // @Post()
  // create(@Body() createInstituteDto: CreateInstituteDto) {
  //   return this.institutesService.create(createInstituteDto);
  // }

  @Get()
  findAll() {
    return this.institutesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.institutesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateInstituteDto: UpdateInstituteDto
  ) {
    return this.institutesService.update(+id, updateInstituteDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.institutesService.remove(+id);
  }
}
