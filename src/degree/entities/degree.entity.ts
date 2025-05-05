import { Categories } from "src/categories/entities/category.entity";
import { User } from "src/users/entities/users.entity";
import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("degrees")
@Unique(["userId", "categoryId"])
export class Degree {
  @PrimaryGeneratedColumn("uuid") id: string;

  @ManyToOne(() => User, (u) => u.degrees, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;
  @Column("uuid", { name: "user_id" }) userId: string;

  @ManyToOne(() => Categories, (c) => c.degrees, { onDelete: "CASCADE" })
  @JoinColumn({ name: "category_id" })
  category: Categories;
  @Column("uuid", { name: "category_id" }) categoryId: string;

  @Column("text", { name: "pdf_path" }) pdfPath: string;
  @CreateDateColumn({ name: "issued_at" }) issuedAt: Date;

  @Column({ name: "original_name", type: "varchar", length: 255 })
  originalName: string;
}
