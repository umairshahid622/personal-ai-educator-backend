import { Injectable } from "@nestjs/common";
import { CreateCourseDto, PaginationDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Courses } from "./entities/course.entity";
import { Brackets, Repository } from "typeorm";
import { FindCoursesDto, PaginatedResult } from "./dto/find-course.dto";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Courses)
    private readonly courseRepo: Repository<Courses>
  ) {}

  async paginate(dto: PaginationDto): Promise<PaginatedResult> {
    return this.findCourses(dto, {});
  }

  async findPaginated(dto: FindCoursesDto): Promise<PaginatedResult> {
    const { page = 1, limit = 10, categoryUuid, search } = dto;
    return this.findCourses({ page, limit }, { categoryUuid, search });
  }

  private async findCourses(
    { page = 1, limit = 10 }: PaginationDto,
    filters: { categoryUuid?: string; search?: string }
  ): Promise<PaginatedResult> {
    const skip = (page - 1) * limit;
    const qb = this.courseRepo.createQueryBuilder("c");

    if (filters.categoryUuid) {
      qb.andWhere("c.categoryUuid = :categoryUuid", {
        categoryUuid: filters.categoryUuid,
      });
    }

    if (filters.search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where("c.title ILIKE :q", { q: `%${filters.search}%` })
            .orWhere("c.programType ILIKE :q", { q: `%${filters.search}%` })
            .orWhere("c.duration ILIKE :q", { q: `%${filters.search}%` })
            .orWhere("c.rating ILIKE :q", { q: `%${filters.search}%` })
            .orWhere("c.skills ILIKE :q", { q: `%${filters.search}%` })
            .orWhere("c.site ILIKE :q", { q: `%${filters.search}%` });
        })
      );
    }

    qb.skip(skip).take(limit).orderBy("c.title", "ASC");
    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
