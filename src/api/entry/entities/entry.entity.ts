import {  Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('attendance')
export class Entry {
    @PrimaryColumn({ type: 'smallint', nullable: false })
    id: number;

    @Column({ type: 'smallint', nullable: false })
    employee_id: number;

    @Column({ type: 'smallint', nullable: false })
    team_id: number;

    @Column({ type: 'datetime', nullable: false })
    date: Date;

    @Column({ type: 'varchar', nullable: false })
    comment: string;

    @Column({ type: 'smallint', nullable: false })
    user_id: number;

    @Column({ type: 'smallint', nullable: false })
    attendance_status: number;

    @Column({ type: 'tinyint', nullable: false })
    days: number;

    @Column({ type: 'tinyint', nullable: false })
    update_by: number;

    @Column({ type: 'tinyint', nullable: false })
    paid: number;

    @Column({ type: 'datetime', nullable: false })
    created_at: Date;

    @Column({ type: 'datetime', nullable: false })
    updated_at: Date;
}
