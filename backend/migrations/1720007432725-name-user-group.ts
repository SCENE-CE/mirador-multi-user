import { MigrationInterface, QueryRunner } from "typeorm";

export class NameUserGroup1720007432725 implements MigrationInterface {
    name = 'NameUserGroup1720007432725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`name\` varchar(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`name\``);
    }

}
