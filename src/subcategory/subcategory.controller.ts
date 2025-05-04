import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SubcategoryService } from "./subcategory.service";

@Controller("subcategory")
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Get("byCategoryId/:id")
  findByCategory(@Param("id") id: string) {
    return this.subcategoryService.findByCategory(id);
  }

  // @Post()
  // create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
  //   return this.subcategoryService.create(createSubcategoryDto);
  // }

  // @Get()
  // findAll() {
  //   return this.subcategoryService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.subcategoryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
  //   return this.subcategoryService.update(+id, updateSubcategoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.subcategoryService.remove(+id);
  // }
}
