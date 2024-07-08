import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEnumMedia1720449972161 implements MigrationInterface {
    name = 'ChangeEnumMedia1720449972161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`constraint_right_media_userGroup\` ON \`link_media_group\``);
        await queryRunner.query(`ALTER TABLE \`link_media_group\` CHANGE \`rights\` \`rights\` enum ('admin', 'reader', 'writer') NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`constraint_right_media_userGroup\` ON \`link_media_group\` (\`rights\`, \`media\`, \`user_group\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`constraint_right_media_userGroup\` ON \`link_media_group\``);
        await queryRunner.query(`ALTER TABLE \`link_media_group\` CHANGE \`rights\` \`rights\` enum ('0', '1', '2') NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`constraint_right_media_userGroup\` ON \`link_media_group\` (\`rights\`, \`media\`, \`user_group\`)`);
    }

}
