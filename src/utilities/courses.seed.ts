// src/seeders/course.seed.ts

import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as path from "path";
import * as xlsx from "xlsx";
import { v4 as uuidv4 } from "uuid";

import { Courses } from "src/course/entities/course.entity";
import { Categories } from "src/categories/entities/category.entity";
import { SubCategory } from "src/subcategory/entities/subcategory.entity";

@Injectable()
export class CourseSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(Courses)
    private readonly courseRepo: Repository<Courses>,

    @InjectRepository(Categories)
    private readonly categoryRepo: Repository<Categories>,

    @InjectRepository(SubCategory)
    private readonly subCategoryRepo: Repository<SubCategory>
  ) {}

  async onModuleInit() {
    await this.seedCourses();
  }

  private async seedCourses() {
    const filePath = path.resolve(
      __dirname,
      "/Users/umairshahid/Desktop/Scraped data/Arts and Humanities.xlsx"
    );
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const records: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`📚 Found ${records.length} records to insert.`);

    for (const record of records) {
      const title = record["Title"]?.toString().trim();
      const url = record["URL"]?.toString().trim();
      if (!title || !url) continue;

      // Skip if course already exists
      const exists = await this.courseRepo.findOne({ where: { title, url } });
      if (exists) {
        console.log(`⏭️ Already exists: ${title}`);
        continue;
      }

      // 1) Category
      const categoryName = record["Category"]?.toString().trim();
      if (!categoryName) {
        console.warn(`⚠️ Skipping "${title}" (no Category)`);
        continue;
      }

      let category = await this.categoryRepo.findOne({
        where: { name: categoryName },
      });
      if (!category) {
        category = this.categoryRepo.create({ name: categoryName });
        await this.categoryRepo.save(category);
        console.log(`➕ Created Category: ${categoryName}`);
      }

      // 2) SubCategory
      const subCatName = record["Sub-Category"]?.toString().trim();
      let subCategory: SubCategory | null = null;
      if (subCatName) {
        subCategory = await this.subCategoryRepo.findOne({
          where: {
            name: subCatName,
            category: category, // ← pass the entity directly
          },
          relations: ["category"],
        });

        if (!subCategory) {
          subCategory = this.subCategoryRepo.create({
            name: subCatName,
            category: category,
          });
          await this.subCategoryRepo.save(subCategory);
          console.log(`   🔖 Created SubCategory: ${subCatName}`);
        }
      }

      // 3) Course
      const course = this.courseRepo.create({
        uuid: uuidv4(),
        title,
        url,
        category,
        subCategory,
        duration: record["Duration"]?.trim(),
        rating: record["Rating"]?.toString().trim() || "0",
        site: record["Site"]?.trim(),
        programType: record["Program Type"]?.trim()
          ? "Free Course"
          : "Paid Course",
        skills: record["Skills"]?.trim() || "",
      });

      try {
        await this.courseRepo.save(course);
        console.log(`✅ Inserted Course: ${title}`);
      } catch (err) {
        console.error(`❌ Failed to insert ${title}:`, err.message);
      }
    }

    console.log("🎉 All courses (plus categories & subcategories) seeded.");
  }
}
