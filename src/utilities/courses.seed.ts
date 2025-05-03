import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as path from "path";
import * as xlsx from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { Courses } from "src/course/entities/course.entity";
import { Categories } from "src/categories/entities/category.entity";

@Injectable()
export class CourseSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(Courses)
    private readonly courseRepo: Repository<Courses>,

    @InjectRepository(Categories)
    private readonly categoryRepo: Repository<Categories>
  ) {}

  async onModuleInit() {
    await this.seedCourses();
  }

  async seedCourses() {
    const filePath = path.resolve(
      __dirname,
      "/Users/umairshahid/Desktop/Scraped data/Social Sciences.xlsx"
    );

    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const records: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log(`📚 Found ${records.length} records to insert.`);

    for (const record of records) {
      const existing = await this.courseRepo.findOne({
        where: { title: record["Title"]?.trim(), url: record["URL"]?.trim() },
      });

      if (existing) {
        console.log(`⏭️ Course already exists: ${record["Title"]}`);
        continue;
      }
      try {
        const categoryName = record["Category"]?.trim();

        if (!categoryName) {
          console.warn(`⚠️ Skipping course with missing category.`);
          continue;
        }

        // ✅ Find or create category
        let category = await this.categoryRepo.findOne({
          where: { name: categoryName },
        });

        if (!category) {
          category = this.categoryRepo.create({ name: categoryName });
          await this.categoryRepo.save(category);
          console.log(`➕ Created new category: ${categoryName}`);
        }

        const course = this.courseRepo.create({
          uuid: uuidv4(),
          title: record["Title"]?.trim(),
          url: record["URL"]?.trim(),
          category: category,
          duration: record["Duration"]?.trim(),
          rating: record["Rating"]?.toString().trim() || "0",
          site: record["Site"]?.trim(),
          subCategory: record["Sub-Category"]?.trim(),
          programType: record["Program Type"]?.trim() ? "Free Course" : "Paid Course",
          skills: record["Skills"]?.trim() || "",
        });

        await this.courseRepo.save(course);
      } catch (error) {
        console.error(
          `❌ Failed to insert course: ${record["Title"]}`,
          error.message
        );
      }
    }

    console.log("✅ All courses seeded successfully.");
  }
}
