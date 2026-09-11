import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1789147305051 implements MigrationInterface {
  name = 'InitialSchema1789147305051';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "username" character varying(32) NOT NULL, "password" character varying(255) NOT NULL, "avatar_key" character varying(512), "points" numeric(10,2) NOT NULL DEFAULT '0', "total_submissions" integer NOT NULL DEFAULT '0', "total_resolved" integer NOT NULL DEFAULT '0', "streak" integer NOT NULL DEFAULT '0', "last_submission_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "UQ_29a05908a0fa0728526d2833657" UNIQUE ("username"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."Category_category_enum" AS ENUM('basics', 'data_structures', 'sorting', 'search', 'two_pointers', 'graph', 'dynamic_programming', 'greedy', 'backtracking', 'math', 'strings', 'bit_manipulation', 'stack', 'hashing', 'number_theory', 'sliding_window', 'recursion', 'simulation')`,
    );
    await queryRunner.query(
      `CREATE TABLE "Category" ("id" SERIAL NOT NULL, "id_problem" integer NOT NULL, "category" "public"."Category_category_enum" NOT NULL, CONSTRAINT "PK_c2727780c5b9b0c564c29a4977c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9f6e680800be77b9ebf152e792" ON "Category" ("id_problem") `,
    );
    await queryRunner.query(
      `CREATE TABLE "TestCase" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_problem" integer NOT NULL, "input" text, "output" text, CONSTRAINT "PK_392c5650e1a4ebb5907f422d028" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c8cf5761204520ab29157e0346" ON "TestCase" ("id_problem") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."Problem_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`,
    );
    await queryRunner.query(
      `CREATE TABLE "Problem" ("id" SERIAL NOT NULL, "title" character varying(128) NOT NULL, "points" numeric(10,2) NOT NULL DEFAULT '0', "author" character varying(32) NOT NULL, "description" text NOT NULL, "input_description" text NOT NULL, "output_description" text NOT NULL, "input_example" text, "output_example" text, "total_submitted" integer NOT NULL DEFAULT '0', "total_accepted" integer NOT NULL DEFAULT '0', "difficulty" "public"."Problem_difficulty_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5a29e9ea418972e5e020abbaebd" UNIQUE ("title"), CONSTRAINT "PK_7785652619bdafb6156a8648051" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."Submission_status_enum" AS ENUM('compilation error', 'runtime error', 'time limit exceeded', 'wrong answer', 'presentation error', 'submission error', 'pending', 'accepted')`,
    );
    await queryRunner.query(
      `CREATE TABLE "Submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_user" uuid NOT NULL, "id_problem" integer NOT NULL, "text" text NOT NULL, "language" character varying(64) NOT NULL, "status" "public"."Submission_status_enum" NOT NULL DEFAULT 'pending', "execution_time" integer NOT NULL, "submission_date" TIMESTAMP NOT NULL DEFAULT now(), "error" text, "memory_usage_MB" numeric(10,2) NOT NULL, "test_cases_passed" integer NOT NULL, CONSTRAINT "PK_d64c913a6255c7a88bb498522ac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c96dae633558ef6d6f5604fea5" ON "Submission" ("id_problem") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_submission_user_date" ON "Submission" ("id_user", "submission_date") `,
    );
    await queryRunner.query(
      `CREATE TABLE "PasswordResetCode" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "code_hash" character varying(255) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP, "attempts" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_857a1cdee93c1db3eb6131a9281" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7b40707949ce61c0f94f90bba0" ON "PasswordResetCode" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "Category" ADD CONSTRAINT "FK_9f6e680800be77b9ebf152e7920" FOREIGN KEY ("id_problem") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "TestCase" ADD CONSTRAINT "FK_c8cf5761204520ab29157e0346a" FOREIGN KEY ("id_problem") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Submission" ADD CONSTRAINT "FK_fca56fedf891b79f4b206e37714" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Submission" ADD CONSTRAINT "FK_c96dae633558ef6d6f5604fea51" FOREIGN KEY ("id_problem") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Submission" DROP CONSTRAINT "FK_c96dae633558ef6d6f5604fea51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Submission" DROP CONSTRAINT "FK_fca56fedf891b79f4b206e37714"`,
    );
    await queryRunner.query(
      `ALTER TABLE "TestCase" DROP CONSTRAINT "FK_c8cf5761204520ab29157e0346a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Category" DROP CONSTRAINT "FK_9f6e680800be77b9ebf152e7920"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7b40707949ce61c0f94f90bba0"`,
    );
    await queryRunner.query(`DROP TABLE "PasswordResetCode"`);
    await queryRunner.query(`DROP INDEX "public"."idx_submission_user_date"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c96dae633558ef6d6f5604fea5"`,
    );
    await queryRunner.query(`DROP TABLE "Submission"`);
    await queryRunner.query(`DROP TYPE "public"."Submission_status_enum"`);
    await queryRunner.query(`DROP TABLE "Problem"`);
    await queryRunner.query(`DROP TYPE "public"."Problem_difficulty_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c8cf5761204520ab29157e0346"`,
    );
    await queryRunner.query(`DROP TABLE "TestCase"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9f6e680800be77b9ebf152e792"`,
    );
    await queryRunner.query(`DROP TABLE "Category"`);
    await queryRunner.query(`DROP TYPE "public"."Category_category_enum"`);
    await queryRunner.query(`DROP TABLE "User"`);
  }
}
