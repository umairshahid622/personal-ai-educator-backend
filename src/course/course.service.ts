import { Injectable } from "@nestjs/common";
import { CreateCourseDto, PaginationDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Courses } from "./entities/course.entity";
import { Repository } from "typeorm";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Courses)
    private readonly courseRepo: Repository<Courses>
  ) {}

  async paginate({ page = 1, limit = 10, categoryId }: PaginationDto) {
    const skip = (page - 1) * limit;
    const query = this.courseRepo
      .createQueryBuilder("course")
      .skip(skip)
      .take(limit);

    if (categoryId) {
      query.where("course.category_id = :categoryId", { categoryId });
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  create(createCourseDto: CreateCourseDto) {
    return "This action adds a new course";
  }

  findAll() {
    return "this action will return All Coureses";
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}
