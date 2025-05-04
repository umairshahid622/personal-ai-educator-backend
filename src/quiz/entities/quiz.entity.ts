// src/quiz/quiz.entity.ts
import { SubCategory } from "src/subcategory/entities/subcategory.entity";
import { User } from "src/users/entities/users.entity";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from "typeorm";

@Entity("quizzes")
// @Unique(["userId", "subCategoryId"])
export class Quiz {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (u) => u.quizzes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "user_id", type: "uuid" })
  userId: string;

  @ManyToOne(() => SubCategory, (s) => s.quizzes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "subcategory_id" })
  subCategory: SubCategory;

  @Column({ name: "subcategory_id", type: "uuid" })
  subCategoryId: string;

  @Column({ type: "jsonb" })
  items: { title: string; status: "locked" | "unlocked" }[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
