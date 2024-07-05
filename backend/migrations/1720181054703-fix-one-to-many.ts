import { MigrationInterface, QueryRunner } from "typeorm";

export class FixOneToMany1720181054703 implements MigrationInterface {
    name = 'FixOneToMany1720181054703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP FOREIGN KEY \`FK_e08210ce920b966a412cf187b33\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_3221db9a1462ce4ca36cf034992\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`link_group_project_id\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`link_group_project_id\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD \`project_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD \`user_group_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_5f23fc1366347fd856b4ac0642e\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_0f909214249daf86c841548daea\` FOREIGN KEY (\`user_group_id\`) REFERENCES \`user_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_0f909214249daf86c841548daea\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_5f23fc1366347fd856b4ac0642e\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP COLUMN \`user_group_id\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP COLUMN \`project_id\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`link_group_project_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`link_group_project_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_3221db9a1462ce4ca36cf034992\` FOREIGN KEY (\`link_group_project_id\`) REFERENCES \`link_group_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD CONSTRAINT \`FK_e08210ce920b966a412cf187b33\` FOREIGN KEY (\`link_group_project_id\`) REFERENCES \`link_group_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
