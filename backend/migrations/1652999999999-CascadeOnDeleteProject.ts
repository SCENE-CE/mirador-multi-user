import { MigrationInterface, QueryRunner } from 'typeorm';

export class CascadeOnDeleteProject1652999999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE link_group_project 
      DROP FOREIGN KEY FK_3a08332f6d6eb92214be20ed0c0;
    `);
    await queryRunner.query(`
      ALTER TABLE link_group_project
      ADD CONSTRAINT FK_3a08332f6d6eb92214be20ed0c0
      FOREIGN KEY (project) REFERENCES project(id)
      ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE link_group_project 
      DROP FOREIGN KEY FK_3a08332f6d6eb92214be20ed0c0;
    `);
    await queryRunner.query(`
      ALTER TABLE link_group_project
      ADD CONSTRAINT FK_3a08332f6d6eb92214be20ed0c0
      FOREIGN KEY (project) REFERENCES project(id);
    `);
  }
}
