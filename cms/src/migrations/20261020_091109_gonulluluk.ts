import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_ayarlari" ADD COLUMN "volunteer_open" boolean DEFAULT false;
  ALTER TABLE "site_ayarlari_locales" ADD COLUMN "volunteer_note" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_ayarlari" DROP COLUMN "volunteer_open";
  ALTER TABLE "site_ayarlari_locales" DROP COLUMN "volunteer_note";`)
}
