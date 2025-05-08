-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_soldierId_fkey";

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_soldierId_fkey" FOREIGN KEY ("soldierId") REFERENCES "Soldier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
