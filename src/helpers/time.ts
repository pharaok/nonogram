export const formatDuration = (d: number) => {
  const hours = Math.floor(d / (60 * 60 * 1000));
  const minutes = Math.floor(d / (60 * 1000)) % 60;
  const seconds = Math.floor(d / 1000) % 60;
  const time = [hours, minutes, seconds];
  const si = time.findIndex((val) => val);
  const formatted = time
    .slice(Math.min(1, si === -1 ? time.length : si))
    .map((val, i) => val.toString().padStart(i > 0 ? 2 : 1, "0"))
    .join(":");
  return formatted;
};
