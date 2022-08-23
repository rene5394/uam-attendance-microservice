import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './entities/status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>
  ) {}

  create(createStatusDto: CreateStatusDto) {
    return 'This action adds a new status';
  }

  async findAll(): Promise<Status[]> {
    return await this.statusRepository.find();
  }

  async findOne(id: number): Promise<Status> {
    return await this.statusRepository.findOne({ where: { id: id } });
  }

  update(id: number, updateStatusDto: UpdateStatusDto) {
    return `This action updates a #${id} status`;
  }

  remove(id: number) {
    return `This action removes a #${id} status`;
  }
}
