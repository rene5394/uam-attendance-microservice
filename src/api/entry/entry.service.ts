import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { Entry } from './entities/entry.entity';

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(Entry)
    private readonly entryRepository: Repository<Entry>
  ) {}

  async create(createEntryDto: CreateEntryDto): Promise<Entry> {
    return await this.entryRepository.save(createEntryDto);
  }

  async findAll(): Promise<Entry[]> {
    return await this.entryRepository.find();
  }

  async findOne(id: number): Promise<Entry> {
    return await this.entryRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateEntrieDto: UpdateEntryDto) {
    return await this.entryRepository.update(id, updateEntrieDto);
  }

  remove(id: number) {
    return `This action removes a #${id} entrie`;
  }
}
