import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEnum1720449664087 implements MigrationInterface {
    name = 'ChangeEnum1720449664087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`constraint_right_project_userGroup\` ON \`link_group_project\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` CHANGE \`rights\` \`rights\` enum ('admin', 'reader', 'writer') NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`constraint_right_project_userGroup\` ON \`link_group_project\` (\`rights\`, \`project\`, \`user_group\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`constraint_right_project_userGroup\` ON \`link_group_project\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` CHANGE \`rights\` \`rights\` enum ('0', '1', '2') NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`constraint_right_project_userGroup\` ON \`link_group_project\` (\`rights\`, \`project\`, \`user_group\`)`);
    }

}
