// src/sub-category/entities/sub-category.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Categories } from "../../categories/entities/category.entity";
import { Courses } from "../../course/entities/course.entity";
import { Quiz } from "src/quiz/entities/quiz.entity";

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Categories, (category) => category.subCategories, {
    onDelete: "CASCADE",
  })
  category: Categories;

  @OneToMany(() => Quiz, (quiz) => quiz.subCategory)
  quizzes: Quiz[];

  @OneToMany(() => Courses, (course) => course.subCategory)
  courses: Courses[];
}
