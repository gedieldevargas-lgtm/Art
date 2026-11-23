"""Aulas de LISTENING a partir do catálogo do elllo.org (livro/gerar/elllo-catalogo.json).
Regra combinada: vídeo pelo embed do YouTube, MP3 tocando pelo link do elllo (sem hospedar), transcrição NÃO copiada
(só o link da lição) e exercícios escritos pelo professor (elllo_conteudo.py).
Gera: livro/aulas/elllo-NNN.js  e  supabase/listening-elllo.sql (coloca cada lição no módulo certo)."""
import json, os, random, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from elllo_conteudo import T, G

AQUI = os.path.dirname(os.path.abspath(__file__))
PASTA = os.path.join(AQUI, '..', 'aulas')
D = json.load(open(os.path.join(AQUI, 'elllo-catalogo.json'), encoding='utf-8'))
def val(x): return '' if x in (None, 'None') else str(x).strip()

VOCAB_GR = {'Colors', 'Adjectives', 'Days of the Week', 'Languages, Nationalities and Countries', 'Months and Time Prepositions', 'Ordinals'}
VIAGEM = {'viagem', 'hotel', 'transporte', 'turismo', 'viver fora', 'mudança', 'cultura', 'cidades', 'geografia', 'alfândega', 'trânsito', 'choque cultural', 'migração'}
NEG = {'trabalho', 'empresas', 'finanças', 'economia', 'trabalho remoto', 'carreira militar', 'sonhos e carreira', 'dinheiro', 'família e dinheiro'}
def modulo(d):
    nivel, serie, tema, gram = val(d['CEFR']), val(d['Série']), val(d['Tema']), val(d['Gramática'])
    if serie == 'Grammar':
        if gram in VOCAB_GR: return 'Vocabulário Essencial'
        return 'Gramática A1' if nivel == 'A1' or gram.startswith('Present Continuous') else 'Gramática A2–B1'
    if tema == 'expressões idiomáticas': return 'Idioms & Expressões'
    if tema == 'música': return 'Inglês pela Música'
    if tema in ('filmes', 'aprender inglês') or 'TV' in val(d['Título']): return 'Inglês por Séries'
    if tema in NEG and nivel in ('B2', 'C1', 'C2'): return 'Business English'
    if nivel == 'A2': return 'Conversação A1–A2' if tema in VIAGEM else 'Vocabulário Essencial'
    if nivel == 'B1': return 'Conversação B1'
    return 'Listening & Compreensão'

def girar(p, ops, c, k):
    r = k % len(ops); n = ops[r:] + ops[:r]; return {'p': p, 'emoji': '', 'ops': n, 'c': n.index(ops[c])}

rnd = random.Random(7)
todas_trad = sorted(set(T.values()))
FALANTES = sorted({val(d['Falantes']) for d in D if val(d['Falantes'])})
SOTAQUES = sorted({val(d['Sotaques']) for d in D if val(d['Sotaques'])})
TEMAS = sorted({val(d['Tema']) for d in D if val(d['Tema'])})
def outros(lista, certo, n=2, k=0):
    r = random.Random(hash(certo) % 997 + k); op = [x for x in lista if x != certo]; r.shuffle(op); return op[:n]

sql = ["-- Aulas de LISTENING (catálogo elllo.org), cada uma no módulo do conteúdo certo.",
       "-- Vídeo: embed do YouTube. Áudio: MP3 tocando do elllo.org (não hospedado). Transcrição: só o link.",
       "-- Cole no SQL Editor do Supabase (projeto dos membros) e clique Run. Pode rodar mais de uma vez.", "do $blk$", "declare m uuid;", "begin"]
