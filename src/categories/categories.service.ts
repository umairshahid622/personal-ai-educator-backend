import { Injectable } from "@nestjs/common";
import { CategoryDTO, CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Categories } from "./entities/category.entity";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private readonly categoryRepo: Repository<Categories>
  ) {}

  async createCategory(name: CategoryDTO) {
    try {
      let paylaod = this.categoryRepo.create({
        name: name.name,
      });

      return await this.categoryRepo.save(paylaod);
    } catch (error) {}
  }

  async findAllCategories() {
    try {
      return await this.categoryRepo.find();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }

  // async find3Categories() {
  //   try {
  //     const mandatoryCategory = await this.categoryRepo.findOne({
  //       where: { name: "Arts and Humanities" },
  //     });

  //     const randomCategories = await this.categoryRepo
  //       .createQueryBuilder("category")
  //       .where({ name: Not("Arts and Humanities") })
  //       .orderBy("RANDOM()") // PostgreSQL random function
  //       .take(2)
  //       .getMany();

  //     return mandatoryCategory
  //       ? [mandatoryCategory, ...randomCategories]
  //       : randomCategories.slice(0, 3); // Fallback if mandatory not found
  //   } catch (error) {
  //     console.error("Error fetching categories:", error);
  //     throw new Error("Failed to fetch categories");
  //   }
  // }

  create(createCategoryDto: CreateCategoryDto) {
    return "This action adds a new category";
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
