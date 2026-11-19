// Gera os PDFs de todas as aulas (ou só as passadas: node pdfs.mjs unit-02 unit-03).
// Precisa de um servidor na pasta englishbygediel: python3 -m http.server 8792
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';
const AQUI = path.dirname(new URL(import.meta.url).pathname);
const AULAS = path.join(AQUI, '..', 'aulas');
const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(AULAS).filter(f => f.endsWith('.js')).map(f => f.replace('.js', '')).sort();
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let falhas = 0;
for (const id of ids) {
  const erros = [];
  const p = await b.newPage(); p.on('pageerror', e => erros.push(e.message));
  await p.goto(`http://localhost:8792/livro/ebook.html?u=${id}&pdf=1`, { waitUntil: 'networkidle' });
  await p.waitForSelector('body[data-pronto]', { timeout: 10000 });
  await p.evaluate(() => document.fonts.ready);
  const pdf = await p.evaluate(() => window.LIVRO_AULAS && Object.values(window.LIVRO_AULAS)[0].pdf);
  const transborda = await p.$$eval('.pg', ps => ps.map((x, i) => { const r = x.getBoundingClientRect(); let m = 0;
    x.querySelectorAll('*:not(.rod):not(.rod *):not(.orb):not(.orb2)').forEach(c => { const cr = c.getBoundingClientRect(); if (cr.height) m = Math.max(m, cr.bottom - r.top); });
    return m > r.height - 40 ? i + 1 : 0; }).filter(Boolean));
  await p.pdf({ path: path.join(AQUI, '..', '..', pdf), format: 'A4', printBackground: true, preferCSSPageSize: true });
  const n = await p.$$eval('.pg', x => x.length);
  await p.close();
  // livro interativo
  const q = await b.newPage({ viewport: { width: 1440, height: 900 } }); q.on('pageerror', e => erros.push('livro: ' + e.message));
  await q.goto(`http://localhost:8792/livro/index.html?u=${id}`, { waitUntil: 'networkidle' });
  await q.waitForSelector('.lv-sec', { timeout: 8000 });
  for (const d of await q.$$('details[data-ex]')) { const ex = await d.getAttribute('data-ex'); await q.evaluate(e => document.querySelector(`[data-gabarito="${e}"]`).click(), ex); }
  await q.close();
  if (erros.length || transborda.length) falhas++;
  console.log(id, n + ' págs', transborda.length ? 'TRANSBORDA: ' + transborda : '', erros.join(' | '));
}
await b.close();
process.exit(falhas ? 1 : 0);
