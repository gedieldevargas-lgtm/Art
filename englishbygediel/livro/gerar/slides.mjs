// Gera os slides em PDF (16:9) de cada aula: node livro/gerar/slides.mjs [id ...] (servidor na pasta englishbygediel, porta 8792)
// Saída: livro/slides/<id>.pdf · confere se algum conteúdo invade a área da câmera.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
import path from 'path';
const AQUI = path.dirname(new URL(import.meta.url).pathname);
const OUT = process.env.OUT || path.join(AQUI, '..', 'slides');
fs.mkdirSync(OUT, { recursive: true });
let ids = process.argv.slice(2);
if (!ids.length) ids = fs.readdirSync(path.join(AQUI, '..', 'aulas')).filter(f => f.endsWith('.js') && !f.startsWith('unit-')).map(f => f.slice(0, -3)).sort();
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
let ruins = 0;
for (const id of ids) {
  const errs = [];
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8792/livro/slides.html?u=' + id, { waitUntil: 'networkidle' });
  await p.waitForSelector('body[data-pronto]', { timeout: 10000 }); await p.evaluate(() => document.fonts.ready);
  const inv = await p.$$eval('.s', S => S.map((s, i) => {
    const c = s.querySelector('.cam').getBoundingClientRect(), a = s.querySelector('.area'), ar = a.getBoundingClientRect(); let bad = false;
    a.querySelectorAll('*').forEach(e => { const r = e.getBoundingClientRect(); if (!r.width) return;
      if (r.right > c.left + 2 && r.bottom > c.top + 2 && r.left < c.right && r.top < c.bottom) bad = true;
      if (r.bottom > ar.bottom + 2 || r.right > ar.right + 2) bad = true; });
    return bad ? i + 1 : 0; }).filter(Boolean));
  const n = await p.$$eval('.s', x => x.length);
  if (process.env.FOTOS) { const ss = await p.$$('.s'); for (const i of process.env.FOTOS.split(',').map(Number)) if (ss[i - 1]) await ss[i - 1].screenshot({ path: path.join(process.env.FOTOS_DIR, `${id}-${i}.png`) }); }
  await p.pdf({ path: path.join(OUT, id + '.pdf'), width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
  await p.close();
  if (inv.length || errs.length) ruins++;
  console.log(id, n + ' slides', inv.length ? 'INVADE/TRANSBORDA: ' + inv : '', errs.join(' | '));
}
await b.close();
process.exit(ruins ? 1 : 0);
