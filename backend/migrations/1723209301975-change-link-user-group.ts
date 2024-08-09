import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeLinkUserGroup1723209301975 implements MigrationInterface {
    name = 'ChangeLinkUserGroup1723209301975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP FOREIGN KEY \`FK_0d865ec2469d4b52e7590b2595b\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP FOREIGN KEY \`FK_a6c6dbc6784b234798475109b8a\``);
        await queryRunner.query(`DROP INDEX \`constrain_right_user_userGroup\` ON \`link_user_group\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP COLUMN \`user\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP COLUMN \`user_group\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD \`user_group_id\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`constrain_right_user_userGroup\` ON \`link_user_group\` (\`rights\`, \`user_id\`, \`user_group_id\`)`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD CONSTRAINT \`FK_4ae32911e8b5606c9c1427d27dd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD CONSTRAINT \`FK_5acb1626a6c2cf31cfc95bd8f3f\` FOREIGN KEY (\`user_group_id\`) REFERENCES \`user_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP FOREIGN KEY \`FK_5acb1626a6c2cf31cfc95bd8f3f\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP FOREIGN KEY \`FK_4ae32911e8b5606c9c1427d27dd\``);
        await queryRunner.query(`DROP INDEX \`constrain_right_user_userGroup\` ON \`link_user_group\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP COLUMN \`user_group_id\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD \`user_group\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD \`user\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`constrain_right_user_userGroup\` ON \`link_user_group\` (\`rights\`, \`user\`, \`user_group\`)`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD CONSTRAINT \`FK_a6c6dbc6784b234798475109b8a\` FOREIGN KEY (\`user_group\`) REFERENCES \`user_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD CONSTRAINT \`FK_0d865ec2469d4b52e7590b2595b\` FOREIGN KEY (\`user\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
