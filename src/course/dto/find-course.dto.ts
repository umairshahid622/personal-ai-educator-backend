// src/course/dto/find-course.dto.ts
import { IsInt, Min, IsOptional, IsString, IsUUID } from "class-validator";

export class FindCoursesDto {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  limit: number;

  @IsUUID()
  categoryUuid: string;

  @IsString()
  @IsOptional()
  search?: string;

}
