import { IsEmail, IsNotEmpty, MinLength, IsDateString } from "class-validator";
import { Quiz } from "src/quiz/entities/quiz.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  displayName: string;

  @Column()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @Column()
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: Date;

  @OneToMany(() => Quiz, (quiz) => quiz.user)
  quizzes: Quiz[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  name: string;
}
