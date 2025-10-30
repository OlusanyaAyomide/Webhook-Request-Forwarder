-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'cmhcjycn30000mm3iifcqo79h';

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
