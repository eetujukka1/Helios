/*
  Warnings:

  - You are about to drop the column `domain` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `file_id` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `page_id` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `proxy_id` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `status_code` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `proxy_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `target_id` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `targetId` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileId` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pageId` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proxyId` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusCode` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proxyId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Page" DROP COLUMN "domain",
ADD COLUMN     "targetId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "file_id",
DROP COLUMN "page_id",
DROP COLUMN "proxy_id",
DROP COLUMN "status_code",
ADD COLUMN     "fileId" INTEGER NOT NULL,
ADD COLUMN     "pageId" INTEGER NOT NULL,
ADD COLUMN     "proxyId" INTEGER NOT NULL,
ADD COLUMN     "statusCode" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "proxy_id",
DROP COLUMN "target_id",
ADD COLUMN     "proxyId" INTEGER NOT NULL,
ADD COLUMN     "targetId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Response_fileId_key" ON "Response"("fileId");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Target"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_proxyId_fkey" FOREIGN KEY ("proxyId") REFERENCES "Proxy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
