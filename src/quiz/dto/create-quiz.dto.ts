// src/quiz/dto/create-quiz.dto.ts
import {
  IsUUID,
  IsArray,
  ValidateNested,
  IsIn,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

class QuizItemDto {
  @IsString() title: string;
  @IsIn(["locked", "unlocked"]) status:
    | "locked"
    | "unlocked"
    | "passed"
    | "failed";
}

export class CreateQuizDto {
  @IsUUID() subcategoryId: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizItemDto)
  items: QuizItemDto[];
}
