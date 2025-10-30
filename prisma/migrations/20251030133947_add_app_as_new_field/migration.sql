/*
  Warnings:

  - You are about to drop the column `liveUrl` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "liveUrl",
ADD COLUMN     "appId" TEXT;

-- CreateTable
CREATE TABLE "public"."Apps" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isLive" BOOLEAN NOT NULL,

    CONSTRAINT "Apps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_appId_fkey" FOREIGN KEY ("appId") REFERENCES "public"."Apps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
