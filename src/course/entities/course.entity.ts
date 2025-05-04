// src/course/entities/course.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Categories } from "src/categories/entities/category.entity";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";

@Entity({ name: "courses" })
export class Courses {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  url: string;

  // ——— Category relation ———
  @ManyToOne(() => Categories, (category) => category.courses, { eager: true })
  @JoinColumn({ name: "categoryUuid" })
  category: Categories;

  @Column({ name: "categoryUuid", type: "uuid" })
  categoryUuid: string;

  // ——— SubCategory relation ———
  @ManyToOne(() => SubCategory, (sub) => sub.courses, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: "subCategoryId" })
  subCategory: SubCategory | null;

  @Column({ name: "subCategoryId", type: "uuid", nullable: true })
  subCategoryId: string | null;

  // —— Your other columns, now with explicit types ——
  @Column({ type: "varchar", length: 100, nullable: true })
  duration: string | null;

  @Column({ type: "varchar", length: 10, default: "0" })
  rating: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  site: string | null;

  @Column({ type: "varchar", length: 50 })
  programType: string;

  @Column({ type: "text", nullable: true })
  skills: string | null;
}
