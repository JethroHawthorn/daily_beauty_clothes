
export const BODY_MAP = {
  head: { x: 120, y: 20, w: 60, h: 60 },
  top: { x: 80, y: 90, w: 140, h: 140 },
  outerwear: { x: 70, y: 80, w: 160, h: 170 },
  bottom: { x: 90, y: 220, w: 120, h: 170 },
  shoes: { x: 100, y: 400, w: 100, h: 70 },
  // Accessories
  hat: { x: 110, y: 5, w: 80, h: 60 },
  glasses: { x: 125, y: 35, w: 50, h: 20 },
  mask: { x: 125, y: 50, w: 50, h: 30 },
  earrings: { x: 115, y: 45, w: 70, h: 30 }
} as const;

export const DRAW_ORDER = ["bottom", "shoes", "top", "outerwear", "hat", "glasses", "mask", "earrings"] as const;
