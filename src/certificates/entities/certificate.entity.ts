import { SubCategory } from "src/subcategory/entities/subcategory.entity";
import { User } from "src/users/entities/users.entity";
import { Entity, Unique, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from "typeorm";



@Entity("certificates")
@Unique(["userId","subCategoryId"])
export class Certificate {
  @PrimaryGeneratedColumn("uuid") id: string;

  @ManyToOne(()=>User, (u)=>u.certificates,{onDelete:"CASCADE"})
  @JoinColumn({name:"user_id"}) user: User;
  @Column("uuid",{name:"user_id"}) userId: string;

  @ManyToOne(()=>SubCategory,(s)=>s.certificates,{onDelete:"CASCADE"})
  @JoinColumn({name:"subcategory_id"}) subCategory: SubCategory;
  @Column("uuid",{name:"subcategory_id"}) subCategoryId: string;

  @Column("text",{name:"pdf_path"}) pdfPath: string;
  @CreateDateColumn({name:"issued_at"}) issuedAt: Date;
}