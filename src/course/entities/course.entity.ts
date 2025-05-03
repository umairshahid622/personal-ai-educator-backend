
import { Categories } from "src/categories/entities/category.entity";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  
  @Entity({ name: "courses" }) // Ensure it matches your actual table name
  export class Courses {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;
  
    @Column()
    title: string;
  
    @Column()
    url: string;
  
    @ManyToOne(() => Categories, (category) => category.courses, {
      onDelete: "CASCADE",
    })
    @JoinColumn({ name: "category_id" })
    category: Categories;
  
    @Column()
    duration: string;
  
    @Column()
    programType: string;
  
    @Column()
    rating: string;
  
    @Column()
    subCategory: string;
  
    @Column()
    site: string;
  
    @Column({ nullable: true })
    skills: string;
  }
  