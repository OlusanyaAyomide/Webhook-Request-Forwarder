-- AlterTable
ALTER TABLE "public"."Apps" ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Coffer',
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Apps" ADD CONSTRAINT "Apps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
