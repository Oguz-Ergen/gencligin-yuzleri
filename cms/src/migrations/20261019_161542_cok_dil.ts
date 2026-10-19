import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('tr', 'en');
  CREATE TYPE "public"."enum__duyurular_v_published_locale" AS ENUM('tr', 'en');
  CREATE TABLE "duyurular_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_duyurular_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "belgeler_locales" (
  	"title" varchar NOT NULL,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "donemler_activities_locales" (
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "donemler_locales" (
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"highlight_title" varchar,
  	"highlight_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_ayarlari_stats_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_ayarlari_locales" (
  	"slogan" varchar NOT NULL,
  	"hero_text" varchar,
  	"about_title" varchar,
  	"about_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "_duyurular_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_duyurular_v" ADD COLUMN "published_locale" "enum__duyurular_v_published_locale";
  ALTER TABLE "duyurular_locales" ADD CONSTRAINT "duyurular_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."duyurular"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_duyurular_v_locales" ADD CONSTRAINT "_duyurular_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_duyurular_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "belgeler_locales" ADD CONSTRAINT "belgeler_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."belgeler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donemler_activities_locales" ADD CONSTRAINT "donemler_activities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donemler_activities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donemler_locales" ADD CONSTRAINT "donemler_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donemler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_ayarlari_stats_locales" ADD CONSTRAINT "site_ayarlari_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_ayarlari_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_ayarlari_locales" ADD CONSTRAINT "site_ayarlari_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_ayarlari"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "duyurular_locales_locale_parent_id_unique" ON "duyurular_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_duyurular_v_locales_locale_parent_id_unique" ON "_duyurular_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "belgeler_locales_locale_parent_id_unique" ON "belgeler_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "donemler_activities_locales_locale_parent_id_unique" ON "donemler_activities_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "donemler_locales_locale_parent_id_unique" ON "donemler_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_ayarlari_stats_locales_locale_parent_id_unique" ON "site_ayarlari_stats_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_ayarlari_locales_locale_parent_id_unique" ON "site_ayarlari_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_duyurular_v_snapshot_idx" ON "_duyurular_v" USING btree ("snapshot");
  CREATE INDEX "_duyurular_v_published_locale_idx" ON "_duyurular_v" USING btree ("published_locale");
  -- Mevcut (Türkçe) içeriği yeni dil tablolarına taşı; aşağıdaki DROP'lar veri kaybetmesin.
  INSERT INTO "duyurular_locales" ("title", "summary", "body", "_locale", "_parent_id")
    SELECT "title", "summary", "body", 'tr', "id" FROM "duyurular";
  INSERT INTO "_duyurular_v_locales" ("version_title", "version_summary", "version_body", "_locale", "_parent_id")
    SELECT "version_title", "version_summary", "version_body", 'tr', "id" FROM "_duyurular_v";
  INSERT INTO "belgeler_locales" ("title", "label", "_locale", "_parent_id")
    SELECT "title", "label", 'tr', "id" FROM "belgeler";
  INSERT INTO "donemler_activities_locales" ("title", "text", "_locale", "_parent_id")
    SELECT "title", "text", 'tr', "id" FROM "donemler_activities";
  INSERT INTO "donemler_locales" ("title", "intro", "highlight_title", "highlight_text", "_locale", "_parent_id")
    SELECT "title", "intro", "highlight_title", "highlight_text", 'tr', "id" FROM "donemler";
  INSERT INTO "media_locales" ("alt", "_locale", "_parent_id")
    SELECT "alt", 'tr', "id" FROM "media";
  INSERT INTO "site_ayarlari_stats_locales" ("label", "_locale", "_parent_id")
    SELECT "label", 'tr', "id" FROM "site_ayarlari_stats";
  INSERT INTO "site_ayarlari_locales" ("slogan", "hero_text", "about_title", "about_text", "_locale", "_parent_id")
    SELECT "slogan", "hero_text", "about_title", "about_text", 'tr', "id" FROM "site_ayarlari";
  ALTER TABLE "duyurular" DROP COLUMN "title";
  ALTER TABLE "duyurular" DROP COLUMN "summary";
  ALTER TABLE "duyurular" DROP COLUMN "body";
  ALTER TABLE "_duyurular_v" DROP COLUMN "version_title";
  ALTER TABLE "_duyurular_v" DROP COLUMN "version_summary";
  ALTER TABLE "_duyurular_v" DROP COLUMN "version_body";
  ALTER TABLE "belgeler" DROP COLUMN "title";
  ALTER TABLE "belgeler" DROP COLUMN "label";
  ALTER TABLE "donemler_activities" DROP COLUMN "title";
  ALTER TABLE "donemler_activities" DROP COLUMN "text";
  ALTER TABLE "donemler" DROP COLUMN "title";
  ALTER TABLE "donemler" DROP COLUMN "intro";
  ALTER TABLE "donemler" DROP COLUMN "highlight_title";
  ALTER TABLE "donemler" DROP COLUMN "highlight_text";
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "site_ayarlari_stats" DROP COLUMN "label";
  ALTER TABLE "site_ayarlari" DROP COLUMN "slogan";
  ALTER TABLE "site_ayarlari" DROP COLUMN "hero_text";
  ALTER TABLE "site_ayarlari" DROP COLUMN "about_title";
  ALTER TABLE "site_ayarlari" DROP COLUMN "about_text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "duyurular_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_duyurular_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "belgeler_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "donemler_activities_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "donemler_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_ayarlari_stats_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_ayarlari_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "duyurular_locales" CASCADE;
  DROP TABLE "_duyurular_v_locales" CASCADE;
  DROP TABLE "belgeler_locales" CASCADE;
  DROP TABLE "donemler_activities_locales" CASCADE;
  DROP TABLE "donemler_locales" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "site_ayarlari_stats_locales" CASCADE;
  DROP TABLE "site_ayarlari_locales" CASCADE;
  DROP INDEX "_duyurular_v_snapshot_idx";
  DROP INDEX "_duyurular_v_published_locale_idx";
  ALTER TABLE "duyurular" ADD COLUMN "title" varchar;
  ALTER TABLE "duyurular" ADD COLUMN "summary" varchar;
  ALTER TABLE "duyurular" ADD COLUMN "body" jsonb;
  ALTER TABLE "_duyurular_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_duyurular_v" ADD COLUMN "version_summary" varchar;
  ALTER TABLE "_duyurular_v" ADD COLUMN "version_body" jsonb;
  ALTER TABLE "belgeler" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "belgeler" ADD COLUMN "label" varchar;
  ALTER TABLE "donemler_activities" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "donemler_activities" ADD COLUMN "text" varchar;
  ALTER TABLE "donemler" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "donemler" ADD COLUMN "intro" varchar;
  ALTER TABLE "donemler" ADD COLUMN "highlight_title" varchar;
  ALTER TABLE "donemler" ADD COLUMN "highlight_text" varchar;
  ALTER TABLE "media" ADD COLUMN "alt" varchar NOT NULL;
  ALTER TABLE "site_ayarlari_stats" ADD COLUMN "label" varchar NOT NULL;
  ALTER TABLE "site_ayarlari" ADD COLUMN "slogan" varchar NOT NULL;
  ALTER TABLE "site_ayarlari" ADD COLUMN "hero_text" varchar;
  ALTER TABLE "site_ayarlari" ADD COLUMN "about_title" varchar;
  ALTER TABLE "site_ayarlari" ADD COLUMN "about_text" varchar;
  ALTER TABLE "_duyurular_v" DROP COLUMN "snapshot";
  ALTER TABLE "_duyurular_v" DROP COLUMN "published_locale";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__duyurular_v_published_locale";`)
}
