#!/usr/bin/env node
// Applies the wouter patch after npm install (replaces pnpm patchedDependencies)
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TARGET = resolve(ROOT, 'node_modules/wouter/esm/index.js');

if (!existsSync(TARGET)) {
  console.log('[postinstall] wouter not found, skipping patch');
  process.exit(0);
}

const content = readFileSync(TARGET, 'utf8');

// Check if already patched
if (content.includes('__WOUTER_ROUTES__')) {
  console.log('[postinstall] wouter patch already applied');
  process.exit(0);
}

// Apply the patch: inject route collection into Switch component
const PATCH = `
  // Collect all route paths to window object
  if (typeof window !== 'undefined') {
    if (!window.__WOUTER_ROUTES__) {
      window.__WOUTER_ROUTES__ = [];
    }

    const allChildren = flattenChildren(children);
    allChildren.forEach((element) => {
      if (isValidElement(element) && element.props.path) {
        const path = element.props.path;
        if (!window.__WOUTER_ROUTES__.includes(path)) {
          window.__WOUTER_ROUTES__.push(path);
        }
      }
    });
  }

`;

const ANCHOR = `  for (const element of flattenChildren(children)) {`;

if (!content.includes(ANCHOR)) {
  console.log('[postinstall] wouter patch anchor not found, skipping');
  process.exit(0);
}

const patched = content.replace(ANCHOR, PATCH + ANCHOR);
writeFileSync(TARGET, patched, 'utf8');
console.log('[postinstall] wouter patch applied successfully');
