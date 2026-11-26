// Quem está na sala? A sala própria do Gediel (Central, LiveKit) responde /api/sala?action=ping&sala=ID com {count}.
// O navegador não pode perguntar direto (CORS), então a área de membros pergunta aqui e eu repasso.
// GET /.netlify/functions/sala-ping?salas=camila,jose  →  {"camila":0,"jose":1}
const CENTRAL = process.env.CENTRAL_URL || 'https://gedielcentral.netlify.app';
exports.handler = async (event) => {
  const ids = String((event.queryStringParameters || {}).salas || '').toLowerCase().split(',')
    .map((s) => s.trim().replace(/[^a-z0-9-]/g, '')).filter(Boolean).slice(0, 60);
  const out = {};
  await Promise.all(ids.map(async (id) => {
    try {
      const r = await fetch(`${CENTRAL}/api/sala?action=ping&sala=${encodeURIComponent(id)}`, { signal: AbortSignal.timeout(4000) });
      const d = r.ok ? await r.json() : {};
      out[id] = Number(d.count) || 0;
    } catch (e) { out[id] = 0; }
  }));
  return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(out) };
};
