#!/usr/bin/env node
// Parses a Lighthouse JSON report and asserts specific SEO audits.
// Usage: node scripts/lh-assert.mjs <path-to-lh.json> <page-label>

import { readFileSync } from 'fs';

const [, , jsonPath, label = ''] = process.argv;
const report = JSON.parse(readFileSync(jsonPath, 'utf8'));

const MUST_PASS = [
  'document-title',
  'meta-description',
  'hreflang',
  'canonical',
  'image-alt',
  'link-text',
];

let failed = false;

for (const audit of MUST_PASS) {
  const score = report.audits[audit]?.score;
  if (score !== 1) {
    console.error(`  FAIL [${label}] ${audit}: score=${score ?? 'missing'}`);
    failed = true;
  } else {
    console.log(`  pass [${label}] ${audit}`);
  }
}

// CWV als Info (kein Block)
const cwv = {
  'largest-contentful-paint': report.audits['largest-contentful-paint']?.numericValue,
  'cumulative-layout-shift': report.audits['cumulative-layout-shift']?.numericValue,
  'total-blocking-time': report.audits['total-blocking-time']?.numericValue,
};
console.log(`  info [${label}] LCP=${Math.round(cwv['largest-contentful-paint'] ?? 0)}ms  CLS=${cwv['cumulative-layout-shift']?.toFixed(3) ?? 'n/a'}  TBT=${Math.round(cwv['total-blocking-time'] ?? 0)}ms`);

process.exit(failed ? 1 : 0);
