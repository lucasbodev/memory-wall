import { Prisma } from "@prisma/client"

export type SoldierWithRelations = Prisma.SoldierGetPayload<{
  include: {
    rank: true
    unit: true
    campaigns: {
      include: { campaign: true }
    }
    medals: {
      include: { medal: true }
    }
    photos: true
  }
}>