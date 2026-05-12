/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Proxy" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Target" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Page_url_key" ON "Page"("url");
