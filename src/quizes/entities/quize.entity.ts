import { Categories } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/users.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

interface QuizTitle {
  title: string;
  status: string; // "locked", "unlocked", "passed", "failed"
}

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Categories)
  @JoinColumn({ name: "category_id" })
  category: Categories;

  @Column()
  categoryId: string;

  @Column({ type: "jsonb" })
  titles: QuizTitle[];

  @CreateDateColumn()
  createdAt: Date;
}
