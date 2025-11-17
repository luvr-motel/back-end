import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateItemlocacao1764000000000 implements MigrationInterface {
  name = 'CreateItemlocacao1764000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Se já existir uma tabela parcial criada manualmente, remove para recriar corretamente.
    await queryRunner.query(`DROP TABLE IF EXISTS "itemlocacao"`);

    await queryRunner.query(`
      CREATE TABLE "itemlocacao" (
        "itemlocacao_id" SERIAL NOT NULL,
        "comanda_id" integer NOT NULL,
        "locacao_id" integer NOT NULL,
        "produto_id" integer NOT NULL,
        "motel_id" integer NOT NULL,
        "itemlocacao_qtde" integer NOT NULL,
        "itemlocacao_valor" double precision,
        "itemlocacao_inclusao" TIMESTAMP NOT NULL DEFAULT now(),
        "itemlocacao_exclusao" TIMESTAMP,
        CONSTRAINT "PK_itemlocacao_id" PRIMARY KEY ("itemlocacao_id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "itemlocacao"
      ADD CONSTRAINT "FK_itemlocacao_comanda"
      FOREIGN KEY ("comanda_id") REFERENCES "comanda"("comanda_id")
      ON DELETE RESTRICT ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "itemlocacao"
      ADD CONSTRAINT "FK_itemlocacao_locacao"
      FOREIGN KEY ("locacao_id") REFERENCES "locacao"("locacao_id")
      ON DELETE RESTRICT ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "itemlocacao"
      ADD CONSTRAINT "FK_itemlocacao_produto"
      FOREIGN KEY ("produto_id") REFERENCES "produto"("produto_id")
      ON DELETE RESTRICT ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "itemlocacao"
      ADD CONSTRAINT "FK_itemlocacao_motel"
      FOREIGN KEY ("motel_id") REFERENCES "motel"("motel_id")
      ON DELETE RESTRICT ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "itemlocacao" DROP CONSTRAINT "FK_itemlocacao_motel"`);
    await queryRunner.query(`ALTER TABLE "itemlocacao" DROP CONSTRAINT "FK_itemlocacao_produto"`);
    await queryRunner.query(`ALTER TABLE "itemlocacao" DROP CONSTRAINT "FK_itemlocacao_locacao"`);
    await queryRunner.query(`ALTER TABLE "itemlocacao" DROP CONSTRAINT "FK_itemlocacao_comanda"`);
    await queryRunner.query(`DROP TABLE "itemlocacao"`);
  }
}

