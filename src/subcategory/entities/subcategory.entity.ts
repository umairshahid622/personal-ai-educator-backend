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

  @OneToMany(() => Courses, (course) => course.subCategory)
  courses: Courses[];


  @Column({ default: false })
  isPassed: boolean;
}
