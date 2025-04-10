export interface SoldierDTO {
    id?: string
    name: string
    rank: string
    unit: string
    born: string
    died?: string
    birthplace: string
    serviceStart: string
    serviceEnd: string
    biography: string
    quote?: string
    campaigns: string[]
    medals: string[]
    photoUrl: string
    documents: Array<{
      url: string
      caption?: string
    }>
  }