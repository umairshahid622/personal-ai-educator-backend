import { IsNotEmpty } from "class-validator";

export class CreateCategoryDto {}

export class CategoryDTO {
  @IsNotEmpty()
  name: string;
}
