import { MigrationInterface, QueryRunner } from "typeorm";

export class MediaGroupRights1720445975559 implements MigrationInterface {
    name = 'MediaGroupRights1720445975559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_media_group\` ADD \`rights\` enum ('0', '1', '2') NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`constraint_right_media_userGroup\` ON \`link_media_group\` (\`rights\`, \`media\`, \`user_group\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`constraint_right_media_userGroup\` ON \`link_media_group\``);
        await queryRunner.query(`ALTER TABLE \`link_media_group\` DROP COLUMN \`rights\``);
    }

}
