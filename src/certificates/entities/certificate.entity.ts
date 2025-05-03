import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Certificates {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column("uuid")
  @ApiProperty({ example: 1 })
  userId: string;

  @Column()
  @ApiProperty({ example: "Computer Science" })
  courseName: string;

  @Column()
  @ApiProperty({ example: "category-uuid" })
  categoryId: string;

  @Column({ nullable: true })
  @ApiProperty({ example: "http://localhost:3001/assets/certificates/1.pdf" })
  certificateUrl: string;

  @CreateDateColumn()
  @ApiProperty()
  issuedAt: Date;
}
