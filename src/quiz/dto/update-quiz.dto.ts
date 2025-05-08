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

export class UpdateQuizItemResponse {
  message: string;
  status: "passed" | "failed";
  title: string;
  totalQuestions: number;
  passingMarks: number;
  obtainedMarks: number;
  unlockMessage?: string;
  certificateMessage?: string;
  degreeMessage?: string;
}
