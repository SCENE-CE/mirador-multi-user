import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkGroupProject1720102045558 implements MigrationInterface {
    name = 'LinkGroupProject1720102045558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`link_group_project\` (\`id\` int NOT NULL AUTO_INCREMENT, \`GroupProjectRights\` enum ('0') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`linkGroupProjectsId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`linkGroupProjectsId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD CONSTRAINT \`FK_6d3e325912c607f3e7a7149d73d\` FOREIGN KEY (\`linkGroupProjectsId\`) REFERENCES \`link_group_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_75ba3b02c3120565f46ae5e83bd\` FOREIGN KEY (\`linkGroupProjectsId\`) REFERENCES \`link_group_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_75ba3b02c3120565f46ae5e83bd\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP FOREIGN KEY \`FK_6d3e325912c607f3e7a7149d73d\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`linkGroupProjectsId\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`linkGroupProjectsId\``);
        await queryRunner.query(`DROP TABLE \`link_group_project\``);
    }

}
