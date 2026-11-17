/* Aba "Maratonas" do painel: todas as inscrições das maratonas (Hub e área de membros),
   separadas por maratona, temperatura, fase do comercial, nível, objetivo, país e turno.
   Cada linha tem WhatsApp com mensagem pronta, fase (novo → matriculado) e nota. Baixa planilha.
   Precisa do supabase/maratonas.sql rodado no projeto do Hub. */
(() => {
  const A = window.EBG_ADMIN, MR = window.EBG_MARATONAS;
  if (!A || !MR) return;
  const { sb } = A;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const data = d => (d ? new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '');
  const tel = t => { let n = String(t || '').replace(/\D/g, ''); if (!n) return ''; if (n.length <= 11) n = '55' + n; return n; };
  const FASES = { novo: 'Novo', chamado: 'Chamei', conversando: 'Conversando', matriculado: 'Matriculado', nao_agora: 'Não agora', perdido: 'Perdido' };
  const TEMP = { quente: '🔥 Quente', morno: '🌤️ Morno', frio: '❄️ Frio' };
  const nomeM = id => { const m = MR.porId(id); return m ? `${m.nome} · ${m.edicao}` : id; };
  let linhas = [], fMaratona = '';

  // estilos próprios da aba (o resto vem do admin.css)
  const css = document.createElement('style');
  css.textContent = `
  .mr-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px;margin:14px 0}
  .mr-card{text-align:left;background:var(--surface);border:1px solid var(--linha);border-radius:var(--raio);padding:14px;cursor:pointer;display:grid;gap:4px}
  .mr-card[aria-pressed="true"]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
  .mr-card b{font-size:.95rem}.mr-card small{color:var(--muted);font-size:.78rem}
  .mr-card strong{font:400 2rem/1 var(--serif);margin-top:4px}
  .mr-st{display:inline-block;font-size:.7rem;font-weight:600;padding:2px 8px;border-radius:99px;background:var(--surface-3);width:max-content}
  .mr-st.abertas{background:rgba(34,197,94,.16);color:#4ade80}.mr-st.andamento{background:rgba(214,150,90,.18);color:#e9b98a}
  .mr-temp{white-space:nowrap;font-size:.8rem}
  .mr-fase,.mr-nota{background:var(--surface-2);border:1px solid var(--linha);border-radius:8px;padding:6px 8px;color:inherit;font:inherit;font-size:.82rem}
  .mr-nota{width:100%;min-width:140px}
  tr.f-matriculado td{background:rgba(34,197,94,.06)} tr.f-perdido td,tr.f-nao_agora td{opacity:.6}
  .mr-resp{font-size:.78rem;color:var(--muted)}`;
  document.head.appendChild(css);

  async function carregar() {
    $('#mrLista').innerHTML = '<p class="sub">Carregando…</p>'; $('#mrAviso').textContent = '';
    const out = [];
    for (let de = 0; de < 20000; de += 1000) {
      const { data: d, error } = await sb.from('maratonas_inscricoes').select('*').order('created_at', { ascending: false }).range(de, de + 999);
      if (error) {
        $('#mrAviso').textContent = /does not exist|schema cache/i.test(error.message) ? 'Falta criar a tabela: rode supabase/maratonas.sql no SQL Editor do Supabase do Hub.' : 'Erro: ' + error.message;
        $('#mrLista').innerHTML = ''; break;
      }
      out.push(...d); if (d.length < 1000) break;
    }
    linhas = out;
    montarFiltros(); desenhar();
  }

  function montarFiltros() {
    const opc = (sel, vals, rot) => { const el = $(sel), v = el.value; el.innerHTML = `<option value="">${rot}</option>` + vals.map(x => `<option value="${esc(x[0])}">${esc(x[1])}</option>`).join(''); el.value = v; };
    opc('#mrfNivel', MR.comuns.nivel.map(x => [x, x]), 'Nível: todos');
    opc('#mrfObjetivo', MR.comuns.objetivo.map(x => [x, x]), 'Objetivo: todos');
    opc('#mrfTurno', MR.comuns.turno.map(x => [x, x]), 'Turno: todos');
    opc('#mrfConheceu', MR.comuns.origem.map(x => [x, x]), 'Conheceu por: todos');
  }

  function filtradas() {
    const b = $('#mrfBusca').value.trim().toLowerCase(), t = $('#mrfTemp').value, f = $('#mrfFase').value, n = $('#mrfNivel').value,
      o = $('#mrfObjetivo').value, tu = $('#mrfTurno').value, p = $('#mrfPais').value, c = $('#mrfConheceu').value, v = $('#mrfVeio').value, dias = +$('#mrfPeriodo').value;
    const desde = dias ? Date.now() - dias * 864e5 : 0;
    return linhas.filter(r => (!fMaratona || r.maratona === fMaratona) && (!t || r.temperatura === t) && (!f || r.fase === f) && (!n || r.nivel === n)
      && (!o || (r.objetivo || '').includes(o)) && (!tu || (r.turno || '').includes(tu)) && (!c || r.conheceu === c) && (!v || r.veio_de === v)
      && (!p || (p === 'br' ? /^bra[sz]il$/i.test((r.pais || 'Brasil').trim()) : !/^bra[sz]il$/i.test((r.pais || 'Brasil').trim())))
      && (!desde || new Date(r.created_at) >= desde)
      && (!b || [r.nome, r.whatsapp, r.email, r.instagram, r.cidade, r.pais, r.objetivo, r.mensagem, r.nota, JSON.stringify(r.respostas || {})].join(' ').toLowerCase().includes(b)));
  }

  function desenhar() {
    // um cartão por maratona (toque filtra)
    $('#mrPorMaratona').innerHTML = MR.lista.map(m => {
      const st = MR.status(m), doM = linhas.filter(r => r.maratona === m.id), q = doM.filter(r => r.temperatura === 'quente').length, mat = doM.filter(r => r.fase === 'matriculado').length;
      return `<button type="button" class="mr-card" data-mr-m="${esc(m.id)}" aria-pressed="${fMaratona === m.id}"><span class="mr-st ${st}">${esc(MR.rotulo[st])}</span><b>${esc(m.icone)} ${esc(m.nome)}</b><small>${esc(m.edicao)} · ${esc(m.quando)}</small>
        <strong>${doM.length}</strong><small>inscritos · ${q} quentes · ${mat} matriculados</small></button>`;
    }).join('');
    const f = filtradas(), conta = k => f.filter(r => r.fase === k).length;
    $('#mrResumo').innerHTML = [[f.length, 'inscrições'], [f.filter(r => r.temperatura === 'quente').length, '🔥 quentes'], [conta('novo'), 'ainda não chamei'],
      [conta('conversando'), 'conversando'], [conta('matriculado'), 'matriculados'], [f.filter(r => r.ja_aluno).length, 'já são alunos']]
      .map(([n, r]) => `<div class="kpi"><span>${r}</span><strong>${n}</strong></div>`).join('');
    $('#mrLista').innerHTML = f.length ? `<div class="tabela-wrap"><table class="tabela"><thead><tr><th>Pessoa</th><th>Contato</th><th>Maratona</th><th>Perfil</th><th>Temperatura</th><th>Fase</th><th>Nota</th><th>Quando</th></tr></thead><tbody>${f.map(r => {
      const w = tel(r.whatsapp), m = MR.porId(r.maratona) || { nome: r.maratona, edicao: '' };
      const msg = `Oi ${String(r.nome || '').split(' ')[0]}! Aqui é o Gediel. Vi a sua inscrição na maratona ${m.nome}${m.edicao ? ' (' + m.edicao + ')' : ''} e quero te contar como vai funcionar. Posso te mandar os detalhes?`;
      const resp = Object.entries(r.respostas || {}).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(' · ');
      return `<tr class="f-${esc(r.fase)}" data-mr-id="${esc(r.id)}">
        <td><b>${esc(r.nome)}</b>${r.ja_aluno ? ' <span class="hub-tag">aluno</span>' : ''}<small style="display:block">${esc([r.cidade, r.pais].filter(Boolean).join(' · '))}</small></td>
        <td>${w ? `<a class="link" target="_blank" rel="noopener" href="https://wa.me/${w}?text=${encodeURIComponent(msg)}" data-mr-zap="${esc(r.id)}">WhatsApp ${esc(w)}</a>` : ''}${r.email ? `<small style="display:block"><a class="link" href="mailto:${esc(r.email)}">${esc(r.email)}</a></small>` : ''}${r.instagram ? `<small style="display:block"><a class="link" target="_blank" rel="noopener" href="https://instagram.com/${esc(r.instagram)}">@${esc(r.instagram)}</a></small>` : ''}</td>
        <td>${esc(m.nome)}<small style="display:block">${esc(m.edicao)}</small></td>
        <td><span class="chip-int">${esc(r.nivel || 'nível ?')}</span> ${(r.objetivo || '').split(', ').filter(Boolean).map(x => `<span class="chip-int">${esc(x)}</span>`).join(' ')}
          <div class="mr-resp">${esc([resp, r.turno && 'turno: ' + r.turno, r.conheceu && 'conheceu: ' + r.conheceu].filter(Boolean).join(' · '))}</div>${r.mensagem ? `<div class="mr-resp">“${esc(r.mensagem)}”</div>` : ''}</td>
        <td class="mr-temp" title="${esc(r.momento)}">${TEMP[r.temperatura] || '—'}</td>
        <td><select class="mr-fase" data-mr-fase="${esc(r.id)}">${Object.entries(FASES).map(([k, v]) => `<option value="${k}"${r.fase === k ? ' selected' : ''}>${v}</option>`).join('')}</select>${r.chamado_em ? `<small style="display:block">chamei ${data(r.chamado_em).slice(0, 8)}</small>` : ''}</td>
        <td><input class="mr-nota" data-mr-nota="${esc(r.id)}" value="${esc(r.nota || '')}" maxlength="1000" placeholder="Anotação"></td>
        <td><small>${data(r.created_at)}</small><small style="display:block">${r.veio_de === 'membros' ? 'área de membros' : 'Hub'}</small></td></tr>`;
    }).join('')}</tbody></table></div>` : (linhas.length ? '<p class="vazio">Ninguém com esses filtros.</p>' : '<p class="vazio">Nenhuma inscrição ainda. O link pra divulgar é SEU-SITE/maratonas.html</p>');
  }

  async function salvar(id, campos) {
    const r = linhas.find(x => x.id === id); if (!r) return;
    const { error } = await sb.from('maratonas_inscricoes').update({ ...campos, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { A.aviso('Não salvou: ' + error.message); return; }
    Object.assign(r, campos); desenhar();
  }

  function baixar() {
    const f = filtradas(); if (!f.length) return;
    const cols = ['created_at', 'maratona', 'nome', 'whatsapp', 'email', 'instagram', 'cidade', 'pais', 'nivel', 'objetivo', 'turno', 'momento', 'temperatura', 'conheceu', 'respostas', 'mensagem', 'veio_de', 'ja_aluno', 'fase', 'chamado_em', 'nota', 'origem'];
    const cel = v => `"${String(v && typeof v === 'object' ? Object.entries(v).map(([k, x]) => k + ': ' + x).join(' | ') : v ?? '').replace(/"/g, '""')}"`;
    const csv = '﻿' + [cols.join(';'), ...f.map(l => cols.map(c => cel(c === 'maratona' ? nomeM(l[c]) : l[c])).join(';'))].join('\n');
    Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })), download: `maratonas-${fMaratona || 'todas'}-${new Date().toISOString().slice(0, 10)}.csv` }).click();
  }

  document.addEventListener('input', e => { if (e.target.closest && e.target.closest('#mrFiltros')) desenhar(); });
  document.addEventListener('change', e => {
    const fs = e.target.dataset && e.target.dataset.mrFase;
    if (fs) salvar(fs, { fase: e.target.value, ...(e.target.value !== 'novo' && !(linhas.find(x => x.id === fs) || {}).chamado_em ? { chamado_em: new Date().toISOString() } : {}) });
    const nt = e.target.dataset && e.target.dataset.mrNota;
    if (nt) salvar(nt, { nota: e.target.value.trim() || null });
  });
  document.addEventListener('click', e => {
    if (e.target.closest('#mrRecarregar')) carregar();
    if (e.target.closest('#mrBaixar')) baixar();
    const c = e.target.closest('[data-mr-m]'); if (c) { fMaratona = fMaratona === c.dataset.mrM ? '' : c.dataset.mrM; desenhar(); }
    const z = e.target.closest('[data-mr-zap]');
    if (z) { const r = linhas.find(x => x.id === z.dataset.mrZap); if (r && r.fase === 'novo') salvar(r.id, { fase: 'chamado', chamado_em: new Date().toISOString() }); }
  });

  window.EBG_MARATONAS_ADM = { abrir: () => { if (!linhas.length) carregar(); } };
})();
