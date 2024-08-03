export default function isFile(type: any) {
  const t = ["video", "image", "text", "audio"];
  return !t.includes(type.split("/")[0]);
}
