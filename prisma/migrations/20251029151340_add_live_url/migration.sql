-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "isLive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "liveUrl" TEXT;
