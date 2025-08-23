/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."AccountUser" DROP CONSTRAINT "AccountUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Announcement" DROP CONSTRAINT "Announcement_createdBy_fkey";

-- DropTable
DROP TABLE "public"."User";
