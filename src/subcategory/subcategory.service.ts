import { Injectable } from "@nestjs/common";
import { CreateSubcategoryDto } from "./dto/create-subcategory.dto";
import { UpdateSubcategoryDto } from "./dto/update-subcategory.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { SubCategory } from "./entities/subcategory.entity";
import { Repository } from "typeorm";

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subRepo: Repository<SubCategory>
  ) {}

  async findByCategory(categoryId: string): Promise<SubCategory[]> {
    return this.subRepo.find({
      where: { category: { uuid: categoryId } },
      relations: ["category"], // eager parent if you need it
      order: { name: "ASC" }, // optional
    });
  }

  create(createSubcategoryDto: CreateSubcategoryDto) {
    return "This action adds a new subcategory";
  }

  findAll() {
    return `This action returns all subcategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subcategory`;
  }

  update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {
    return `This action updates a #${id} subcategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subcategory`;
  }
}
