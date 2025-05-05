import { PartialType } from "@nestjs/swagger";
import { CreateQuizDto } from "./create-quiz.dto";
import { IsIn, IsInt, IsString, IsUUID, Min } from "class-validator";

export class UpdateQuizDto extends PartialType(CreateQuizDto) {}

export class UpdateQuizItemDto {
  @IsUUID()
  subCategoryId: string;

  @IsString()
  title: string;

  @IsInt()
  @Min(0)
  marks: number;
}
