import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkMediaGroup1720439693137 implements MigrationInterface {
    name = 'LinkMediaGroup1720439693137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`link_media_group\` (\`id\` int NOT NULL AUTO_INCREMENT, \`media\` int NULL, \`user_group\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`link_media_group\` ADD CONSTRAINT \`FK_6c4fdbfa910baae4cf3928c2381\` FOREIGN KEY (\`media\`) REFERENCES \`media\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`link_media_group\` ADD CONSTRAINT \`FK_0ff50b1712b3ba56fdf8123632f\` FOREIGN KEY (\`user_group\`) REFERENCES \`user_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_media_group\` DROP FOREIGN KEY \`FK_0ff50b1712b3ba56fdf8123632f\``);
        await queryRunner.query(`ALTER TABLE \`link_media_group\` DROP FOREIGN KEY \`FK_6c4fdbfa910baae4cf3928c2381\``);
        await queryRunner.query(`DROP TABLE \`link_media_group\``);
    }

}
