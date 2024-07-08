import { MigrationInterface, QueryRunner } from "typeorm";

export class MediaEntity1720438314387 implements MigrationInterface {
    name = 'MediaEntity1720438314387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media\` ADD \`path\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`media\` ADD \`idCreator\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN \`idCreator\``);
        await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN \`path\``);
    }

}
