// Captura (nome + WhatsApp) compartilhada fora do Hub: usada em central-prompts.html e jogos.html,
// quando alguém chega direto nelas (sem passar pelo index.html). Mesma trava, mesmo lugar: grava uma
// vez só no aparelho (chave 'ebg:lead', igual ao Hub) e na tabela hub_leads do Supabase, que já aparece
// junto dos outros contatos na aba "Pessoas" do painel. Não depende do resto do site: funciona sozinho.
// Precisa que config.js (window.EBG_CONFIG) já tenha sido carregado antes deste arquivo.
(function () {
  'use strict';
  function temLead() { try { return !!localStorage.getItem('ebg:lead'); } catch (e) { return false; } }
  function salvar(nome, whats, origem) {
    var lead = { id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)), nome: nome, whatsapp: whats, origem: origem, quando: new Date().toISOString() };
    try { localStorage.setItem('ebg:lead', JSON.stringify(lead)); } catch (e) {}
    var CFG = window.EBG_CONFIG || {};
    if (CFG.supabaseUrl && CFG.supabaseAnonKey) {
      fetch(CFG.supabaseUrl.replace(/\/$/, '') + '/rest/v1/hub_leads', {
        method: 'POST', keepalive: true,
        headers: { apikey: CFG.supabaseAnonKey, Authorization: 'Bearer ' + CFG.supabaseAnonKey, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify([{ nome: nome, whatsapp: whats, origem: String(origem || '').slice(0, 60), pagina: (location.pathname + location.search).slice(0, 300) }])
      }).catch(function () {});
    }
    return lead;
  }
  window.EBG_CAPTURA = {
    temLead: temLead,
    // mostra a folha de contato se ainda não tiver lead; chama continuar() depois (ou na hora, se já tiver)
    exigir: function (opts, continuar) {
      opts = opts || {}; continuar = continuar || function () {};
      if (temLead()) { continuar(); return; }
      var ov = document.createElement('div');
      ov.setAttribute('style', 'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:flex-end;justify-content:center;background:rgba(4,8,18,.72);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);font-family:Inter,system-ui,sans-serif');
      ov.innerHTML =
        '<div style="width:100%;max-width:440px;max-height:92vh;overflow:auto;background:#0f1d36;border:1px solid rgba(255,255,255,.14);border-radius:22px 22px 0 0;padding:20px;color:#fff;box-sizing:border-box">' +
        '<b style="display:block;font-size:21px;margin-bottom:8px;font-weight:700">' + esc(opts.titulo || 'Antes de continuar') + '</b>' +
        '<p style="font-size:14px;color:#c9d3e2;margin:0 0 16px;line-height:1.45">' + esc(opts.texto || 'Esse material é grátis. Me diz quem é você e eu libero agora.') + '</p>' +
        '<label style="display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#c9d3e2;margin-bottom:6px">Seu nome</label>' +
        '<input id="ebgCapNome" placeholder="Como posso te chamar?" maxlength="80" style="width:100%;min-height:48px;padding:0 14px;border-radius:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);color:#fff;font-size:16px;margin-bottom:12px;box-sizing:border-box;outline:0">' +
        '<label style="display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#c9d3e2;margin-bottom:6px">WhatsApp</label>' +
        '<input id="ebgCapWhats" placeholder="(55) 9 9999-9999" inputmode="tel" maxlength="24" style="width:100%;min-height:48px;padding:0 14px;border-radius:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.22);color:#fff;font-size:16px;margin-bottom:6px;box-sizing:border-box;outline:0">' +
        '<p id="ebgCapErro" style="color:#ff8d8d;font-size:12.5px;min-height:16px;margin:4px 0 10px"></p>' +
        '<button id="ebgCapBtn" type="button" style="width:100%;min-height:50px;border:0;border-radius:14px;background:#fff;color:#0a1426;font-weight:700;font-size:16px;cursor:pointer">' + esc(opts.botao || 'Liberar agora') + '</button>' +
        '<p style="font-size:11.5px;color:#8fa0bd;text-align:center;margin:10px 0 0">Só uma vez. Sem spam.</p>' +
        '</div>';
      document.documentElement.appendChild(ov);
      var semRolagem = document.body.style.overflow; document.body.style.overflow = 'hidden';
      var nomeEl = ov.querySelector('#ebgCapNome'), whatsEl = ov.querySelector('#ebgCapWhats'), erroEl = ov.querySelector('#ebgCapErro');
      function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
      function enviar() {
        var nome = nomeEl.value.trim(), dig = whatsEl.value.replace(/\D/g, '');
        if (nome.length < 2) { erroEl.textContent = 'Seu nome, por favor.'; nomeEl.focus(); return; }
        if (dig.length < 10) { erroEl.textContent = 'WhatsApp com DDD, por favor.'; whatsEl.focus(); return; }
        salvar(nome, dig, opts.origem || 'direto');
        ov.remove(); document.body.style.overflow = semRolagem;
        continuar();
      }
      ov.querySelector('#ebgCapBtn').addEventListener('click', enviar);
      whatsEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') enviar(); });
      setTimeout(function () { if (!matchMedia('(pointer:coarse)').matches) nomeEl.focus(); }, 60);
    }
  };
})();
