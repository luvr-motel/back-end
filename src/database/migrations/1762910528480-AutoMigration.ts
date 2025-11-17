import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1762910528480 implements MigrationInterface {
    name = 'AutoMigration1762910528480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pessoatipo" ("pessoatipo_id" SERIAL NOT NULL, "pessoatipo_descricao" character varying NOT NULL, "pessoatipo_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "pessoatipo_exclusao" TIMESTAMP, CONSTRAINT "PK_cc861ef1eec9e4c5a00b3e0b564" PRIMARY KEY ("pessoatipo_id"))`);
        await queryRunner.query(`CREATE TABLE "quarto_tipo" ("quartotipo_id" SERIAL NOT NULL, "quartotipo_descricao" character varying(255) NOT NULL DEFAULT '', "quartotipo_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "quartotipo_exclusao" TIMESTAMP, CONSTRAINT "PK_a71e741e26c1216fd6b6802afd8" PRIMARY KEY ("quartotipo_id"))`);
        await queryRunner.query(`CREATE TABLE "produto" ("produto_id" SERIAL NOT NULL, "produto_descricao" character varying NOT NULL, "produto_custo" numeric(10,2) NOT NULL, "produto_venda" numeric(10,2), "produto_marckup" numeric(10,2), "produto_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "produto_exclusao" TIMESTAMP, CONSTRAINT "PK_6783f1294d381b73938ddcedd46" PRIMARY KEY ("produto_id"))`);
        await queryRunner.query(`CREATE TABLE "comanda" ("comanda_id" SERIAL NOT NULL, "comanda_qtde" numeric(10,2) NOT NULL, "comanda_observacao" character varying, "comanda_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "comanda_exclusao" TIMESTAMP, "locacao_id" integer NOT NULL, "produto_id" integer NOT NULL, "motel_id" integer NOT NULL, CONSTRAINT "PK_6e450be788cc1bf315af9c43a15" PRIMARY KEY ("comanda_id"))`);
        await queryRunner.query(`CREATE TABLE "despesatipo" ("despesatipo_id" SERIAL NOT NULL, "despesatipo_descricao" character varying NOT NULL, "despesatipo_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "despesatipo_exclusao" TIMESTAMP, CONSTRAINT "PK_43f76bfc45bdd0d3a8da9dd0e8e" PRIMARY KEY ("despesatipo_id"))`);
        await queryRunner.query(`CREATE TABLE "despesa" ("despesa_id" SERIAL NOT NULL, "despesa_descricao" character varying(255) NOT NULL DEFAULT '', "despesa_parcela" integer, "despesa_aberto" boolean NOT NULL DEFAULT true, "despesa_total" numeric(10,2), "despesa_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "despesa_exclusao" TIMESTAMP, "pessoa_id" integer, "despesatipo_id" integer NOT NULL, "usuario_id" integer, "motel_id" integer NOT NULL, CONSTRAINT "PK_256e9379f9b92c1abf82820e237" PRIMARY KEY ("despesa_id"))`);
        await queryRunner.query(`CREATE TABLE "despesaquarto" ("despesaquarto_id" SERIAL NOT NULL, "despesaquarto_descricao" character varying(256) NOT NULL, "despesaquarto_parcela" integer, "despesaquarto_itens" character varying(256) NOT NULL, "despesatipo_id" integer, "pessoa_id" integer, "usuario_id" integer NOT NULL, "despesaquarto_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "despesaquarto_exclusao" TIMESTAMP, "quarto_id" integer NOT NULL, "motel_id" integer NOT NULL, CONSTRAINT "PK_d1e4a721c1434f4892595ebbd15" PRIMARY KEY ("despesaquarto_id"))`);
        await queryRunner.query(`CREATE TABLE "pagamento_forma" ("pagamentoForma_id" SERIAL NOT NULL, "pagamentoForma_descricao" character varying NOT NULL, "pagamentoForma_contaDestino" character varying NOT NULL, "pagamentoforma_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "pagamentoforma_exclusao" TIMESTAMP, "recebimento_id" integer, "motel_id" integer, CONSTRAINT "PK_eb1fd8103cea1621a486c5cb8e2" PRIMARY KEY ("pagamentoForma_id"))`);
        await queryRunner.query(`CREATE TABLE "recebimento" ("recebimento_id" SERIAL NOT NULL, "recebimento_descricao" character varying(255) NOT NULL, "recebimento_total" numeric(10,2), "recebimento_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "recebimento_exclusao" TIMESTAMP, "motelIdMotelId" integer, CONSTRAINT "PK_aa66f2f483ef0b824d3d69ae372" PRIMARY KEY ("recebimento_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."status" AS ENUM('ATIVO', 'INATIVO')`);
        await queryRunner.query(`CREATE TABLE "motel" ("motel_id" SERIAL NOT NULL, "motel_descricao" character varying(255), "motel_endereco" character varying(255), "motel_email" character varying(255), "motel_cnpj" character varying(18) NOT NULL, "motel_ativo" "public"."status" NOT NULL DEFAULT 'ATIVO', "motel_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "motel_exclusao" TIMESTAMP, CONSTRAINT "UQ_358a85ecd9d01d3a1b3326c2955" UNIQUE ("motel_cnpj"), CONSTRAINT "PK_107367ee395cdac03f03ee48ca0" PRIMARY KEY ("motel_id"))`);
        await queryRunner.query(`CREATE TABLE "quarto" ("quarto_id" SERIAL NOT NULL, "quarto_descricao" character varying(256) NOT NULL, "quarto_atributos" character varying, "quarto_ativo" boolean NOT NULL DEFAULT false, "quarto_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "quarto_exclusao" TIMESTAMP, "quartotipoQuartotipoId" integer NOT NULL, "motel_id" integer, CONSTRAINT "PK_0d8cd61e8bce4e570d451372ac2" PRIMARY KEY ("quarto_id"))`);
        await queryRunner.query(`CREATE TABLE "locacao_posicao" ("locacaoPosicao_id" SERIAL NOT NULL, "locacaoPosicao_descricao" character varying NOT NULL, "locacaoPosicao_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "locacaoPosicao_exclusao" TIMESTAMP, CONSTRAINT "PK_d3533d40b1140effd9aa5942e1c" PRIMARY KEY ("locacaoPosicao_id"))`);
        await queryRunner.query(`CREATE TABLE "locacao_tipo" ("locacaoTipo_id" SERIAL NOT NULL, "locacaoTipo_descricao" character varying NOT NULL, "locacaoTipo_valor" numeric(10,2) NOT NULL, "locacaoTipo_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "locacaoTipo_exclusao" TIMESTAMP, CONSTRAINT "PK_553686ca72e6db0134c8a031f7e" PRIMARY KEY ("locacaoTipo_id"))`);
        await queryRunner.query(`CREATE TABLE "locacao" ("locacao_id" SERIAL NOT NULL, "locacao_totalItens" numeric(10,2) NOT NULL, "locacao_totalQuarto" numeric(10,2) NOT NULL, "locacao_totalDesconto" numeric(10,2) NOT NULL, "locacao_totalLocacao" numeric(10,2) NOT NULL, "locacao_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "locacao_exclusao" TIMESTAMP, "motel_id" integer, "quarto_id" integer NOT NULL, "pessoa_id" integer NOT NULL, "pagamentoforma_id" integer, "usuario_id" integer, "locacao_posicao_id" integer, "locacao_tipo_id" integer, CONSTRAINT "PK_db5b9d6b2845509b63f41ce89c1" PRIMARY KEY ("locacao_id"))`);
        await queryRunner.query(`CREATE TABLE "pessoa" ("pessoa_id" SERIAL NOT NULL, "pessoa_nome" character varying NOT NULL, "pessoa_cpf" character varying, "pessoa_telefone" character varying, "pessoa_ativo" boolean NOT NULL DEFAULT true, "pessoa_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "pessoa_exclusao" TIMESTAMP, "pessoatipo_id" integer, CONSTRAINT "PK_588452ad41dec0e31cb096dd418" PRIMARY KEY ("pessoa_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."usuario_usuario_ativo_enum" AS ENUM('ativo', 'inativo')`);
        await queryRunner.query(`CREATE TYPE "public"."usuario_usuario_role_enum" AS ENUM('admin', 'gerente', 'recepcionista')`);
        await queryRunner.query(`CREATE TABLE "usuario" ("usuario_id" SERIAL NOT NULL, "usuario_codigo" character varying NOT NULL, "usuario_senha" character varying NOT NULL, "usuario_ativo" "public"."usuario_usuario_ativo_enum" NOT NULL DEFAULT 'ativo', "usuario_role" "public"."usuario_usuario_role_enum", "usuario_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "usuario_exclusao" TIMESTAMP, "pessoa_id" integer, "motel_id" integer, CONSTRAINT "PK_877d906b2b8b32d99cf7164ec19" PRIMARY KEY ("usuario_id"))`);
        await queryRunner.query(`CREATE TABLE "estoque_produto" ("estoqueProduto_id" SERIAL NOT NULL, "estoqueProduto_fisico" integer NOT NULL, "estoqueProduto_ativo" boolean NOT NULL DEFAULT true, "estoqueProduto_inclusao" TIMESTAMP NOT NULL DEFAULT now(), "estoqueProduto_exclusao" TIMESTAMP, "produto_id" integer, "motel_id" integer, CONSTRAINT "PK_54cb8d75a36c62b02d5c87df445" PRIMARY KEY ("estoqueProduto_id"))`);
        await queryRunner.query(`CREATE TABLE "registroponto" ("registroponto_id" SERIAL NOT NULL, "registroponto_entrada" boolean NOT NULL, "registroponto_inclusao" TIMESTAMP NOT NULL DEFAULT NOW(), "registroponto_exclusao" TIMESTAMP, "usuario_id" integer NOT NULL, "motel_id" integer, CONSTRAINT "PK_478eaade69886ace574ee3f4867" PRIMARY KEY ("registroponto_id"))`);
        await queryRunner.query(`ALTER TABLE "comanda" ADD CONSTRAINT "FK_39c3a1736e6be6bf0fbb5f7718a" FOREIGN KEY ("locacao_id") REFERENCES "locacao"("locacao_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comanda" ADD CONSTRAINT "FK_a280cc82d160db0813e0a4c49d6" FOREIGN KEY ("produto_id") REFERENCES "produto"("produto_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comanda" ADD CONSTRAINT "FK_2e96530049ae5f11359f00d6626" FOREIGN KEY ("motel_id") REFERENCES "motel"("motel_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "despesa" ADD CONSTRAINT "FK_b2490d026bff83c6acee64f9f32" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("pessoa_id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "despesa" ADD CONSTRAINT "FK_f9cc5866f5f2dc81d9362bcf77a" FOREIGN KEY ("despesatipo_id") REFERENCES "despesatipo"("despesatipo_id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "despesa" ADD CONSTRAINT "FK_6c69cc668a4f37ce3a4ca5ca47b" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "despesa" ADD CONSTRAINT "FK_9ae29034cbd6015740752aaf54f" FOREIGN KEY ("motel_id") REFERENCES "motel"("motel_id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "despesaquarto" ADD CONSTRAINT "FK_33327f0821d519aa336ff605f01" FOREIGN KEY ("quarto_id") REFERENCES "quarto"("quarto_id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "despesaquarto" ADD CONSTRAINT "FK_f9c818354a1bd8e4616ee790019" FOREIGN KEY ("motel_id") REFERENCES "motel"("motel_id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pagamento_forma" ADD CONSTRAINT "FK_19a53820084948e14ad8c2641ef" FOREIGN KEY ("recebimento_id") REFERENCES "recebimento"("recebimento_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pagamento_forma" ADD CONSTRAINT "FK_1ae151eadc6a3228e75cc69028c" FOREIGN KEY ("motel_id") REFERENCES "motel"("motel_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recebimento" ADD CONSTRAINT "FK_a8b4805e272d0cfd7cd5137dcac" FOREIGN KEY ("motelIdMotelId") REFERENCES "motel"("motel_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quarto" ADD CONSTRAINT "FK_07d5e56f82854a330ad832b31b0" FOREIGN KEY ("quartotipoQuartotipoId") REFERENCES "quarto_tipo"("quartotipo_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quarto" ADD CONSTRAINT "FK_ad2152392565c828f415124d8b6" FOREIGN KEY ("motel_id") REFERENCES "motel"("motel_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locacao" ADD CONSTRAINT "FK_095bdb0bd9c1699c47315ac54d2" FOREIGN KEY ("motel_id") REFERENCES "motel"("motel_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locacao" ADD CONSTRAINT "FK_7fb67492ce54c411c5c3e119e1e" FOREIGN KEY ("quarto_id") REFERENCES "quarto"("quarto_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locacao" ADD CONSTRAINT "FK_24670e18aa8b46cf549647b7a2d" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("pessoa_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locacao" ADD CONSTRAINT "FK_d934898fdb6db535de364a96878" FOREIGN KEY ("pagamentoforma_id") REFERENCES "pagamento_forma"("pagamentoForma_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locacao" ADD CONSTRAINT "FK_43be7a9272473e2413abc532825" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locacao" ADD CONSTRAINT "FK_db76370191f989fbbee12e9ac4b" FOREIGN KEY ("locacao_posicao_id") REFERENCES "locacao_posicao"("locacaoPosicao_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locacao" ADD CONSTRAINT "FK_131b25fbaf23af7ef43a3c5cbd0" FOREIGN KEY ("locacao_tipo_id") REFERENCES "locacao_tipo"("locacaoTipo_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pessoa" ADD CONSTRAINT "FK_184fd8c1e3865f34212bba099cf" FOREIGN KEY ("pessoatipo_id") REFERENCES "pessoatipo"("pessoatipo_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD CONSTRAINT "FK_d5ef921d402546275a9c7d2567b" FOREIGN KEY ("pessoa_id") REFERENCES "pessoa"("pessoa_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD CONSTRAINT "FK_659579ebaa0dc57858708ac17f4" FOREIGN KEY ("motel_id") REFERENCES "motel"("motel_id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "estoque_produto" ADD CONSTRAINT "FK_b3c3bf676cb9ab1a00a3abe3998" FOREIGN KEY ("produto_id") REFERENCES "produto"("produto_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estoque_produto" ADD CONSTRAINT "FK_cd4193be8688652cee9d56c9760" FOREIGN KEY ("motel_id") REFERENCES "motel"("motel_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "registroponto" ADD CONSTRAINT "FK_041dd8429e4fe0518536a42184e" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "registroponto" ADD CONSTRAINT "FK_ab97610539e0f378b9778adf9bf" FOREIGN KEY ("motel_id") REFERENCES "motel"("motel_id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "registroponto" DROP CONSTRAINT "FK_ab97610539e0f378b9778adf9bf"`);
        await queryRunner.query(`ALTER TABLE "registroponto" DROP CONSTRAINT "FK_041dd8429e4fe0518536a42184e"`);
        await queryRunner.query(`ALTER TABLE "estoque_produto" DROP CONSTRAINT "FK_cd4193be8688652cee9d56c9760"`);
        await queryRunner.query(`ALTER TABLE "estoque_produto" DROP CONSTRAINT "FK_b3c3bf676cb9ab1a00a3abe3998"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP CONSTRAINT "FK_659579ebaa0dc57858708ac17f4"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP CONSTRAINT "FK_d5ef921d402546275a9c7d2567b"`);
        await queryRunner.query(`ALTER TABLE "pessoa" DROP CONSTRAINT "FK_184fd8c1e3865f34212bba099cf"`);
        await queryRunner.query(`ALTER TABLE "locacao" DROP CONSTRAINT "FK_131b25fbaf23af7ef43a3c5cbd0"`);
        await queryRunner.query(`ALTER TABLE "locacao" DROP CONSTRAINT "FK_db76370191f989fbbee12e9ac4b"`);
        await queryRunner.query(`ALTER TABLE "locacao" DROP CONSTRAINT "FK_43be7a9272473e2413abc532825"`);
        await queryRunner.query(`ALTER TABLE "locacao" DROP CONSTRAINT "FK_d934898fdb6db535de364a96878"`);
        await queryRunner.query(`ALTER TABLE "locacao" DROP CONSTRAINT "FK_24670e18aa8b46cf549647b7a2d"`);
        await queryRunner.query(`ALTER TABLE "locacao" DROP CONSTRAINT "FK_7fb67492ce54c411c5c3e119e1e"`);
        await queryRunner.query(`ALTER TABLE "locacao" DROP CONSTRAINT "FK_095bdb0bd9c1699c47315ac54d2"`);
        await queryRunner.query(`ALTER TABLE "quarto" DROP CONSTRAINT "FK_ad2152392565c828f415124d8b6"`);
        await queryRunner.query(`ALTER TABLE "quarto" DROP CONSTRAINT "FK_07d5e56f82854a330ad832b31b0"`);
        await queryRunner.query(`ALTER TABLE "recebimento" DROP CONSTRAINT "FK_a8b4805e272d0cfd7cd5137dcac"`);
        await queryRunner.query(`ALTER TABLE "pagamento_forma" DROP CONSTRAINT "FK_1ae151eadc6a3228e75cc69028c"`);
        await queryRunner.query(`ALTER TABLE "pagamento_forma" DROP CONSTRAINT "FK_19a53820084948e14ad8c2641ef"`);
        await queryRunner.query(`ALTER TABLE "despesaquarto" DROP CONSTRAINT "FK_f9c818354a1bd8e4616ee790019"`);
        await queryRunner.query(`ALTER TABLE "despesaquarto" DROP CONSTRAINT "FK_33327f0821d519aa336ff605f01"`);
        await queryRunner.query(`ALTER TABLE "despesa" DROP CONSTRAINT "FK_9ae29034cbd6015740752aaf54f"`);
        await queryRunner.query(`ALTER TABLE "despesa" DROP CONSTRAINT "FK_6c69cc668a4f37ce3a4ca5ca47b"`);
        await queryRunner.query(`ALTER TABLE "despesa" DROP CONSTRAINT "FK_f9cc5866f5f2dc81d9362bcf77a"`);
        await queryRunner.query(`ALTER TABLE "despesa" DROP CONSTRAINT "FK_b2490d026bff83c6acee64f9f32"`);
        await queryRunner.query(`ALTER TABLE "comanda" DROP CONSTRAINT "FK_2e96530049ae5f11359f00d6626"`);
        await queryRunner.query(`ALTER TABLE "comanda" DROP CONSTRAINT "FK_a280cc82d160db0813e0a4c49d6"`);
        await queryRunner.query(`ALTER TABLE "comanda" DROP CONSTRAINT "FK_39c3a1736e6be6bf0fbb5f7718a"`);
        await queryRunner.query(`DROP TABLE "registroponto"`);
        await queryRunner.query(`DROP TABLE "estoque_produto"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_usuario_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_usuario_ativo_enum"`);
        await queryRunner.query(`DROP TABLE "pessoa"`);
        await queryRunner.query(`DROP TABLE "locacao"`);
        await queryRunner.query(`DROP TABLE "locacao_tipo"`);
        await queryRunner.query(`DROP TABLE "locacao_posicao"`);
        await queryRunner.query(`DROP TABLE "quarto"`);
        await queryRunner.query(`DROP TABLE "motel"`);
        await queryRunner.query(`DROP TYPE "public"."status"`);
        await queryRunner.query(`DROP TABLE "recebimento"`);
        await queryRunner.query(`DROP TABLE "pagamento_forma"`);
        await queryRunner.query(`DROP TABLE "despesaquarto"`);
        await queryRunner.query(`DROP TABLE "despesa"`);
        await queryRunner.query(`DROP TABLE "despesatipo"`);
        await queryRunner.query(`DROP TABLE "comanda"`);
        await queryRunner.query(`DROP TABLE "produto"`);
        await queryRunner.query(`DROP TABLE "quarto_tipo"`);
        await queryRunner.query(`DROP TABLE "pessoatipo"`);
    }

}
