import { IsArray, IsNotEmpty, IsString } from "class-validator";

interface QuizTitle {
  title: string;
  status: string;
}

export class CreateQuizeDto {
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsArray()
  titles: QuizTitle[];
}

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
