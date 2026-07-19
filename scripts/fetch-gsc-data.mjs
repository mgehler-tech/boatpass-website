#!/usr/bin/env node
/**
 * Holt Search-Console-Daten für boatpass.de und schreibt einen JSON-Report.
 *
 * Env:
 *   GSC_SERVICE_ACCOUNT_JSON  – kompletter JSON-Key des Google Service Accounts
 *   GSC_SITE_URL              – Property, z. B. "sc-domain:boatpass.de" (Default)
 *   GSC_OUTPUT                – Zielpfad des Reports (Default: /tmp/gsc-report.json)
 *
 * Keine npm-Dependencies: JWT wird mit node:crypto signiert, API via fetch.
 */

import { createSign } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:boatpass.de';
const OUTPUT = process.env.GSC_OUTPUT || '/tmp/gsc-report.json';
const KEY_JSON = process.env.GSC_SERVICE_ACCOUNT_JSON;

if (!KEY_JSON) {
  console.error('GSC_SERVICE_ACCOUNT_JSON ist nicht gesetzt.');
  process.exit(1);
}

const key = JSON.parse(KEY_JSON);

function b64url(input) {
  return Buffer.from(input).toString('base64url');
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/webmasters.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(key.private_key, 'base64url');
  const jwt = `${header}.${claims}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!res.ok) throw new Error(`Token-Request fehlgeschlagen: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

async function queryAnalytics(token, body) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Analytics-Query fehlgeschlagen: ${res.status} ${await res.text()}`);
  return (await res.json()).rows || [];
}

const token = await getAccessToken();

// GSC-Daten haben ~3 Tage Verzögerung → Fenster endet vor 3 Tagen
const end = new Date();
end.setUTCDate(end.getUTCDate() - 3);
const start = new Date(end);
start.setUTCDate(start.getUTCDate() - 27);
const prevEnd = new Date(start);
prevEnd.setUTCDate(prevEnd.getUTCDate() - 1);
const prevStart = new Date(prevEnd);
prevStart.setUTCDate(prevStart.getUTCDate() - 27);

const current = { startDate: isoDate(start), endDate: isoDate(end) };
const previous = { startDate: isoDate(prevStart), endDate: isoDate(prevEnd) };

const [queries, pages, queryPage, prevQueries, prevPages] = await Promise.all([
  queryAnalytics(token, { ...current, dimensions: ['query'], rowLimit: 250 }),
  queryAnalytics(token, { ...current, dimensions: ['page'], rowLimit: 250 }),
  queryAnalytics(token, { ...current, dimensions: ['query', 'page'], rowLimit: 500 }),
  queryAnalytics(token, { ...previous, dimensions: ['query'], rowLimit: 250 }),
  queryAnalytics(token, { ...previous, dimensions: ['page'], rowLimit: 250 }),
]);

const report = {
  site: SITE_URL,
  generatedAt: new Date().toISOString(),
  period: current,
  previousPeriod: previous,
  queries,
  pages,
  queryPage,
  prevQueries,
  prevPages,
};

writeFileSync(OUTPUT, JSON.stringify(report, null, 2));
console.log(
  `GSC-Report geschrieben: ${OUTPUT} (${queries.length} Queries, ${pages.length} Seiten, Zeitraum ${current.startDate} bis ${current.endDate})`,
);
