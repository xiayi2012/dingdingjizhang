import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { browserExecutable } from "./browser-path.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.join(currentDir, "young-yellow-color-cards.html");
const outputPath = path.resolve(currentDir, "..", "generated", "young-yellow-color-cards.png");

const browser = await chromium.launch({ headless: true, executablePath: browserExecutable });
try {
  const context = await browser.newContext({
    viewport: { width: 1800, height: 1200 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  await page.goto(pathToFileURL(inputPath).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: outputPath, fullPage: true });
  console.log(outputPath);
} finally {
  await browser.close();
}
