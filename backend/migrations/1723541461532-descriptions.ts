import { MigrationInterface, QueryRunner } from "typeorm";

export class Descriptions1723541461532 implements MigrationInterface {
    name = 'Descriptions1723541461532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`description\` varchar(255) NOT NULL DEFAULT 'Description of the group'`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`description\` varchar(255) NOT NULL DEFAULT 'Description of the project'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`description\``);
    }

}
