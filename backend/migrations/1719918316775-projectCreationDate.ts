import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectCreationDate1719918316775 implements MigrationInterface {
    name = 'ProjectCreationDate1719918316775'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`created_at\``);
    }

}
