import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(currentDir, "premium-color-cards.html"), "utf8");

const palettes = {
  "香槟燕麦": ["#8A6A4A", "#C8A46A", "#F7F3EC", "#FFFCF7", "#2E2924", "#4E7C67", "#B85C54"],
  "灰粉松露": ["#9B6F76", "#C6A6A9", "#F5F1F0", "#FFFCFC", "#352B2D", "#657B6A", "#B56A5A"],
  "鼠尾草羊绒": ["#6F806C", "#B7A88D", "#F3F2EC", "#FCFBF7", "#2B312B", "#547460", "#B56C61"],
  "深潭青灰": ["#2F6F73", "#7FA7A4", "#EFF4F3", "#FFFFFF", "#183438", "#3F7D63", "#C65F5F"],
  "普鲁士雾蓝": ["#36597A", "#90A4B8", "#F1F4F7", "#FBFCFD", "#172A3A", "#49775F", "#C77A45"],
  "鸢尾灰紫": ["#5E5B8A", "#A3A0BB", "#F3F2F7", "#FCFBFE", "#28263A", "#567565", "#BC646E"],
  "曜石香槟金": ["#22262B", "#B69A61", "#F4F2ED", "#FEFDF9", "#202327", "#567565", "#A9574F"],
  "深海铜棕": ["#173B43", "#B77A55", "#EFF3F1", "#FBFCFA", "#183035", "#3F7765", "#B45F50"],
  "黑梅铂银": ["#332B38", "#A7A0AA", "#F4F2F5", "#FDFCFE", "#2B2630", "#4E7564", "#B25F6A"]
};

const requiredText = [
  "轻奢柔和", "现代冷静", "深色点缀",
  "今日支出", "¥128.50", "本月预算 ¥6,000", "已用 52%",
  "收入 +¥800", "提醒 3天后还款", "＋ 记一笔"
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
if (recommendedTrueCount !== 3) {
  failures.push(`Expected 3 recommended palettes, found ${recommendedTrueCount}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Verified 9 palettes and 63 color values.");
}
