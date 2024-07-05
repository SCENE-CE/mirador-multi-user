import { MigrationInterface, QueryRunner } from "typeorm";

export class UserGroupOwnerId1720083859573 implements MigrationInterface {
    name = 'UserGroupOwnerId1720083859573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`ownerId\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`ownerId\``);
    }

}
