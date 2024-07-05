import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustLinkGroupTable1720172949676 implements MigrationInterface {
    name = 'AdjustLinkGroupTable1720172949676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP COLUMN \`GroupProjectRights\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD \`rights\` enum ('0', '1', '2') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD \`project\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD \`userGroup\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_3a08332f6d6eb92214be20ed0c0\` FOREIGN KEY (\`project\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_deba6048a523d9dbaf46f291379\` FOREIGN KEY (\`userGroup\`) REFERENCES \`user_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_deba6048a523d9dbaf46f291379\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_3a08332f6d6eb92214be20ed0c0\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP COLUMN \`userGroup\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP COLUMN \`project\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP COLUMN \`rights\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD \`GroupProjectRights\` enum ('0') NOT NULL`);
    }

}
