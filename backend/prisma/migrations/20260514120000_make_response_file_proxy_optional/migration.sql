-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_fileId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_proxyId_fkey";

-- AlterTable
ALTER TABLE "Response" ALTER COLUMN "fileId" DROP NOT NULL,
ALTER COLUMN "proxyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_proxyId_fkey" FOREIGN KEY ("proxyId") REFERENCES "Proxy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
