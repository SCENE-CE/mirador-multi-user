import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelationOneToMany1720174712898 implements MigrationInterface {
    name = 'FixRelationOneToMany1720174712898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_3a08332f6d6eb92214be20ed0c0\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_deba6048a523d9dbaf46f291379\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP COLUMN \`project\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP COLUMN \`userGroup\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`link_group_project_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`link_group_project_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_3221db9a1462ce4ca36cf034992\` FOREIGN KEY (\`link_group_project_id\`) REFERENCES \`link_group_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD CONSTRAINT \`FK_e08210ce920b966a412cf187b33\` FOREIGN KEY (\`link_group_project_id\`) REFERENCES \`link_group_project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP FOREIGN KEY \`FK_e08210ce920b966a412cf187b33\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_3221db9a1462ce4ca36cf034992\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`link_group_project_id\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`link_group_project_id\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD \`userGroup\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD \`project\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_deba6048a523d9dbaf46f291379\` FOREIGN KEY (\`userGroup\`) REFERENCES \`user_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_3a08332f6d6eb92214be20ed0c0\` FOREIGN KEY (\`project\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
