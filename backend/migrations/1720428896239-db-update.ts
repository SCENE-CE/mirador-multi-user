import { MigrationInterface, QueryRunner } from "typeorm";

export class DbUpdate1720428896239 implements MigrationInterface {
    name = 'DbUpdate1720428896239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_0f909214249daf86c841548daea\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_5f23fc1366347fd856b4ac0642e\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP COLUMN \`project_id\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP COLUMN \`user_group_id\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD \`project\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD \`user_group\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`constraint_right_project_userGroup\` ON \`link_group_project\` (\`rights\`, \`project\`, \`user_group\`)`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_3a08332f6d6eb92214be20ed0c0\` FOREIGN KEY (\`project\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_a0a84359b618748c8cd5ecdf3fa\` FOREIGN KEY (\`user_group\`) REFERENCES \`user_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_a0a84359b618748c8cd5ecdf3fa\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_3a08332f6d6eb92214be20ed0c0\``);
        await queryRunner.query(`DROP INDEX \`constraint_right_project_userGroup\` ON \`link_group_project\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP COLUMN \`user_group\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP COLUMN \`project\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD \`user_group_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD \`project_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_5f23fc1366347fd856b4ac0642e\` FOREIGN KEY (\`project_id\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_0f909214249daf86c841548daea\` FOREIGN KEY (\`user_group_id\`) REFERENCES \`user_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
