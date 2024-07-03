import { MigrationInterface, QueryRunner } from "typeorm";

export class JoinTableUserGroup1719999631808 implements MigrationInterface {
    name = 'JoinTableUserGroup1719999631808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`link_user_group\` (\`userGroupId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_4f476df548c98349bee47e060c\` (\`userGroupId\`), INDEX \`IDX_a148a5279ac23c4854419c9e00\` (\`userId\`), PRIMARY KEY (\`userGroupId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD CONSTRAINT \`FK_4f476df548c98349bee47e060cb\` FOREIGN KEY (\`userGroupId\`) REFERENCES \`user_group\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` ADD CONSTRAINT \`FK_a148a5279ac23c4854419c9e004\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP FOREIGN KEY \`FK_a148a5279ac23c4854419c9e004\``);
        await queryRunner.query(`ALTER TABLE \`link_user_group\` DROP FOREIGN KEY \`FK_4f476df548c98349bee47e060cb\``);
        await queryRunner.query(`DROP INDEX \`IDX_a148a5279ac23c4854419c9e00\` ON \`link_user_group\``);
        await queryRunner.query(`DROP INDEX \`IDX_4f476df548c98349bee47e060c\` ON \`link_user_group\``);
        await queryRunner.query(`DROP TABLE \`link_user_group\``);
    }

}
