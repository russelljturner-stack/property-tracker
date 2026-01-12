/*
  Warnings:

  - You are about to drop the column `nonWildstoneDeveloperId` on the `development` table. All the data in the column will be lost.
  - You are about to drop the column `wildstoneDeveloper` on the `development` table. All the data in the column will be lost.
  - You are about to drop the column `wildstonePlanner` on the `development` table. All the data in the column will be lost.
  - You are about to drop the column `wildstoneOwner` on the `site` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `development_task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "development" DROP CONSTRAINT "development_nonWildstoneDeveloperId_fkey";

-- AlterTable
ALTER TABLE "development" DROP COLUMN "nonWildstoneDeveloperId",
DROP COLUMN "wildstoneDeveloper",
DROP COLUMN "wildstonePlanner",
ADD COLUMN     "externalDeveloperId" INTEGER,
ADD COLUMN     "internalDeveloper" TEXT,
ADD COLUMN     "internalPlanner" TEXT;

-- AlterTable
ALTER TABLE "development_task" ADD COLUMN     "assignedById" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "needsReview" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "site" DROP COLUMN "wildstoneOwner",
ADD COLUMN     "internalOwner" TEXT,
ADD COLUMN     "pipelineStatusId" INTEGER;

-- CreateTable
CREATE TABLE "site_pipeline_status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isParked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "site_pipeline_status_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_pipeline_status_name_key" ON "site_pipeline_status"("name");

-- AddForeignKey
ALTER TABLE "site" ADD CONSTRAINT "site_pipelineStatusId_fkey" FOREIGN KEY ("pipelineStatusId") REFERENCES "site_pipeline_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_externalDeveloperId_fkey" FOREIGN KEY ("externalDeveloperId") REFERENCES "contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
