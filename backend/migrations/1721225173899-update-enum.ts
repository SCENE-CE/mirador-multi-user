import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEnum1721225173899 implements MigrationInterface {
    name = 'UpdateEnum1721225173899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`type\` enum ('personal', 'multi-user') NOT NULL`);
        await queryRunner.query(`DROP INDEX \`constraint_right_project_userGroup\` ON \`link_group_project\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` CHANGE \`rights\` \`rights\` enum ('admin', 'reader', 'editor') NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`constraint_right_project_userGroup\` ON \`link_group_project\` (\`rights\`, \`project\`, \`user_group\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`constraint_right_project_userGroup\` ON \`link_group_project\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` CHANGE \`rights\` \`rights\` enum ('admin', 'reader', 'writer') NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`constraint_right_project_userGroup\` ON \`link_group_project\` (\`rights\`, \`project\`, \`user_group\`)`);
        await queryRunner.query(`ALTER TABLE \`user_group\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`user_group\` ADD \`type\` varchar(255) NOT NULL`);
    }

}
