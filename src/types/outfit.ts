export type ClothingItem = {
  id: string
  name: string
  imageUrl?: string | null
  color?: string | null
  type: string
}

export type Outfit = {
  top?: ClothingItem
  bottom?: ClothingItem
  shoes?: ClothingItem
  outerwear?: ClothingItem
}
