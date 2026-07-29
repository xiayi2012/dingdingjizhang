import fs from "node:fs";

export function resolveBrowserExecutable(candidates, exists = fs.existsSync) {
  const executable = candidates.find(candidate => exists(candidate));
  if (!executable) {
    throw new Error("No supported Chrome or Edge executable was found.");
  }
  return executable;
}

export const browserExecutable = resolveBrowserExecutable([
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
]);

