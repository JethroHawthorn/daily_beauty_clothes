
export function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  box: { x: number; y: number; w: number; h: number }
) {
  const { x, y, w, h } = box;
  const iW = img.naturalWidth;
  const iH = img.naturalHeight;

  // Calculate scale to fit within the box while maintaining aspect ratio
  const scale = Math.min(w / iW, h / iH);
  const nW = iW * scale;
  const nH = iH * scale;

  // Center the image in the box
  const nX = x + (w - nW) / 2;
  const nY = y + (h - nH) / 2;

  ctx.drawImage(img, nX, nY, nW, nH);
}
