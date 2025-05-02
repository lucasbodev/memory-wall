-- CreateEnum
CREATE TYPE "Language" AS ENUM ('fr', 'en', 'de', 'nl');

-- CreateEnum
CREATE TYPE "PhotoType" AS ENUM ('MAIN', 'DOCUMENT');

-- CreateTable
CREATE TABLE "Soldier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "born" TIMESTAMP(3) NOT NULL,
    "died" TIMESTAMP(3),
    "serviceStart" INTEGER NOT NULL,
    "serviceEnd" INTEGER NOT NULL,
    "rankId" TEXT,
    "unitId" TEXT,
    "birthplace" TEXT NOT NULL,
    "biography" TEXT NOT NULL,
    "quote" TEXT,

    CONSTRAINT "Soldier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "fieldName" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "soldierId" TEXT NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankTranslation" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "name" TEXT NOT NULL,
    "rankId" TEXT NOT NULL,

    CONSTRAINT "RankTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitTranslation" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "name" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,

    CONSTRAINT "UnitTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoldierCampaign" (
    "id" TEXT NOT NULL,
    "soldierId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "SoldierCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignTranslation" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "name" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "CampaignTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Medal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoldierMedal" (
    "id" TEXT NOT NULL,
    "soldierId" TEXT NOT NULL,
    "medalId" TEXT NOT NULL,

    CONSTRAINT "SoldierMedal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedalTranslation" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "name" TEXT NOT NULL,
    "medalId" TEXT NOT NULL,

    CONSTRAINT "MedalTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "PhotoType" NOT NULL,
    "caption" TEXT,
    "soldierId" TEXT NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoCaptionTranslation" (
    "id" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "caption" TEXT NOT NULL,
    "photoId" TEXT NOT NULL,

    CONSTRAINT "PhotoCaptionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Translation_soldierId_language_fieldName_idx" ON "Translation"("soldierId", "language", "fieldName");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_soldierId_language_fieldName_key" ON "Translation"("soldierId", "language", "fieldName");

-- CreateIndex
CREATE UNIQUE INDEX "Rank_name_key" ON "Rank"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RankTranslation_name_key" ON "RankTranslation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RankTranslation_rankId_language_key" ON "RankTranslation"("rankId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_name_key" ON "Unit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UnitTranslation_name_key" ON "UnitTranslation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UnitTranslation_unitId_language_key" ON "UnitTranslation"("unitId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_name_key" ON "Campaign"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SoldierCampaign_soldierId_campaignId_key" ON "SoldierCampaign"("soldierId", "campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignTranslation_name_key" ON "CampaignTranslation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignTranslation_campaignId_language_key" ON "CampaignTranslation"("campaignId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "Medal_name_key" ON "Medal"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SoldierMedal_soldierId_medalId_key" ON "SoldierMedal"("soldierId", "medalId");

-- CreateIndex
CREATE UNIQUE INDEX "MedalTranslation_name_key" ON "MedalTranslation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MedalTranslation_medalId_language_key" ON "MedalTranslation"("medalId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "PhotoCaptionTranslation_photoId_language_key" ON "PhotoCaptionTranslation"("photoId", "language");

-- AddForeignKey
ALTER TABLE "Soldier" ADD CONSTRAINT "Soldier_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Soldier" ADD CONSTRAINT "Soldier_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Translation" ADD CONSTRAINT "Translation_soldierId_fkey" FOREIGN KEY ("soldierId") REFERENCES "Soldier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankTranslation" ADD CONSTRAINT "RankTranslation_rankId_fkey" FOREIGN KEY ("rankId") REFERENCES "Rank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitTranslation" ADD CONSTRAINT "UnitTranslation_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoldierCampaign" ADD CONSTRAINT "SoldierCampaign_soldierId_fkey" FOREIGN KEY ("soldierId") REFERENCES "Soldier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoldierCampaign" ADD CONSTRAINT "SoldierCampaign_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignTranslation" ADD CONSTRAINT "CampaignTranslation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoldierMedal" ADD CONSTRAINT "SoldierMedal_soldierId_fkey" FOREIGN KEY ("soldierId") REFERENCES "Soldier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoldierMedal" ADD CONSTRAINT "SoldierMedal_medalId_fkey" FOREIGN KEY ("medalId") REFERENCES "Medal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedalTranslation" ADD CONSTRAINT "MedalTranslation_medalId_fkey" FOREIGN KEY ("medalId") REFERENCES "Medal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_soldierId_fkey" FOREIGN KEY ("soldierId") REFERENCES "Soldier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoCaptionTranslation" ADD CONSTRAINT "PhotoCaptionTranslation_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
