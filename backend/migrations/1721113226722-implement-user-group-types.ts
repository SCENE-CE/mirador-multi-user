import { MigrationInterface, QueryRunner } from "typeorm";

export class ImplementUserGroupTypes1721113226722 implements MigrationInterface {
    name = 'ImplementUserGroupTypes1721113226722'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_3a08332f6d6eb92214be20ed0c0\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_3a08332f6d6eb92214be20ed0c0\` FOREIGN KEY (\`project\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_3a08332f6d6eb92214be20ed0c0\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_3a08332f6d6eb92214be20ed0c0\` FOREIGN KEY (\`project\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE RESTRICT`);
    }

}
