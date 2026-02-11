
export const BODY_MAP = {
  head: { x: 120, y: 20, w: 60, h: 60 },
  top: { x: 80, y: 90, w: 140, h: 140 },
  outerwear: { x: 70, y: 80, w: 160, h: 170 },
  bottom: { x: 90, y: 220, w: 120, h: 170 },
  shoes: { x: 100, y: 400, w: 100, h: 70 }
} as const;

export const DRAW_ORDER = ["bottom", "shoes", "top", "outerwear"] as const;
