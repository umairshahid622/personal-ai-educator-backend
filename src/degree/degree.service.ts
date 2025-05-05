import { Injectable } from "@nestjs/common";
import { CreateDegreeDto } from "./dto/create-degree.dto";
import { UpdateDegreeDto } from "./dto/update-degree.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Degree } from "./entities/degree.entity";

@Injectable()
export class DegreeService {
  constructor(
    @InjectRepository(Degree)
    private readonly degreeRepo: Repository<Degree>
  ) {}

  async findForUser(userId: string): Promise<Degree[]> {
    return this.degreeRepo.find({
      where: { userId },
      relations: ["category"], // eager load Category if useful
      order: { issuedAt: "DESC" },
    });
  }
}
