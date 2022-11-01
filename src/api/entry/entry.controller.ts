import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { Entry } from './entities/entry.entity';
import { CreateEntriesDto } from './dto/create-entries.dto';

@Controller()
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @MessagePattern('createEntry')
  create(@Payload() createEntrieDto: CreateEntryDto) {
    return this.entryService.create(createEntrieDto);
  }

  @MessagePattern('createBulkEntry')
  createBulk(@Payload() createEntriesDto: CreateEntriesDto) {
    return this.entryService.createBulk(createEntriesDto);
  }

  @MessagePattern('findAllEntry')
  findAll(): Promise<Entry[]> {
    return this.entryService.findAll();
  }

  @MessagePattern('findOneEntry')
  findOne(@Payload() id: number): Promise<Entry> {
    return this.entryService.findOne(id);
  }

  @MessagePattern('updateEntry')
  update(@Payload() payload: any) {
    return this.entryService.update(payload.id, payload.updateEntryDto);
  }

  @MessagePattern('removeEntry')
  remove(@Payload() id: number) {
    return this.entryService.remove(id);
  }
}
