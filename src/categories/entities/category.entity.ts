import { Courses } from "src/course/entities/course.entity";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "categories" })
export class Categories {
  @PrimaryGeneratedColumn("uuid") 
  uuid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Courses, (course) => course.category)
  courses: Courses[];

  @OneToMany(() => SubCategory, (sc) => sc.category)
  subCategories: SubCategory[];
}
