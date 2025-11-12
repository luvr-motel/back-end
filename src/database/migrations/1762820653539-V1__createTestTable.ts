import { MigrationInterface, QueryRunner } from "typeorm";

export class V1_createTestTable1762820653539 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
                create table teste {
                 id integer serial,
                 descricao varchar (100)
                }`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`drop table teste`)

    }

}
