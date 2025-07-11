import { IsEmail, IsNotEmpty, MinLength, IsDateString } from "class-validator";
import { Certificate } from "src/certificates/entities/certificate.entity";
import { Degree } from "src/degree/entities/degree.entity";
import { Quiz } from "src/quiz/entities/quiz.entity";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import * as uuid from "uuid";

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

  @OneToMany(() => Certificate, (cert) => cert.user)
  certificates: Certificate[];

  @OneToMany(() => Degree, (deg) => deg.user)
  degrees: Degree[];

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ type: "text", nullable: true })
  emailVerificationToken: string | null;

  @Column({ type: "timestamp", nullable: true })
  emailTokenExpires: Date | null;

  @Column({ type: "uuid", nullable: true })
  passwordResetToken: string | null;

  @Column({ type: "timestamp", nullable: true })
  passwordResetExpires: Date | null;

  @BeforeInsert()
  generateId() {
    this.uuid = uuid.v4();
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
