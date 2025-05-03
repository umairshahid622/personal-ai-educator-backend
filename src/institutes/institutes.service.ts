import { Injectable } from "@nestjs/common";
import { CreateInstituteDto } from "./dto/create-institute.dto";
import { UpdateInstituteDto } from "./dto/update-institute.dto";
import { Institute } from "./entities/institute.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class InstitutesService {
  constructor(
    @InjectRepository(Institute)
    private instituteRepository: Repository<Institute>
  ) {}

  async create(createInstituteDto: CreateInstituteDto): Promise<Institute> {
    const institute = this.instituteRepository.create(createInstituteDto);
    return await this.instituteRepository.save(institute);
  }

  async findByCourseName(courseName: string): Promise<Institute[]> {
    return this.instituteRepository
      .createQueryBuilder("institute")
      .where(":courseName = ANY(institute.courses)", { courseName })
      .getMany();
  }

  findAll() {
    return this.instituteRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} institute`;
  }

  update(id: number, updateInstituteDto: UpdateInstituteDto) {
    return `This action updates a #${id} institute`;
  }

  remove(id: number) {
    return `This action removes a #${id} institute`;
  }
}
