import { Prisma } from "@prisma/client"

export type SoldierWithRelations = Prisma.SoldierGetPayload<{
  include: {
    rank: {
      include: { translations: true }
    }
    unit: {
      include: { translations: true }
    }
    campaigns: {
      include: { 
        campaign: {
          include: { translations: true }
        } 
      }
    }
    medals: {
      include: { 
        medal: {
          include: { translations: true }
        } 
      }
    }
    photos: {
      include: { translations: true }
    },
    translations: true
  }
}>