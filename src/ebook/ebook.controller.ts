import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { EbookService } from "./ebook.service";
import { CreateEbookDto } from "./dto/create-ebook.dto";
import { UpdateEbookDto } from "./dto/update-ebook.dto";
import { Ebook } from "./entities/ebook.entity";
import { ApiBody } from "@nestjs/swagger";

@Controller("ebook")
export class EbookController {
  constructor(private readonly ebookService: EbookService) {}

  // @Post()
  // create(@Body() createEbookDto: CreateEbookDto) {
  //   return this.ebookService.create(createEbookDto);
  // }

  @Post("bulk")
  @ApiBody({
    description: "Array of ebooks to create in bulk",
    type: CreateEbookDto,
    isArray: true,
    required: true,
  })
  createBulk(@Body() dtos: CreateEbookDto[]) {
    console.log(dtos);

    return this.ebookService.createBulk(dtos);
  }

  @Get()
  findAll() {
    return this.ebookService.findAll();
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.ebookService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateEbookDto: UpdateEbookDto) {
  //   return this.ebookService.update(+id, updateEbookDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.ebookService.remove(+id);
  // }
}
