// Tutor IA da área de membros — responde dúvidas de inglês e da plataforma.
// Precisa de 2 variáveis no Netlify (Site settings → Environment variables):
//   ANTHROPIC_API_KEY   → chave da API da Anthropic (console.anthropic.com)
//   MEMBROS_SERVICE_KEY → já existe (usada pra validar que quem pergunta é aluno logado)
const URL_MEMBROS = process.env.MEMBROS_URL || 'https://jzdxcefnlwjgimymgsux.supabase.co';
const resp = (s, o) => ({ statusCode: s, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(o) });

const SISTEMA = `Você é o Tutor IA da Plataforma Inteligente, a área de membros do Método Inteligente do professor Gediel Vargas (professor de inglês brasileiro, método baseado em Inteligências Múltiplas, rotina diária personalizada e prática em contexto real).

Seu papel:
- Tirar dúvidas de inglês (gramática, vocabulário, pronúncia, tradução) de forma curta, clara e com exemplos práticos.
- Ajudar a usar a plataforma: Módulos (aulas em vídeo liberadas 2x/semana, com quiz e comentários), Maratona de Hoje (tarefas diárias por contexto: casa, transporte, trabalho, academia), Bússola CEFR (teste de nível), Prisma de Talentos (perfil de inteligências), Lives, Jogos e Materiais.
- Incentivar constância: 20 minutos por dia valem mais que 3 horas no domingo.

Regras:
- Responda em português brasileiro informal e direto, como um professor parceiro. Exemplos em inglês sempre com tradução.
- Respostas curtas (até ~150 palavras). Sem listas enormes.
- Dúvida administrativa (pagamento, senha, reembolso): oriente a falar com o professor Gediel pelos canais oficiais.
- Nunca invente conteúdo que não existe na plataforma; se não souber, diga que vai verificar com o professor.`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return resp(405, { erro: 'use POST' });
  const API = process.env.ANTHROPIC_API_KEY;
  if (!API) return resp(503, { erro: 'Tutor IA ainda não configurado. (Falta ANTHROPIC_API_KEY no Netlify.)' });

  // só aluno logado usa
  const KEY = process.env.MEMBROS_SERVICE_KEY;
  const token = (event.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!KEY || !token) return resp(401, { erro: 'Entre na área de membros primeiro.' });
  const u = await fetch(`${URL_MEMBROS}/auth/v1/user`, { headers: { apikey: KEY, Authorization: `Bearer ${token}` } });
  if (!u.ok) return resp(401, { erro: 'Sessão expirada. Entre de novo.' });

  let p; try { p = JSON.parse(event.body || '{}'); } catch (e) { return resp(400, { erro: 'pedido inválido' }); }
  const nivel = String(p.nivel || '').slice(0, 4);
  const hist = Array.isArray(p.messages) ? p.messages.slice(-12) : [];
  const messages = hist
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));
  if (!messages.length || messages[messages.length - 1].role !== 'user') return resp(400, { erro: 'mensagem vazia' });

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': API, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5',
      max_tokens: 600,
      system: SISTEMA + (nivel ? `\n\nNível CEFR atual deste aluno: ${nivel}. Adapte os exemplos a esse nível.` : ''),
      messages
    })
  });
  if (!r.ok) {
    const t = await r.text();
    console.log('anthropic err', r.status, t.slice(0, 300));
    return resp(502, { erro: 'O tutor está indisponível agora. Tenta de novo em instantes.' });
  }
  const data = await r.json();
  const texto = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n').trim();
  return resp(200, { texto: texto || '...' });
};
