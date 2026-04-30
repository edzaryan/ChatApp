export function getBubbleRadius(position: "single" | "first" | "middle" | "last", isMine: boolean) {
  const R = 18;
  const r = 4; 

  if (position === "single") return `${R}px`;

  if (isMine) {
    if (position === "first")  return `${R}px ${R}px ${r}px ${R}px`;
    if (position === "middle") return `${R}px ${r}px ${r}px ${R}px`;
    if (position === "last")   return `${R}px ${r}px ${R}px ${R}px`;
  } else {
    if (position === "first")  return `${R}px ${R}px ${R}px ${r}px`;
    if (position === "middle") return `${r}px ${R}px ${R}px ${r}px`;
    if (position === "last")   return `${r}px ${R}px ${R}px ${R}px`;
  }
  return `${R}px`;
}