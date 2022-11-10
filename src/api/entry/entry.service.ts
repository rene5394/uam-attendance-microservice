import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceStatus } from 'src/common/enums/attendanceStatus.enum';
import { CustomRpcException } from 'src/common/exception/custom-rpc.exception';
import { daysBetweenDates, daysBetweenDatesNoWeekends } from 'src/common/utils/timeValidation';
import { DataSource, Repository } from 'typeorm';
import { CreateEntriesDto } from './dto/create-entries.dto';
import { CreateEntryDto } from './dto/create-entry.dto';
import { UpdateEntryDto } from './dto/update-entry.dto';
import { Entry } from './entities/entry.entity';

@Injectable()
export class EntryService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Entry)
    private readonly entryRepository: Repository<Entry>
  ) {}

  async create(createEntryDto: CreateEntryDto): Promise<Entry> {
    return await this.entryRepository.save(createEntryDto);
  }

  async createBulk(createEntriesDto: CreateEntriesDto): Promise<Entry[]> {
    const startDate = new Date(createEntriesDto.startDate);
    const endDate = new Date(createEntriesDto.endDate);
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);
    let daysRequested: Date[];    
    
    if (createEntriesDto.attendance_status === AttendanceStatus.compDay ||
      createEntriesDto.attendance_status === AttendanceStatus.pSG ||
      createEntriesDto.attendance_status === AttendanceStatus.lE ||
      createEntriesDto.attendance_status === AttendanceStatus.marriage ||
      createEntriesDto.attendance_status === AttendanceStatus.paternity ||
      createEntriesDto.attendance_status === AttendanceStatus.death) {
      daysRequested = daysBetweenDatesNoWeekends(startDate, endDate);
    } if (createEntriesDto.attendance_status === AttendanceStatus.vacation ||
      createEntriesDto.attendance_status === AttendanceStatus.maternity ||
      createEntriesDto.attendance_status === AttendanceStatus.iC ||
      createEntriesDto.attendance_status === AttendanceStatus.iL) {
      daysRequested = daysBetweenDates(startDate, endDate);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newattendanceEntries = await Promise.all(
        daysRequested.map( async(day: Date) => {
          day.setUTCHours(6, 0, 0, 0);
          createEntriesDto.date = day;

          const entry = {
            employee_id: createEntriesDto.employee_id,
            team_id: createEntriesDto.team_id,
            user_id: createEntriesDto.user_id,
            attendance_status: createEntriesDto.attendance_status,
            date: createEntriesDto.date
          } as CreateEntryDto;

          const attendance = await this.entryRepository.findOne({ where: {
            user_id: createEntriesDto.user_id,
            date: createEntriesDto.date
          }});

          if (attendance) {
            attendance.attendance_status = createEntriesDto.attendance_status;
            return await queryRunner.manager.save(Entry, entry);
          }

          return await queryRunner.manager.save(Entry, entry);
        })
      )

      await queryRunner.commitTransaction();

      return newattendanceEntries;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new CustomRpcException('Error executing create attendance entries SQL transaction'
      , HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
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
