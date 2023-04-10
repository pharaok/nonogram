export const formatDuration = (d: number) => {
  const hours = Math.floor(d / (60 * 60 * 1000));
  const minutes = Math.floor(d / (60 * 1000)) % 60;
  const seconds = Math.floor(d / 1000) % 60;
  const time = [hours, minutes, seconds];
  const formatted = time
    .slice(time.findIndex((val, i) => !(+val === 0)))
    .map((val, i) => val.toString().padStart(i > 0 ? 2 : 1, "0"))
    .join(":");
  return formatted;
};
