export const COLOR_PALETTE: { name: string; hex: string }[] = [
  { name: "Noir", hex: "#161616" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Ivory", hex: "#F1EFEA" },
  { name: "Champagne", hex: "#D9C9A3" },
  { name: "Blush", hex: "#E8B4B8" },
  { name: "Rose", hex: "#F4C2B2" },
  { name: "Coral", hex: "#FFCBA4" },
  { name: "Peach", hex: "#FFD3B6" },
  { name: "Pink", hex: "#F8DFDF" },
  { name: "Rouge", hex: "#9B1B30" },
  { name: "Red", hex: "#9E1B32" },
  { name: "Crimson", hex: "#722F37" },
  { name: "Gold", hex: "#C9A227" },
  { name: "Sky Blue", hex: "#8BB7F8" },
  { name: "Blue", hex: "#26418F" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Emerald", hex: "#0F5132" },
  { name: "Slate", hex: "#3A3A38" },
  { name: "Stone", hex: "#8C8A84" },
];

export function colorNameForHex(hex: string): string {
  const normalized = hex.trim().toUpperCase();
  const match = COLOR_PALETTE.find((c) => c.hex.toUpperCase() === normalized);
  return match?.name ?? "Custom";
}
