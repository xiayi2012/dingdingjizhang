const fs = require('node:fs');
const path = require('node:path');

const CUSTOM_TAGS = ['app-header', 'amount-card', 'progress-bar', 'status-tag', 'empty-state', 'bell-mark'];

function validateProject(root) {
  const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8'));
  const errors = [];
  app.pages.forEach((page) => {
    const base = path.join(root, page);
    ['.js', '.json', '.wxml', '.wxss'].forEach((ext) => {
      if (!fs.existsSync(base + ext)) errors.push(`Missing ${page}${ext}`);
    });
    if (!fs.existsSync(base + '.json') || !fs.existsSync(base + '.wxml')) return;
    const config = JSON.parse(fs.readFileSync(base + '.json', 'utf8'));
    const declared = config.usingComponents || {};
    const wxml = fs.readFileSync(base + '.wxml', 'utf8');
    CUSTOM_TAGS.forEach((tag) => {
      if (wxml.includes(`<${tag}`) && !declared[tag]) errors.push(`${page} uses undeclared ${tag}`);
    });
    Object.entries(declared).forEach(([name, target]) => {
      const componentBase = path.join(root, target.replace(/^\//, ''));
      if (!fs.existsSync(componentBase + '.wxml')) errors.push(`${page} references missing ${name}`);
    });
  });
  (app.tabBar?.list || []).forEach((tab) => {
    if (!app.pages.includes(tab.pagePath)) errors.push(`Invalid tab ${tab.pagePath}`);
  });
  return { pages: app.pages.length, tabs: app.tabBar?.list?.length || 0, errors };
}

if (require.main === module) {
  const result = validateProject(process.cwd());
  if (result.errors.length) {
    console.error(result.errors.join('\n'));
    process.exit(1);
  }
  console.log(`Project validation passed: ${result.pages} pages, ${result.tabs} tabs, cloud optional.`);
}

module.exports = { validateProject };
