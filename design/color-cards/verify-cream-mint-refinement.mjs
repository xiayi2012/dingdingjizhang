import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(currentDir, "cream-mint-refinement.html");
if (!fs.existsSync(htmlPath)) {
  console.error("Missing cream mint refinement page.");
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf8");
const variants = {
  "原版奶油薄荷": ["#F3CE63", "#58A990", "#FFF9E9", "#FFFFFF", "#273731", "#32846B", "#E46A5D"],
  "柔和奶油": ["#F1D37A", "#7FAE9A", "#FFFAEC", "#FFFDF8", "#2C3833", "#4D806B", "#D9786C"],
  "清爽薄荷": ["#F6D96B", "#45A987", "#F7FBF4", "#FFFFFF", "#203B33", "#278267", "#E06D5F"],
  "品牌平衡": ["#F2CC4D", "#4E9B7F", "#FFF9E8", "#FFFFFF", "#263631", "#3B7F69", "#D96F62"]
};
const requiredText = ["今日支出", "¥128.50", "手动记账", "聊天记账", "语音记账", "本月预算 ¥6,000", "已用 52%", "＋ 记一笔", "叮叮提醒"];
const failures = [];
for (const [name, colors] of Object.entries(variants)) {
  if (!html.includes(name)) failures.push(`Missing variant: ${name}`);
  colors.forEach(color => { if (!html.includes(color)) failures.push(`Missing ${name} color: ${color}`); });
}
requiredText.forEach(text => { if (!html.includes(text)) failures.push(`Missing text: ${text}`); });
const recommendedCount = (html.match(/recommended:\s*true/g) || []).length;
if (recommendedCount !== 1) failures.push(`Expected 1 recommended variant, found ${recommendedCount}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Verified 4 variants and 28 color values.");
}
