import { ApiProperty } from "@nestjs/swagger";

export class CreateInstituteDto {
  @ApiProperty({ example: "Bahria University Islamabad" })
  name: string;

  @ApiProperty({ example: 33.7179 })
  lat: number;

  @ApiProperty({ example: 73.0589 })
  lng: number;

  @ApiProperty({ example: ["Computer Science", "BBA", "Software Engineering"] })
  courses: string[];
}