por_mod = {}
for i, d in enumerate(D, 1):
    uid = 'elllo-%03d' % i
    titulo, tema, gram, nivel = val(d['Título']), val(d['Tema']), val(d['Gramática']), val(d['CEFR'])
    if titulo.startswith('(sem título'): titulo = 'Tourism in Thailand'
    voc = [v.strip() for v in val(d['Vocabulário e expressões']).split(';') if v.strip()]
    mod = modulo(d)
    yt, emb, mp3, link = val(d['YouTube']), val(d['YouTube (embed)']), val(d['Áudio MP3']), val(d['Lição + transcrição (elllo)'])
    falantes, sotaques = val(d['Falantes']), val(d['Sotaques'])
    revisar, ex = [], []
    if gram in G:
        expl, exemplos, quiz = G[gram]
        revisar = [{'tipo': 'dica', 'texto': expl}, {'tipo': 'vocab', 'titulo': 'Exemplos', 'itens': [list(e) for e in exemplos]}]
        ex.append({'id': 'antes', 'tipo': 'escolha', 'titulo': 'Antes de ouvir: ' + gram, 'instrucao': 'Revise a regra e escolha a forma certa.',
                   'itens': [girar(q, o, c, k + i) for k, (q, o, c) in enumerate(quiz)]})
        ex.append({'id': 'montar', 'tipo': 'montar', 'titulo': 'Monte a frase', 'instrucao': 'Ouça e toque nas palavras na ordem certa.',
                   'itens': [{'ouvir': e[0], 'resp': e[0]} for e in exemplos]})
        falar = exemplos[0][0]
    else:
        itens = [[v, T.get(v, '')] for v in voc if T.get(v)]
        revisar = [{'tipo': 'vocab', 'titulo': 'Expressões que aparecem na conversa', 'itens': itens}]
        if itens:
            ex.append({'id': 'antes', 'tipo': 'escolha', 'titulo': 'Antes de ouvir: o que significa?', 'instrucao': 'Conheça as expressões antes de dar play.',
                       'itens': [girar('"%s" significa…' % v, [pt] + outros(todas_trad, pt, 2, k), 0, k + i) for k, (v, pt) in enumerate(itens)]})
        falar = itens[0][0] if itens else titulo
    perg = []
    if falantes:
        perg.append(girar('Quem conversa nesta lição?', [falantes] + outros(FALANTES, falantes, 2), 0, i))
    if sotaques:
        perg.append(girar('De onde são os sotaques que você ouve?', [sotaques] + outros(SOTAQUES, sotaques, 2, 3), 0, i + 1))
    if tema:
        perg.append(girar('Sobre o que eles conversam?', [tema] + outros(TEMAS, tema, 2, 5), 0, i + 2))
    if perg:
        ex.append({'id': 'enquanto', 'tipo': 'escolha', 'titulo': 'Enquanto ouve', 'instrucao': 'Dê play e responda enquanto escuta.', 'itens': perg})
    a = {'id': uid, 'nivel': mod, 'unidade': i, 'rotulo': '🎧 Listening · ' + nivel, 'titulo': titulo,
         'subtitulo': ('Gramática: ' + gram if gram else 'Tema: ' + tema) + ' · ' + nivel, 'semEbook': True,
         'midiaPrincipal': {'youtube': emb, 'mp3': mp3, 'link': link, 'credito': 'ELLLO.org (Todd Beuckens)'},
         'revisar': revisar, 'exercicios': ex,
         'missao': {'tarefa': 'Ouça duas vezes: a 1ª só ouvindo, a 2ª acompanhando a transcrição no elllo.org. Depois fale 3 frases sobre: ' + (tema or titulo) + '.', 'falar': falar, 'frases': 3, 'exemplo': falar}}
    with open(os.path.join(PASTA, uid + '.js'), 'w', encoding='utf-8') as f:
        f.write("/* Listening %s · %s (elllo.org) — exercícios do professor; gerado por livro/gerar/elllo.py */\n(window.LIVRO_AULAS = window.LIVRO_AULAS || {})['%s'] = %s;\n"
                % (nivel, titulo, uid, json.dumps(a, ensure_ascii=False, indent=1)))
    por_mod.setdefault(mod, []).append((i, nivel, titulo, tema, gram, yt, mp3, link, uid))

ordem_nivel = {'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6}
q = lambda s: '$t$' + s + '$t$'
for mod, ls in por_mod.items():
    ls.sort(key=lambda x: (ordem_nivel.get(x[1], 9), x[0]))
    sql.append("  select id into m from public.mi_modules where name = %s order by created_at limit 1;" % q(mod))
    sql.append("  if m is not null then")
    for k, (i, nivel, titulo, tema, gram, yt, mp3, link, uid) in enumerate(ls):
        t = '🎧 Listening (%s): %s' % (nivel, titulo)
        desc = ('🎯 Prática de listening (%s) com uma conversa real de falantes nativos.\n\n' % nivel +
                ('Foco de gramática: %s.\n' % gram if gram else 'Tema: %s.\n' % tema) +
                ('🎬 Vídeo acima' if yt else '🎧 Áudio no livro da aula') + ' · exercícios antes e durante a escuta, flashcards e pronúncia.\n' +
                '📄 Transcrição: %s\n\nÁudio/vídeo: ELLLO.org (Todd Beuckens).\nlivro: %s' % (link, uid))
        sql.append("    if not exists (select 1 from public.mi_lessons where module_id=m and title=%s) then" % q(t))
        sql.append("      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,%d,%s,%s,%s,'[]'::jsonb,true);"
                   % (200 + k, q(t), q(desc), q(yt) if yt else 'null'))
        sql.append("    end if;")
    sql.append("  end if;")
sql += ["end $blk$;", ""]
open(os.path.join(AQUI, '..', '..', 'supabase', 'listening-elllo.sql'), 'w', encoding='utf-8').write('\n'.join(sql))
for mod, ls in sorted(por_mod.items(), key=lambda x: -len(x[1])): print('%-26s %d aulas' % (mod, len(ls)))
print('sem tradução:', sorted({v for d in D for v in val(d['Vocabulário e expressões']).split('; ') if v and v not in T}))
