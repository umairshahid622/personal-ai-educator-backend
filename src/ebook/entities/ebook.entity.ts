// src/ebook/entities/ebook.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "ebooks" })
export class Ebook {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "varchar", length: 500 })
  imageUrl: string;

  @Column({ type: "varchar", length: 500 })
  pdfUrl: string;
}
