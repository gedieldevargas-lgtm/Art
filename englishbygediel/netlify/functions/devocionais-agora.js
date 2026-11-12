// Botão "Buscar devocionais agora" do Gerenciar (só admin). A busca automática de hora em hora é o devocionais-sync.js.
// Variáveis no Netlify: MEMBROS_SERVICE_KEY (obrigatória), MEMBROS_URL e DEVOCIONAIS_PLAYLIST (opcionais).
const URL_MEMBROS = process.env.MEMBROS_URL || 'https://jzdxcefnlwjgimymgsux.supabase.co';
const PLAYLIST = process.env.DEVOCIONAIS_PLAYLIST || 'PLlmIRi6xi_keJZbXNzZT4OUFii-9jyYXZ';
const PULAR_AULAS_ATE = 2;                      // Aula 01 e Aula 02 não entram (a partir da 03)
const PALAVRAS = /(aula|devocional|english on mission)/i;
const resp = (status, obj) => ({ statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) });
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; EBGSync/1.0)', 'Accept-Language': 'pt-BR,pt;q=0.9' };

// ids da playlist, na ordem em que aparecem (o 1º é o mais novo)
async function idsDaPlaylist() {
  const r = await fetch(`https://www.youtube.com/playlist?list=${encodeURIComponent(PLAYLIST)}`, { headers: UA });
  if (!r.ok) throw new Error('YouTube respondeu ' + r.status);
  const html = await r.text();
  const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
  if (!m) throw new Error('Não consegui ler a playlist (o YouTube mudou o formato?)');
  const ids = [];
  (function ande(o) {
    if (Array.isArray(o)) return o.forEach(ande);
    if (o && typeof o === 'object') {
      if (typeof o.contentId === 'string' && /^[\w-]{11}$/.test(o.contentId) && !ids.includes(o.contentId)) ids.push(o.contentId);
      Object.values(o).forEach(ande);
    }
  })(JSON.parse(m[1]));
  return ids;
}
async function titulo(id) {
  const r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v=' + id)}&format=json`, { headers: UA });
  if (!r.ok) return null;                       // vídeo privado/removido: ignora
  return String((await r.json()).title || '').trim() || null;
}
const entra = t => PALAVRAS.test(t) && !(((t.match(/aula\s*0*(\d+)/i) || [])[1] | 0) > 0 && (+t.match(/aula\s*0*(\d+)/i)[1]) <= PULAR_AULAS_ATE);

async function sincronizar(KEY) {
  const sk = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
  const ids = await idsDaPlaylist();
  const ja = await fetch(`${URL_MEMBROS}/rest/v1/devocionais?select=video_id,titulo,capa`, { headers: sk });
  if (!ja.ok) throw new Error(ja.status === 404 ? 'Tabela devocionais não encontrada (rode o devocionais.sql).' : `Supabase recusou a leitura (${ja.status}). Confira a MEMBROS_SERVICE_KEY no Netlify.`);
  const tem = new Map((await ja.json()).map(x => [x.video_id, x]));
  const novos = [], ordens = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (tem.has(id)) { const x = tem.get(id); ordens.push({ video_id: id, titulo: x.titulo, capa: x.capa || '', ordem: i + 1 }); continue; }   // o banco exige o título mesmo ao só atualizar a posição
    const t = await titulo(id);
    if (t && entra(t)) novos.push({ video_id: id, titulo: t, capa: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, ordem: i + 1 });
  }
  const up = (linhas) => linhas.length ? fetch(`${URL_MEMBROS}/rest/v1/devocionais?on_conflict=video_id`, { method: 'POST', headers: { ...sk, Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(linhas) }) : null;
  for (const resposta of [await up(novos), await up(ordens)]) if (resposta && !resposta.ok) throw new Error('Supabase: ' + (await resposta.text()).slice(0, 200));
  return { naPlaylist: ids.length, novos: novos.map(n => n.titulo), jaCadastrados: ordens.length };
}

exports.entra = entra;
exports.sincronizar = sincronizar;
exports.idsDaPlaylist = idsDaPlaylist;
exports.handler = async (event) => {
  const KEY = process.env.MEMBROS_SERVICE_KEY;
  if (!KEY) return resp(500, { erro: 'Falta a variável MEMBROS_SERVICE_KEY no Netlify.' });
  const token = ((event.headers || {}).authorization || '').replace(/^Bearer\s+/i, '');
  if (token) {                                   // pedido manual: só o admin
    const u = await fetch(`${URL_MEMBROS}/auth/v1/user`, { headers: { apikey: KEY, Authorization: `Bearer ${token}` } });
    if (!u.ok) return resp(401, { erro: 'Sessão expirada. Entre de novo.' });
    const email = String((await u.json()).email || '').toLowerCase();
    const a = await fetch(`${URL_MEMBROS}/rest/v1/admins?select=email&email=ilike.${encodeURIComponent(email)}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
    if (!email || !a.ok || !(await a.json()).length) return resp(403, { erro: 'Só o admin pode usar isto.' });
  }
  try { return resp(200, await sincronizar(KEY)); } catch (e) { return resp(500, { erro: String(e.message || e) }); }
};
