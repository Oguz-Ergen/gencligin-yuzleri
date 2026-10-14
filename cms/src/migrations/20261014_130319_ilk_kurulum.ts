import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_duyurular_category" AS ENUM('Etkinlik', 'Çağrı', 'Haber', 'Gençlik Gündemi', 'Basın');
  CREATE TYPE "public"."enum_duyurular_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__duyurular_v_version_category" AS ENUM('Etkinlik', 'Çağrı', 'Haber', 'Gençlik Gündemi', 'Basın');
  CREATE TYPE "public"."enum__duyurular_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_site_ayarlari_social_platform" AS ENUM('Instagram', 'X', 'YouTube', 'LinkedIn', 'Facebook', 'TikTok');
  CREATE TABLE "duyurular" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"date" timestamp(3) with time zone,
  	"category" "enum_duyurular_category",
  	"summary" varchar,
  	"image_id" integer,
  	"body" jsonb,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_duyurular_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_duyurular_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_category" "enum__duyurular_v_version_category",
  	"version_summary" varchar,
  	"version_image_id" integer,
  	"version_body" jsonb,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__duyurular_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "belgeler" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"label" varchar,
  	"donem_id" integer,
  	"order" numeric,
  	"cover_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "donemler_cities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "donemler_activities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "donemler" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" numeric NOT NULL,
  	"years" varchar,
  	"title" varchar NOT NULL,
  	"intro" varchar,
  	"highlight_title" varchar,
  	"highlight_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_kart_url" varchar,
  	"sizes_kart_width" numeric,
  	"sizes_kart_height" numeric,
  	"sizes_kart_mime_type" varchar,
  	"sizes_kart_filesize" numeric,
  	"sizes_kart_filename" varchar,
  	"sizes_genis_url" varchar,
  	"sizes_genis_width" numeric,
  	"sizes_genis_height" numeric,
  	"sizes_genis_mime_type" varchar,
  	"sizes_genis_filesize" numeric,
  	"sizes_genis_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"duyurular_id" integer,
  	"belgeler_id" integer,
  	"donemler_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_ayarlari_hero_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "site_ayarlari_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "site_ayarlari_about_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "site_ayarlari_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_ayarlari_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_ayarlari" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slogan" varchar NOT NULL,
  	"hero_text" varchar,
  	"about_title" varchar,
  	"about_text" varchar,
  	"email" varchar,
  	"address" varchar,
  	"volunteer_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "duyurular" ADD CONSTRAINT "duyurular_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_duyurular_v" ADD CONSTRAINT "_duyurular_v_parent_id_duyurular_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."duyurular"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_duyurular_v" ADD CONSTRAINT "_duyurular_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "belgeler" ADD CONSTRAINT "belgeler_donem_id_donemler_id_fk" FOREIGN KEY ("donem_id") REFERENCES "public"."donemler"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "belgeler" ADD CONSTRAINT "belgeler_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "donemler_cities" ADD CONSTRAINT "donemler_cities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donemler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "donemler_activities" ADD CONSTRAINT "donemler_activities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."donemler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_duyurular_fk" FOREIGN KEY ("duyurular_id") REFERENCES "public"."duyurular"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_belgeler_fk" FOREIGN KEY ("belgeler_id") REFERENCES "public"."belgeler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_donemler_fk" FOREIGN KEY ("donemler_id") REFERENCES "public"."donemler"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_ayarlari_hero_images" ADD CONSTRAINT "site_ayarlari_hero_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_ayarlari_hero_images" ADD CONSTRAINT "site_ayarlari_hero_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_ayarlari"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_ayarlari_stats" ADD CONSTRAINT "site_ayarlari_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_ayarlari"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_ayarlari_about_images" ADD CONSTRAINT "site_ayarlari_about_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_ayarlari_about_images" ADD CONSTRAINT "site_ayarlari_about_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_ayarlari"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_ayarlari_social" ADD CONSTRAINT "site_ayarlari_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_ayarlari"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "duyurular_image_idx" ON "duyurular" USING btree ("image_id");
  CREATE UNIQUE INDEX "duyurular_slug_idx" ON "duyurular" USING btree ("slug");
  CREATE INDEX "duyurular_updated_at_idx" ON "duyurular" USING btree ("updated_at");
  CREATE INDEX "duyurular_created_at_idx" ON "duyurular" USING btree ("created_at");
  CREATE INDEX "duyurular__status_idx" ON "duyurular" USING btree ("_status");
  CREATE INDEX "_duyurular_v_parent_idx" ON "_duyurular_v" USING btree ("parent_id");
  CREATE INDEX "_duyurular_v_version_version_image_idx" ON "_duyurular_v" USING btree ("version_image_id");
  CREATE INDEX "_duyurular_v_version_version_slug_idx" ON "_duyurular_v" USING btree ("version_slug");
  CREATE INDEX "_duyurular_v_version_version_updated_at_idx" ON "_duyurular_v" USING btree ("version_updated_at");
  CREATE INDEX "_duyurular_v_version_version_created_at_idx" ON "_duyurular_v" USING btree ("version_created_at");
  CREATE INDEX "_duyurular_v_version_version__status_idx" ON "_duyurular_v" USING btree ("version__status");
  CREATE INDEX "_duyurular_v_created_at_idx" ON "_duyurular_v" USING btree ("created_at");
  CREATE INDEX "_duyurular_v_updated_at_idx" ON "_duyurular_v" USING btree ("updated_at");
  CREATE INDEX "_duyurular_v_latest_idx" ON "_duyurular_v" USING btree ("latest");
  CREATE INDEX "belgeler_donem_idx" ON "belgeler" USING btree ("donem_id");
  CREATE INDEX "belgeler_cover_idx" ON "belgeler" USING btree ("cover_id");
  CREATE INDEX "belgeler_updated_at_idx" ON "belgeler" USING btree ("updated_at");
  CREATE INDEX "belgeler_created_at_idx" ON "belgeler" USING btree ("created_at");
  CREATE UNIQUE INDEX "belgeler_filename_idx" ON "belgeler" USING btree ("filename");
  CREATE INDEX "donemler_cities_order_idx" ON "donemler_cities" USING btree ("_order");
  CREATE INDEX "donemler_cities_parent_id_idx" ON "donemler_cities" USING btree ("_parent_id");
  CREATE INDEX "donemler_activities_order_idx" ON "donemler_activities" USING btree ("_order");
  CREATE INDEX "donemler_activities_parent_id_idx" ON "donemler_activities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "donemler_number_idx" ON "donemler" USING btree ("number");
  CREATE INDEX "donemler_updated_at_idx" ON "donemler" USING btree ("updated_at");
  CREATE INDEX "donemler_created_at_idx" ON "donemler" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_kart_sizes_kart_filename_idx" ON "media" USING btree ("sizes_kart_filename");
  CREATE INDEX "media_sizes_genis_sizes_genis_filename_idx" ON "media" USING btree ("sizes_genis_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_duyurular_id_idx" ON "payload_locked_documents_rels" USING btree ("duyurular_id");
  CREATE INDEX "payload_locked_documents_rels_belgeler_id_idx" ON "payload_locked_documents_rels" USING btree ("belgeler_id");
  CREATE INDEX "payload_locked_documents_rels_donemler_id_idx" ON "payload_locked_documents_rels" USING btree ("donemler_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_ayarlari_hero_images_order_idx" ON "site_ayarlari_hero_images" USING btree ("_order");
  CREATE INDEX "site_ayarlari_hero_images_parent_id_idx" ON "site_ayarlari_hero_images" USING btree ("_parent_id");
  CREATE INDEX "site_ayarlari_hero_images_image_idx" ON "site_ayarlari_hero_images" USING btree ("image_id");
  CREATE INDEX "site_ayarlari_stats_order_idx" ON "site_ayarlari_stats" USING btree ("_order");
  CREATE INDEX "site_ayarlari_stats_parent_id_idx" ON "site_ayarlari_stats" USING btree ("_parent_id");
  CREATE INDEX "site_ayarlari_about_images_order_idx" ON "site_ayarlari_about_images" USING btree ("_order");
  CREATE INDEX "site_ayarlari_about_images_parent_id_idx" ON "site_ayarlari_about_images" USING btree ("_parent_id");
  CREATE INDEX "site_ayarlari_about_images_image_idx" ON "site_ayarlari_about_images" USING btree ("image_id");
  CREATE INDEX "site_ayarlari_social_order_idx" ON "site_ayarlari_social" USING btree ("_order");
  CREATE INDEX "site_ayarlari_social_parent_id_idx" ON "site_ayarlari_social" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "duyurular" CASCADE;
  DROP TABLE "_duyurular_v" CASCADE;
  DROP TABLE "belgeler" CASCADE;
  DROP TABLE "donemler_cities" CASCADE;
  DROP TABLE "donemler_activities" CASCADE;
  DROP TABLE "donemler" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_ayarlari_hero_images" CASCADE;
  DROP TABLE "site_ayarlari_stats" CASCADE;
  DROP TABLE "site_ayarlari_about_images" CASCADE;
  DROP TABLE "site_ayarlari_social" CASCADE;
  DROP TABLE "site_ayarlari" CASCADE;
  DROP TYPE "public"."enum_duyurular_category";
  DROP TYPE "public"."enum_duyurular_status";
  DROP TYPE "public"."enum__duyurular_v_version_category";
  DROP TYPE "public"."enum__duyurular_v_version_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_site_ayarlari_social_platform";`)
}
