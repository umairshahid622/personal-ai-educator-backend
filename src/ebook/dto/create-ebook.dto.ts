// src/ebook/dto/create-ebook.dto.ts

import { IsString, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateEbookDto {
  @ApiProperty({ example: "Agile Methodologies Author Nicolas Viera" })
  @IsString()
  title: string;

  @ApiProperty({
    example:
      "http://localhost:3001/assets/ebook/images/Agile Methodologies Author Nicolas Viera.png",
    format: "url",
  })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({
    example:
      "http://localhost:3001/assets/ebook/pdf/Agile Methodologies Author Nicolas Viera.pdf",
    format: "url",
  })
  @IsUrl()
  pdfUrl: string;
}
