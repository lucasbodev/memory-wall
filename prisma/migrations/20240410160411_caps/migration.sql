/*
  Warnings:

  - You are about to drop the `player` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "player";

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "age" INTEGER NOT NULL DEFAULT 18,
    "pictureUrl" TEXT,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");
