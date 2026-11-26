/* Aba "🎥 Mentorias" na ADMINISTRAÇÃO DA ÁREA DE MEMBROS: cada mentoria (particular, casal ou turma) tem uma SALA FIXA
   com foto, dias e horário, os alunos (por e-mail) e o link que o aluno usa.
   · Usa o mesmo login (admin) da área de membros (window._sb, projeto "metodo-inteligente").
   · A sala de vídeo é a do site da Central (SITE/sala.html); aqui só se cadastra e se abre.
   · O aluno vê a mentoria dele na home (membros-mentorias.js).
   · Tabela: supabase/mentorias-salas.sql. O link do aluno é gerado na 1ª vez, pedindo a senha do professor da sala. */
(() => {
  const sbf = () => window._sb;   // o mesmo login (admin) da área de membros
  const SITE = 'https://gedielcentral.netlify.app';
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const D3 = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'], ORD = [1, 2, 3, 4, 5, 6, 0];
  const TIPOS = { particular: 'Particular', casal: 'Casal', turma: 'Turma' };
  const slug = t => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  const emailsDe = txt => [...new Set(String(txt || '').toLowerCase().split(/[\s,;]+/).filter(e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)))];
  let linhas = [], compras = [], senha = '', ed = null, foto = '', carregado = false;
  const central = () => { try { if (window.EBG_MENTORIA && window.EBG_MENTORIA.recarregar) window.EBG_MENTORIA.recarregar(); } catch (e) {} };
  const tokenAdmin = async () => { try { const r = await sbf().auth.getSession(); return (r.data && r.data.session && r.data.session.access_token) || ''; } catch (e) { return ''; } };

  const css = document.createElement('style');
  css.textContent = `
  .mn-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:14px;margin:16px 0}
  .mn-card{display:flex;gap:14px;background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px}
  .mn-card.off{opacity:.55}
  .mn-av{width:64px;height:64px;flex:none;border-radius:50%;background:var(--surface2) center/cover;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.15rem;color:var(--fg2)}
  .mn-main{min-width:0;flex:1;display:grid;gap:5px;align-content:start}
  .mn-top{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.mn-top b{font-size:1rem}
  .mn-tag{font-size:.7rem;font-weight:600;padding:2px 8px;border-radius:99px;background:var(--surface2)}
  .mn-hoje{font-size:.7rem;font-weight:700;padding:2px 8px;border-radius:99px;background:#34d399;color:#052e1b}
  .mn-quando{font-size:.88rem}.mn-al{font-size:.78rem;color:var(--fg2);overflow-wrap:anywhere}
  .mn-btns{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
  .mn-vazio{padding:28px;text-align:center;color:var(--fg2);border:1px dashed var(--border);border-radius:14px}
  dialog#mnDlg{border:1px solid var(--border);border-radius:14px;background:var(--surface);color:inherit;padding:0;width:min(560px,94vw);max-height:92vh}
  dialog#mnDlg::backdrop{background:rgba(0,0,0,.55)}
  #mnDlg form{display:grid;gap:12px;padding:20px;max-height:92vh;overflow:auto}
  #mnDlg h3{margin:0;font-size:1.15rem;font-weight:800}
  #mnDlg label{display:grid;gap:5px;font-size:.82rem;color:var(--fg2)}
  #mnDlg input[type=text],#mnDlg input[type=time],#mnDlg select,#mnDlg textarea{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:9px 10px;color:inherit;font:inherit;font-size:.9rem}
  #mnDlg textarea{min-height:84px;resize:vertical}
  #mnDlg input[type=checkbox]{width:16px;height:16px;min-width:0;padding:0;margin:0;flex:none}
  .mn-dias{display:flex;gap:6px;flex-wrap:wrap}
  #mnDlg .mn-dias label{display:flex;flex-direction:row;align-items:center;gap:6px;background:var(--surface2);border:1px solid var(--border);border-radius:99px;padding:6px 12px;cursor:pointer;color:inherit}
  #mnDlg label.mn-check{display:flex;flex-direction:row;align-items:center;gap:8px;color:inherit;font-size:.88rem}
  .mn-foto{display:flex;gap:12px;align-items:center}
  .mn-rodape{display:flex;gap:8px;justify-content:space-between;flex-wrap:wrap;margin-top:4px}`;
  document.head.appendChild(css);

  const dlg = document.createElement('dialog');
  dlg.id = 'mnDlg';
  dlg.innerHTML = `<form method="dialog" id="mnForm">
    <h3 id="mnTit">Nova mentoria</h3>
    <label>Nome da mentoria<input type="text" id="mnNome" maxlength="120" placeholder="ex.: Camila, Evelyn & Rhian ou Turma Gabriel"></label>
    <label>Tipo<select id="mnTipo"><option value="particular">Particular (1 aluno)</option><option value="casal">Casal</option><option value="turma">Turma</option></select></label>
    <div><div style="font-size:.82rem;color:var(--fg2);margin-bottom:6px">Dias fixos da semana</div><div class="mn-dias" id="mnDias"></div></div>
    <label>Horário fixo<input type="time" id="mnHora"></label>
    <label>E-mails dos alunos (um por linha). Só eles veem esta sala no app.<textarea id="mnEmails" placeholder="aluno@email.com"></textarea></label>
    <label>Adicionar quem já comprou<select id="mnCompra"><option value="">— escolher e-mail —</option></select></label>
    <div class="mn-foto"><span class="mn-av" id="mnPrev"></span><label style="flex:1">Foto<input type="file" id="mnFoto" accept="image/*"></label></div>
    <label>Nome da sala no endereço (não mude depois de mandar o link)<input type="text" id="mnSala" maxlength="40"></label>
    <label class="mn-check"><input type="checkbox" id="mnAtivo" checked> Mentoria ativa (aparece para os alunos)</label>
    <p class="erro" id="mnErro"></p>
    <div class="mn-rodape"><button class="admin-btn admin-btn-ghost" type="button" id="mnCancela">Cancelar</button><button class="admin-btn admin-btn-primary" type="submit" id="mnSalva">Salvar</button></div>
  </form>`;
  document.body.appendChild(dlg);
  $('#mnDias').innerHTML = ORD.map(d => `<label><input type="checkbox" value="${d}"> ${D3[d]}</label>`).join('');

  const aviso = t => { const e = $('#mnAviso'); if (e) e.textContent = t || ''; };
  const linkAluno = m => `${SITE}/sala.html?sala=${encodeURIComponent(m.sala)}&k=${encodeURIComponent(m.k)}`;

  async function carregar() {
    $('#mnLista').innerHTML = '<p class="sub">Carregando…</p>'; aviso('');
    const r = await sbf().from('mi_mentorias').select('*').order('nome');
    if (r.error) { $('#mnLista').innerHTML = ''; aviso('Não consegui ler as mentorias: ' + r.error.message + ' (rodou o supabase/mentorias-salas.sql?)'); return; }
    linhas = r.data || []; carregado = true; desenhar();
    const c = await sbf().from('compras').select('email,produto').order('created_at', { ascending: false }).limit(3000);
    compras = c.error ? [] : (c.data || []);
  }

  function desenhar() {
    const el = $('#mnLista');
    if (!linhas.length) { el.innerHTML = '<div class="mn-vazio">Nenhuma mentoria ainda. Toque em <b>+ Nova mentoria</b> para criar a primeira sala fixa.</div>'; return; }
    const hoje = new Date().getDay();
    el.innerHTML = linhas.map(m => {
      const dias = ORD.filter(d => (m.dias || []).includes(d)).map(d => D3[d]).join(' · ');
      const av = m.foto ? `<span class="mn-av" style="background-image:url(${esc(m.foto)})"></span>` : `<span class="mn-av">${esc((m.nome || '?').trim().slice(0, 2).toUpperCase())}</span>`;
      const al = (m.emails || []).length ? m.emails.join(', ') : 'nenhum aluno ainda';
      return `<div class="mn-card${m.ativo ? '' : ' off'}">${av}<div class="mn-main">
        <div class="mn-top"><b>${esc(m.nome)}</b><span class="mn-tag">${TIPOS[m.tipo] || m.tipo}</span>${(m.dias || []).includes(hoje) ? '<span class="mn-hoje">hoje</span>' : ''}${m.ativo ? '' : '<span class="mn-tag">pausada</span>'}</div>
        <div class="mn-quando">${esc(dias || 'sem dias definidos')}${m.hora ? ' · ' + esc(m.hora) : ''}</div>
        <div class="mn-al">${esc(al)}</div>
        <div class="mn-btns"><button class="admin-btn admin-btn-ghost admin-btn-sm" type="button" data-mn="entrar" data-id="${m.id}">▶ Entrar</button><button class="admin-btn admin-btn-ghost admin-btn-sm" type="button" data-mn="link" data-id="${m.id}">🔗 Link do aluno</button><button class="admin-btn admin-btn-ghost admin-btn-sm" type="button" data-mn="editar" data-id="${m.id}">Editar</button><button class="admin-btn admin-btn-ghost admin-btn-sm" type="button" data-mn="status" data-id="${m.id}">${m.ativo ? '⏸ Pausar' : '▶ Reativar'}</button><button class="admin-btn admin-btn-ghost admin-btn-sm" type="button" data-mn="apagar" data-id="${m.id}">Remover</button></div>
      </div></div>`;
    }).join('');
  }

  function form(m) {
    ed = m || null; foto = (m && m.foto) || '';
    $('#mnTit').textContent = m ? 'Editar mentoria' : 'Nova mentoria';
    $('#mnNome').value = m ? m.nome : ''; $('#mnTipo').value = m ? m.tipo : 'particular';
    $('#mnHora').value = (m && m.hora) || ''; $('#mnEmails').value = m ? (m.emails || []).join('\n') : '';
    $('#mnSala').value = m ? m.sala : ''; $('#mnAtivo').checked = m ? !!m.ativo : true;
    $$dias().forEach(i => { i.checked = !!(m && (m.dias || []).includes(+i.value)); });
    $('#mnPrev').style.backgroundImage = foto ? `url(${foto})` : ''; $('#mnPrev').textContent = foto ? '' : '📷';
    $('#mnErro').textContent = ''; $('#mnFoto').value = '';
    const vistos = new Set(), op = [];
    compras.forEach(c => { const e = String(c.email || '').toLowerCase(); if (e && !vistos.has(e)) { vistos.add(e); op.push(`<option value="${esc(e)}">${esc(e)}${c.produto ? ' · ' + esc(c.produto) : ''}</option>`); } });
    $('#mnCompra').innerHTML = '<option value="">— escolher e-mail —</option>' + op.join('');
    dlg.showModal();
  }
  const $$dias = () => [...document.querySelectorAll('#mnDias input')];

  $('#mnCompra').addEventListener('change', e => {
    const v = e.target.value; if (!v) return;
    const lista = emailsDe($('#mnEmails').value); if (!lista.includes(v)) lista.push(v);
    $('#mnEmails').value = lista.join('\n'); e.target.value = '';
  });
  $('#mnNome').addEventListener('input', () => { if (!ed && !$('#mnSala').dataset.manual) $('#mnSala').value = slug($('#mnNome').value); });
  $('#mnSala').addEventListener('input', e => { e.target.dataset.manual = '1'; });
  $('#mnCancela').addEventListener('click', () => dlg.close());
  $('#mnFoto').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { const im = new Image(); im.onload = () => {
      const T = 256, lado = Math.min(im.width, im.height), c = document.createElement('canvas'); c.width = c.height = T;
      c.getContext('2d').drawImage(im, (im.width - lado) / 2, (im.height - lado) / 2, lado, lado, 0, 0, T, T);
      foto = c.toDataURL('image/jpeg', 0.82); $('#mnPrev').style.backgroundImage = `url(${foto})`; $('#mnPrev').textContent = '';
    }; im.src = rd.result; };
    rd.readAsDataURL(f);
  });

  $('#mnForm').addEventListener('submit', async ev => {
    ev.preventDefault();
    const nome = $('#mnNome').value.trim(), sala = slug($('#mnSala').value || nome);
    if (!nome) { $('#mnErro').textContent = 'Escreva o nome da mentoria.'; return; }
    const linha = { nome, tipo: $('#mnTipo').value, emails: emailsDe($('#mnEmails').value), dias: $$dias().filter(i => i.checked).map(i => +i.value), hora: $('#mnHora').value || null, foto: foto || null, sala, ativo: $('#mnAtivo').checked };
    if (ed && ed.sala !== sala) linha.k = null;      // endereço novo = link novo
    $('#mnSalva').disabled = true;
    const r = ed ? await sbf().from('mi_mentorias').update(linha).eq('id', ed.id) : await sbf().from('mi_mentorias').insert(linha);
    $('#mnSalva').disabled = false;
    if (r.error) { $('#mnErro').textContent = /duplicate|unique/i.test(r.error.message) ? 'Já existe uma sala com esse nome no endereço. Mude o nome da sala.' : 'Não salvou: ' + r.error.message; return; }
    dlg.close(); carregar(); central();
  });

  async function linkDe(m) {
    if (m.k) return linkAluno(m);
    let k = '';
    const tok = await tokenAdmin();                       // já está logado como admin: não precisa de senha
    if (tok) { try { const r = await fetch(`${SITE}/api/sala?action=link&sala=${encodeURIComponent(m.sala)}`, { headers: { Authorization: 'Bearer ' + tok } }); const d = await r.json(); if (r.ok && d.k) k = d.k; } catch (e) {} }
    if (!k) {                                            // plano B: senha do professor da sala
      if (!senha) senha = prompt('Não consegui pelo seu login. Digite a senha do professor da sala (só pedimos uma vez):') || '';
      if (!senha) return '';
      try {
        const r = await fetch(`${SITE}/api/sala?action=link&sala=${encodeURIComponent(m.sala)}&senha=${encodeURIComponent(senha)}`);
        const d = await r.json();
        if (!r.ok) { senha = ''; throw new Error(d.erro || 'erro ' + r.status); }
        k = d.k;
      } catch (e) { aviso('Não consegui gerar o link: ' + e.message); return ''; }
    }
    const u = await sbf().from('mi_mentorias').update({ k }).eq('id', m.id);
    if (u.error) { aviso('Não consegui guardar o link: ' + u.error.message); return ''; }
    m.k = k; return linkAluno(m);
  }

  document.addEventListener('click', async ev => {
    const b = ev.target.closest('[data-mn]'); if (!b) return;
    const m = linhas.find(x => x.id === b.dataset.id); if (!m) return;
    const a = b.dataset.mn;
    if (a === 'editar') form(m);
    else if (a === 'entrar') { const t = await tokenAdmin(); window.open(`${SITE}/sala.html?sala=${encodeURIComponent(m.sala)}&prof${t ? '#t=' + t : ''}`, '_blank', 'noopener'); }
    else if (a === 'status') { const r = await sbf().from('mi_mentorias').update({ ativo: !m.ativo }).eq('id', m.id); if (r.error) aviso('Não salvou: ' + r.error.message); else { carregar(); central(); } }
    else if (a === 'link') {
      const u = await linkDe(m); if (!u) return;
      try { await navigator.clipboard.writeText(u); aviso('✅ Link do aluno copiado: ' + u); } catch (e) { prompt('Copie o link do aluno:', u); }
    } else if (a === 'apagar') {
      if (confirm('Remover a mentoria "' + m.nome + '"? Os alunos deixam de ver esta sala.')) {
        const r = await sbf().from('mi_mentorias').delete().eq('id', m.id);
        if (r.error) aviso('Não removeu: ' + r.error.message); else { carregar(); central(); }
      }
    }
  });
  /* ---------- importar da Central (texto copiado pelo botão 📋 da Central) ---------- */
  const css2 = document.createElement('style');
  css2.textContent = `dialog#mnImp{border:1px solid var(--border);border-radius:14px;background:var(--surface);color:inherit;padding:0;width:min(600px,94vw);max-height:92vh}
  dialog#mnImp::backdrop{background:rgba(0,0,0,.55)}
  #mnImp textarea{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:9px 10px;color:inherit;font:inherit;font-size:.85rem;resize:vertical;min-height:90px;width:100%}
  #mnImpLista label{display:flex;align-items:center;gap:8px;padding:7px 4px;border-top:1px solid var(--border);font-size:.86rem;cursor:pointer}
  #mnImpLista label.ja{opacity:.5;cursor:default}#mnImpLista input{width:16px;height:16px;flex:none}`;
  document.head.appendChild(css2);
  const imp = document.createElement('dialog');
  imp.id = 'mnImp';
  imp.innerHTML = `<div style="display:grid;gap:12px;padding:20px;max-height:92vh;overflow:auto">
    <div style="font-size:1.1rem;font-weight:800">⬇ Importar mentorados da Central</div>
    <div style="font-size:.82rem;color:var(--fg2);line-height:1.6">Na <b>Central</b> (Mentorias) clique em <b>📋 Copiar mentorados p/ área de membros</b>, volte aqui e cole o texto abaixo.</div>
    <textarea id="mnImpTxt" placeholder="Cole aqui o texto copiado da Central"></textarea>
    <button class="admin-btn admin-btn-ghost" type="button" id="mnImpLer">Ler a lista</button>
    <div id="mnImpLista"></div>
    <p id="mnImpErro" style="color:#f87171;font-size:12px;margin:0"></p>
    <div class="mn-rodape"><button class="admin-btn admin-btn-ghost" type="button" id="mnImpCancela">Cancelar</button><button class="admin-btn admin-btn-primary" type="button" id="mnImpOk" disabled>Importar</button></div></div>`;
  document.body.appendChild(imp);
  let impItens = [];
  function lerLista() {
    const err = $('#mnImpErro'); err.textContent = ''; impItens = []; $('#mnImpLista').innerHTML = ''; $('#mnImpOk').disabled = true;
    let j; try { j = JSON.parse($('#mnImpTxt').value.trim()); } catch (e) { err.textContent = 'Esse texto não parece ser da Central. Copie de novo pelo botão 📋.'; return; }
    if (!j || !Array.isArray(j.itens) || !j.itens.length) { err.textContent = 'A lista veio vazia.'; return; }
    const existentes = new Set(linhas.map(x => x.sala)), usados = new Set(existentes);
    j.itens.slice(0, 200).forEach(i => {
      const nome = String((i && i.nome) || '').trim().slice(0, 120); if (!nome) return;
      const tipo = ['particular', 'casal', 'turma'].includes(i.tipo) ? i.tipo : 'particular';
      let sala = slug(i.sala || nome) || 'sala'; const ja = existentes.has(sala);
      if (!ja) { let n = 2, base = sala; while (usados.has(sala)) sala = (base + '-' + n++).slice(0, 40); usados.add(sala); }
      impItens.push({ nome, tipo, sala, ja, ativo: i.ativo !== false, dias: (Array.isArray(i.dias) ? i.dias : []).map(Number).filter(d => d >= 0 && d <= 6), hora: /^[0-2]\d:[0-5]\d$/.test(i.hora || '') ? i.hora : null, foto: (typeof i.foto === 'string' && /^data:image\//.test(i.foto) && i.foto.length <= 120000) ? i.foto : null });
    });
    $('#mnImpLista').innerHTML = impItens.map((i, k) => `<label class="${i.ja ? 'ja' : ''}"><input type="checkbox" data-i="${k}" ${i.ja ? 'disabled' : 'checked'}> <span><b>${esc(i.nome)}</b> · ${TIPOS[i.tipo]}${i.ativo ? '' : ' · inativo'}${i.ja ? ' · <em>já existe aqui</em>' : ''}</span></label>`).join('');
    $('#mnImpOk').disabled = !impItens.some(i => !i.ja);
    if (!impItens.length) err.textContent = 'Não encontrei mentorados nessa lista.';
  }
  $('#mnImpLer').addEventListener('click', lerLista);
  $('#mnImpCancela').addEventListener('click', () => imp.close());
  $('#mnImpOk').addEventListener('click', async () => {
    const sel = [...imp.querySelectorAll('#mnImpLista input:checked')].map(i => impItens[+i.dataset.i]);
    if (!sel.length) return;
    $('#mnImpOk').disabled = true;
    const r = await sbf().from('mi_mentorias').insert(sel.map(i => ({ nome: i.nome, tipo: i.tipo, emails: [], dias: i.dias, hora: i.hora, foto: i.foto, sala: i.sala, ativo: i.ativo })));
    if (r.error) { $('#mnImpErro').textContent = 'Não importou: ' + r.error.message; $('#mnImpOk').disabled = false; return; }
    imp.close(); await carregar(); central();
    const msg = '✅ ' + sel.length + ' mentorados importados. Agora toque em Editar em cada um e coloque o e-mail do aluno (é assim que ele vê a sala dele).';
    aviso(msg); if (window.toast) toast(msg, '#10b981');
  });
  window.EBG_MENTORIAS_FORM = {
    novo: async () => { if (!carregado) await carregar(); form(null); },
    editar: async id => { if (!carregado) await carregar(); let m = linhas.find(x => x.id === id); if (!m) { const r = await sbf().from('mi_mentorias').select('*').eq('id', id).maybeSingle(); m = r.data; } if (m) form(m); },
    importar: async () => { if (!carregado) await carregar(); $('#mnImpTxt').value = ''; $('#mnImpLista').innerHTML = ''; $('#mnImpErro').textContent = ''; $('#mnImpOk').disabled = true; imp.showModal(); }
  };

  /* ---------- a aba "Mentorias" na administração (mesmo jeito das outras abas) ---------- */
  function montarAba() {
    const tabs = document.querySelector('.admin-tabs'), ref = document.getElementById('adm-modulos');
    if (!tabs || !ref || document.getElementById('adm-mentorias') || typeof window.adminTab !== 'function') return false;
    const b = document.createElement('button');
    b.className = 'admin-tab'; b.textContent = '🎥 Mentorias'; b.setAttribute('onclick', "adminTab('mentorias',this)"); tabs.appendChild(b);
    const p = document.createElement('div');
    p.className = 'admin-panel'; p.id = 'adm-mentorias';
    p.innerHTML = `<div class="admin-form">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px"><div class="admin-form-title" style="margin:0">🎥 Mentorias · salas fixas</div>
        <div style="display:flex;gap:8px"><button class="admin-btn admin-btn-primary" type="button" id="mnNova">+ Nova mentoria</button><button class="admin-btn admin-btn-ghost" type="button" id="mnRecarregar">Atualizar</button></div></div>
      <div style="font-size:12px;color:var(--fg2);line-height:1.7">Cada mentoria (particular, casal ou turma) tem uma sala fixa na nossa sala de vídeo, com foto, dias e horário. Cadastre o e-mail dos alunos: eles veem a mentoria deles aqui na home, com o botão de entrar. <b>🔗 Link do aluno</b> gera o link para mandar por fora; <b>▶ Entrar</b> abre a sala como professor.</div>
      <p class="erro" id="mnAviso" style="color:#f87171;font-size:12px;margin:8px 0 0"></p></div>
      <div class="mn-grid" id="mnLista"></div>`;
    ref.insertAdjacentElement('afterend', p);
    $('#mnNova').addEventListener('click', () => form(null));
    $('#mnRecarregar').addEventListener('click', carregar);
    const tabAnt = window.adminTab;
    window.adminTab = function (tab, btn) { const r = tabAnt.apply(this, arguments); if (tab === 'mentorias') carregar(); return r; };
    return true;
  }
  if (!montarAba()) { const t = setInterval(() => { if (montarAba()) clearInterval(t); }, 600); setTimeout(() => clearInterval(t), 60000); }

  window.EBG_MENTORIAS = { abrir: carregar };
})();
