import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
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

  async createCategory(dto: CreateCategoryDto): Promise<Categories> {
    const category = this.categoryRepo.create(dto);
    try {
      return await this.categoryRepo.save(category);
    } catch (error: any) {
      if (error.code === "23505") {
        throw new ConflictException(`Category '${dto.name}' already exists.`);
      }
      throw new InternalServerErrorException("Failed to create category");
    }
  }

  async findAllCategories(): Promise<Categories[]> {
    return this.categoryRepo.find();
  }
}
