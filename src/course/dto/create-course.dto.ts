export class CreateCourseDto {}

export class PaginationDto {
  page: number;
  limit: number;
  categoryId?: number; // For filtering by category
}
