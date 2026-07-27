import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(currentDir, "young-yellow-color-cards.html");

if (!fs.existsSync(htmlPath)) {
  console.error("Missing young yellow color card page.");
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf8");
const palettes = {
  "柠檬宝蓝": ["#F4C430", "#3157D5", "#FFFBEA", "#FFFFFF", "#242526", "#2C8A68", "#E45757"],
  "闪电黄海军蓝": ["#FFD84D", "#243B6B", "#FFF9E3", "#FFFEF8", "#22283A", "#3F8C72", "#F06B52"],
  "奶油薄荷": ["#F3CE63", "#58A990", "#FFF9E9", "#FFFFFF", "#273731", "#32846B", "#E46A5D"],
  "杏仁晴空": ["#F6C85F", "#6EA6D9", "#FFF8EA", "#FFFFFF", "#293441", "#3B8D72", "#E7695C"],
  "芥末森林": ["#D3A72F", "#244F46", "#F8F3E4", "#FFFDF7", "#26342F", "#34745E", "#C85D50"],
  "蜂蜜葡萄": ["#D9A52C", "#66518C", "#FBF4DF", "#FFFCF5", "#312B3C", "#4C806A", "#C45B63"]
};
const requiredText = [
  "柠檬黄", "奶油黄", "芥末黄", "叮叮记账", "今日支出", "¥128.50",
  "本月预算 ¥6,000", "已用 52%", "收入 +¥800", "3天后还款",
  "＋ 记一笔", "叮叮提醒"
];
const failures = [];

for (const [name, colors] of Object.entries(palettes)) {
  if (!html.includes(name)) failures.push(`Missing palette name: ${name}`);
  for (const color of colors) {
    if (!html.includes(color)) failures.push(`Missing ${name} color: ${color}`);
  }
}
for (const text of requiredText) {
  if (!html.includes(text)) failures.push(`Missing required text: ${text}`);
}
const recommendedTrueCount = (html.match(/recommended:\s*true/g) || []).length;
if (recommendedTrueCount !== 3) failures.push(`Expected 3 recommended palettes, found ${recommendedTrueCount}`);

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Verified 6 palettes and 42 color values.");
}
