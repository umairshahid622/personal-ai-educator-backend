import { Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
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

  async createCategory(dto: CreateCategoryDto) {
    try {
      let paylaod = this.categoryRepo.create({
        name: dto.name,
        imageUrl: dto.imageUrl,
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


 
}
