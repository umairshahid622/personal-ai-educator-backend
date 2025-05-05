import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common";
import { CourseService } from "./course.service";
import { PaginationDto } from "./dto/create-course.dto";

import { FindCoursesDto } from "./dto/find-course.dto";

@Controller("course")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get("findCourses")
  async findCourses(@Query() paginationDto: PaginationDto) {
    return this.courseService.paginate(paginationDto);
  }

  @Get("search")
  search(
    @Query("page", ParseIntPipe) page = 1,
    @Query("limit", ParseIntPipe) limit = 10,
    @Query("categoryUuid") categoryUuid: string,
    @Query("search") search?: string,
  ) {
    return this.courseService.findPaginated({
      page,
      limit,
      categoryUuid,
      search,
    });
  }
}
