import { MigrationInterface, QueryRunner } from "typeorm";

export class SetArticleDescriptionDefaultEmptyString1758102086887 implements MigrationInterface {
    name = 'SetArticleDescriptionDefaultEmptyString1758102086887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "description" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "description" DROP DEFAULT`);
    }

}
