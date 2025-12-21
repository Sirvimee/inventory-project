import type { Item } from './Item.ts'

export interface BikeItem extends Item {
  type: 'bike'
  category: string
  quantity: number
}
