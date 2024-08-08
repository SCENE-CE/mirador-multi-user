import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDb1723119708235 implements MigrationInterface {
    name = 'CreateDb1723119708235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`media\` (\`id\` int NOT NULL AUTO_INCREMENT, \`path\` varchar(255) NOT NULL, \`idCreator\` int NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`link_media_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`rights\` enum ('admin', 'reader', 'writer') NOT NULL, \`media\` int NULL, \`user_group\` int NULL, UNIQUE INDEX \`constraint_right_media_userGroup\` (\`rights\`, \`media\`, \`user_group\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`link_user_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`rights\` enum ('admin', 'reader', 'writer') NOT NULL, \`user\` int NOT NULL, \`user_group\` int NOT NULL, UNIQUE INDEX \`constrain_right_user_userGroup\` (\`rights\`, \`user\`, \`user_group\`), PRIMARY KEY (\`id\`, \`user\`, \`user_group\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`ownerId\` int NOT NULL, \`type\` enum ('personal', 'multi-user') NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`link_group_project\` (\`id\` int NOT NULL AUTO_INCREMENT, \`rights\` enum ('admin', 'reader', 'writer') NOT NULL, \`project\` int NULL, \`user_group\` int NULL, UNIQUE INDEX \`constraint_right_project_userGroup\` (\`rights\`, \`project\`, \`user_group\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`userWorkspace\` json NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`ownerId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`mail\` varchar(300) NOT NULL, \`name\` varchar(300) NOT NULL, \`password\` varchar(300) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(), UNIQUE INDEX \`IDX_7395ecde6cda2e7fe90253ec59\` (\`mail\`), INDEX \`IDX_065d4d8f3b5adb4a08841eae3c\` (\`name\`), INDEX \`IDX_638bac731294171648258260ff\` (\`password\`), INDEX \`IDX_e11e649824a45d8ed01d597fd9\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`link_media_group\` ADD CONSTRAINT \`FK_6c4fdbfa910baae4cf3928c2381\` FOREIGN KEY (\`media\`) REFERENCES \`media\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`link_media_group\` ADD CONSTRAINT \`FK_0ff50b1712b3ba56fdf8123632f\` FOREIGN KEY (\`user_group\`) REFERENCES \`user_group\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD CONSTRAINT \`FK_0d865ec2469d4b52e7590b2595b\` FOREIGN KEY (\`user\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD CONSTRAINT \`FK_a6c6dbc6784b234798475109b8a\` FOREIGN KEY (\`user_group\`) REFERENCES \`user_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_3a08332f6d6eb92214be20ed0c0\` FOREIGN KEY (\`project\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` ADD CONSTRAINT \`FK_a0a84359b618748c8cd5ecdf3fa\` FOREIGN KEY (\`user_group\`) REFERENCES \`user_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_9884b2ee80eb70b7db4f12e8aed\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_9884b2ee80eb70b7db4f12e8aed\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_a0a84359b618748c8cd5ecdf3fa\``);
        await queryRunner.query(`ALTER TABLE \`link_group_project\` DROP FOREIGN KEY \`FK_3a08332f6d6eb92214be20ed0c0\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP FOREIGN KEY \`FK_a6c6dbc6784b234798475109b8a\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP FOREIGN KEY \`FK_0d865ec2469d4b52e7590b2595b\``);
        await queryRunner.query(`ALTER TABLE \`link_media_group\` DROP FOREIGN KEY \`FK_0ff50b1712b3ba56fdf8123632f\``);
        await queryRunner.query(`ALTER TABLE \`link_media_group\` DROP FOREIGN KEY \`FK_6c4fdbfa910baae4cf3928c2381\``);
        await queryRunner.query(`DROP INDEX \`IDX_e11e649824a45d8ed01d597fd9\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_638bac731294171648258260ff\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_065d4d8f3b5adb4a08841eae3c\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_7395ecde6cda2e7fe90253ec59\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`project\``);
        await queryRunner.query(`DROP INDEX \`constraint_right_project_userGroup\` ON \`link_group_project\``);
        await queryRunner.query(`DROP TABLE \`link_group_project\``);
        await queryRunner.query(`DROP TABLE \`user_group\``);
        await queryRunner.query(`DROP INDEX \`constrain_right_user_userGroup\` ON \`link_user_group\``);
        await queryRunner.query(`DROP TABLE \`link_user_group\``);
        await queryRunner.query(`DROP INDEX \`constraint_right_media_userGroup\` ON \`link_media_group\``);
        await queryRunner.query(`DROP TABLE \`link_media_group\``);
        await queryRunner.query(`DROP TABLE \`media\``);
    }

}
