import { IsNotEmpty, IsString } from "class-validator";

export class UpdateQuizStatusDto {
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  quizTitle: string;

  @IsNotEmpty()
  @IsString()
  previousTitle: string;

  @IsNotEmpty()
  @IsString()
  previousTitleStatus: string;

  @IsNotEmpty()
  @IsString()
  status: string;
}
