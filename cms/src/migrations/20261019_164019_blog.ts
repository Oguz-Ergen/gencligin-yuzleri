import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_yazilar_category" AS ENUM('Görüş', 'Saha Notları', 'Röportaj', 'Gençlik Gündemi', 'Politika');
  CREATE TYPE "public"."enum_yazilar_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__yazilar_v_version_category" AS ENUM('Görüş', 'Saha Notları', 'Röportaj', 'Gençlik Gündemi', 'Politika');
  CREATE TYPE "public"."enum__yazilar_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__yazilar_v_published_locale" AS ENUM('tr', 'en');
  CREATE TABLE "yazilar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"author" varchar,
  	"published_at" timestamp(3) with time zone,
  	"category" "enum_yazilar_category",
  	"image_id" integer,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_yazilar_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "yazilar_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_yazilar_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_author" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_category" "enum__yazilar_v_version_category",
  	"version_image_id" integer,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__yazilar_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__yazilar_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_yazilar_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "yazilar_id" integer;
  ALTER TABLE "yazilar" ADD CONSTRAINT "yazilar_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yazilar_locales" ADD CONSTRAINT "yazilar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."yazilar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_yazilar_v" ADD CONSTRAINT "_yazilar_v_parent_id_yazilar_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."yazilar"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_yazilar_v" ADD CONSTRAINT "_yazilar_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_yazilar_v_locales" ADD CONSTRAINT "_yazilar_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_yazilar_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "yazilar_image_idx" ON "yazilar" USING btree ("image_id");
  CREATE UNIQUE INDEX "yazilar_slug_idx" ON "yazilar" USING btree ("slug");
  CREATE INDEX "yazilar_updated_at_idx" ON "yazilar" USING btree ("updated_at");
  CREATE INDEX "yazilar_created_at_idx" ON "yazilar" USING btree ("created_at");
  CREATE INDEX "yazilar__status_idx" ON "yazilar" USING btree ("_status");
  CREATE UNIQUE INDEX "yazilar_locales_locale_parent_id_unique" ON "yazilar_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_yazilar_v_parent_idx" ON "_yazilar_v" USING btree ("parent_id");
  CREATE INDEX "_yazilar_v_version_version_image_idx" ON "_yazilar_v" USING btree ("version_image_id");
  CREATE INDEX "_yazilar_v_version_version_slug_idx" ON "_yazilar_v" USING btree ("version_slug");
  CREATE INDEX "_yazilar_v_version_version_updated_at_idx" ON "_yazilar_v" USING btree ("version_updated_at");
  CREATE INDEX "_yazilar_v_version_version_created_at_idx" ON "_yazilar_v" USING btree ("version_created_at");
  CREATE INDEX "_yazilar_v_version_version__status_idx" ON "_yazilar_v" USING btree ("version__status");
  CREATE INDEX "_yazilar_v_created_at_idx" ON "_yazilar_v" USING btree ("created_at");
  CREATE INDEX "_yazilar_v_updated_at_idx" ON "_yazilar_v" USING btree ("updated_at");
  CREATE INDEX "_yazilar_v_snapshot_idx" ON "_yazilar_v" USING btree ("snapshot");
  CREATE INDEX "_yazilar_v_published_locale_idx" ON "_yazilar_v" USING btree ("published_locale");
  CREATE INDEX "_yazilar_v_latest_idx" ON "_yazilar_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_yazilar_v_locales_locale_parent_id_unique" ON "_yazilar_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_yazilar_fk" FOREIGN KEY ("yazilar_id") REFERENCES "public"."yazilar"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_yazilar_id_idx" ON "payload_locked_documents_rels" USING btree ("yazilar_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "yazilar" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yazilar_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_yazilar_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_yazilar_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "yazilar" CASCADE;
  DROP TABLE "yazilar_locales" CASCADE;
  DROP TABLE "_yazilar_v" CASCADE;
  DROP TABLE "_yazilar_v_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_yazilar_fk";
  
  DROP INDEX "payload_locked_documents_rels_yazilar_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "yazilar_id";
  DROP TYPE "public"."enum_yazilar_category";
  DROP TYPE "public"."enum_yazilar_status";
  DROP TYPE "public"."enum__yazilar_v_version_category";
  DROP TYPE "public"."enum__yazilar_v_version_status";
  DROP TYPE "public"."enum__yazilar_v_published_locale";`)
}
