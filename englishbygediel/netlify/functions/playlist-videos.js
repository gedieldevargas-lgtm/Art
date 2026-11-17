// Lista os vídeos de uma playlist PÚBLICA do YouTube (sem chave de API). Usado pelo card "Playlist" do app.
// GET /.netlify/functions/playlist-videos?list=PLxxxxxxxx
const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; EBGSync/1.0)', 'Accept-Language': 'pt-BR,pt;q=0.9' };
const resp = (status, obj) => ({ statusCode: status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' }, body: JSON.stringify(obj) });

exports.handler = async (event) => {
  const list = String((event.queryStringParameters || {}).list || '').trim();
  if (!/^[\w-]{10,60}$/.test(list)) return resp(400, { erro: 'Link da playlist inválido.' });
  try {
    const r = await fetch(`https://www.youtube.com/playlist?list=${encodeURIComponent(list)}`, { headers: UA });
    if (!r.ok) return resp(502, { erro: 'O YouTube respondeu ' + r.status });
    const html = await r.text();
    const m = html.match(/var ytInitialData = (\{.*?\});<\/script>/s);
    if (!m) return resp(502, { erro: 'Não consegui ler a playlist (ela é pública? o link está completo?)' });
    const vids = [];
    (function ande(o) {
      if (Array.isArray(o)) return o.forEach(ande);
      if (o && typeof o === 'object') {
        if (o.playlistVideoRenderer && /^[\w-]{11}$/.test(o.playlistVideoRenderer.videoId || '')) {
          const p = o.playlistVideoRenderer;
          const t = (p.title && (p.title.runs ? p.title.runs.map(x => x.text).join('') : p.title.simpleText)) || '';
          if (t && !/^(private|deleted) video$/i.test(t) && !/^v[ií]deo (privado|exclu[ií]do)/i.test(t) && !vids.some(v => v.id === p.videoId))
            vids.push({ id: p.videoId, titulo: t, dur: (p.lengthText && p.lengthText.simpleText) || '' });
          return;
        }
        Object.values(o).forEach(ande);
      }
    })(JSON.parse(m[1]));
    if (!vids.length) return resp(404, { erro: 'Nenhum vídeo encontrado. Confira se a playlist é pública e se o link está completo.' });
    return resp(200, { videos: vids });
  } catch (e) { return resp(500, { erro: String(e.message || e) }); }
};
