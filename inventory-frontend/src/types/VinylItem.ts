import type { Item } from './Item.ts'

export interface VinylItem extends Item {
  type: 'vinyl'
  artist: string
  year?: number
}
