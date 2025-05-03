import { Courses } from "src/course/entities/course.entity";
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "categories" }) // Ensure it matches the existing DB table name
export class Categories {
  @PrimaryGeneratedColumn("uuid") // The category ID is a UUID and already exists
  uuid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Courses, (course) => course.category)
  courses: Courses[];
}
