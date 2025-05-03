import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCertificateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Computer Science" })
  courseName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "category-id-123" })
  categoryId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "/assets/certificates/123.pdf",
    description: "Path to the generated certificate PDF",
    required: false,
  })
  certificateUrl?: string;
}
