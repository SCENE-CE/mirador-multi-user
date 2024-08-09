import { MigrationInterface, QueryRunner } from "typeorm";

export class DbFix1723120438301 implements MigrationInterface {
    name = 'DbFix1723120438301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP FOREIGN KEY \`FK_0d865ec2469d4b52e7590b2595b\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP FOREIGN KEY \`FK_a6c6dbc6784b234798475109b8a\``);
        await queryRunner.query(`DROP INDEX \`constrain_right_user_userGroup\` ON \`link_user_group\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD PRIMARY KEY (\`id\`, \`user_group\`)`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP COLUMN \`user\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP COLUMN \`user_group\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD \`userGroupId\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`constrain_right_user_userGroup\` ON \`link_user_group\` (\`rights\`, \`userId\`, \`userGroupId\`)`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD CONSTRAINT \`FK_a148a5279ac23c4854419c9e004\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD CONSTRAINT \`FK_4f476df548c98349bee47e060cb\` FOREIGN KEY (\`userGroupId\`) REFERENCES \`user_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP FOREIGN KEY \`FK_4f476df548c98349bee47e060cb\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP FOREIGN KEY \`FK_a148a5279ac23c4854419c9e004\``);
        await queryRunner.query(`DROP INDEX \`constrain_right_user_userGroup\` ON \`link_user_group\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP COLUMN \`userGroupId\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD \`user_group\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD PRIMARY KEY (\`id\`, \`user_group\`)`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD \`user\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD PRIMARY KEY (\`id\`, \`user\`, \`user_group\`)`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`constrain_right_user_userGroup\` ON \`link_user_group\` (\`rights\`, \`user\`, \`user_group\`)`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD CONSTRAINT \`FK_a6c6dbc6784b234798475109b8a\` FOREIGN KEY (\`user_group\`) REFERENCES \`user_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD CONSTRAINT \`FK_0d865ec2469d4b52e7590b2595b\` FOREIGN KEY (\`user\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
