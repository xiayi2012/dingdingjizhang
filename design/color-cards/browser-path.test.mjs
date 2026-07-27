import assert from "node:assert/strict";
import { resolveBrowserExecutable } from "./browser-path.mjs";

const expected = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const actual = resolveBrowserExecutable([
  "C:\\missing\\chrome.exe",
  expected
], candidate => candidate === expected);

assert.equal(actual, expected);
console.log("Resolved the first available browser executable.");
