import { Injectable } from "@nestjs/common";
import { CreateCourseDto, PaginationDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Courses } from "./entities/course.entity";
import { Repository } from "typeorm";
import { FindCoursesDto } from "./dto/find-course.dto";

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
      query.where("course.categoryUuid = :categoryId", { categoryId });
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findPaginated(dto: FindCoursesDto) {
    const { page = 1, limit = 10, categoryUuid, search } = dto;
    const skip = (page - 1) * limit;

    const qb = this.courseRepo
      .createQueryBuilder("c")
      .where("c.categoryUuid = :categoryUuid", { categoryUuid });

    if (search) {
      qb.andWhere(
        `(c.title       ILIKE :q
         OR c.programType ILIKE :q
         OR c.duration    ILIKE :q
         OR c.skills      ILIKE :q)`,
        { q: `%${search}%` }
      );
    }

    const [data, total] = await qb
      .take(limit)
      .skip(skip)
      .orderBy("c.title", "ASC")
      .getManyAndCount();

    return {
      data,
      page,
      lastPage: Math.ceil(total / limit),
      total,
    };
  }
}
