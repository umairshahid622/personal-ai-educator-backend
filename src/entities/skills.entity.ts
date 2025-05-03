import { Courses } from "src/course/entities/course.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

@Entity({ name: "skills" }) // Matches the PostgreSQL table name
export class Skills {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Courses, (course) => course.skills)
  courses: Courses[];
}
