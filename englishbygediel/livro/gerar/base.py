"""Ajudantes para escrever as aulas do Livro em Python e gerar livro/aulas/unit-XX.js.
Uso: python3 livro/gerar/level1.py (etc). Cada aula vira um arquivo .js igual ao unit-01.js."""
import json, os

PASTA = os.path.join(os.path.dirname(__file__), '..', 'aulas')

def V(titulo, itens, emoji=False):
    return {'tipo': 'vocab', 'titulo': titulo, 'itens': [list(i) for i in itens], **({'emoji': True} if emoji else {})}

def D(titulo, falas):
    return {'tipo': 'dialogo', 'titulo': titulo, 'falas': [list(f) for f in falas]}

def DICA(texto):
    return {'tipo': 'dica', 'texto': texto}

def dit(id, titulo, instr, frases):
    return {'id': id, 'tipo': 'ditado', 'titulo': titulo, 'instrucao': instr,
            'itens': [{'resp': f if isinstance(f, list) else [f]} for f in frases]}

def esc(id, titulo, instr, itens):
    out = []
    for it in itens:
        p, emoji, ops, c = it
        out.append({'p': p, 'emoji': emoji, 'ops': ops, 'c': c})
    return {'id': id, 'tipo': 'escolha', 'titulo': titulo, 'instrucao': instr, 'itens': out}

def mon(id, titulo, instr, itens):
    return {'id': id, 'tipo': 'montar', 'titulo': titulo, 'instrucao': instr,
            'itens': [{'ouvir': o, 'resp': r} for o, r in itens]}

def conv(id, titulo, instr, linhas):
    return {'id': id, 'tipo': 'conversa', 'titulo': titulo, 'instrucao': instr,
            'linhas': [{'quem': q, 'pt': pt, 'resp': r if isinstance(r, list) else [r]} for q, pt, r in linhas]}

def lig(titulo, pares):
    return {'tipo': 'ligar', 'titulo': titulo, 'pares': [list(p) for p in pares]}

def lac(titulo, linhas):
    return {'tipo': 'lacunas', 'titulo': titulo, 'linhas': [[q, f, r] for q, f, r in linhas]}

def cref(titulo, ref):
    return {'tipo': 'conversa', 'titulo': titulo, 'ref': ref}

def eref(titulo, ref):
    return {'tipo': 'emoji', 'titulo': titulo, 'ref': ref}

def linhas(titulo, n=12):
    return {'tipo': 'linhas', 'titulo': titulo, 'n': n}

def aula(n, nivel, titulo, subtitulo, revisar, exercicios, missao, resumo, mapa, imprimir, slug, **extra):
    uid = 'unit-%02d' % n
    ebook = {'resumo': resumo, 'mapa': {'centro': mapa[0], 'ramos': [{'t': t, 'itens': i} for t, i in mapa[1]]},
             'imprimir': imprimir + [linhas('Missão: escreva %d frases e perguntas com o que aprendeu' % missao[1], missao[1])]}
    ebook.update(extra)
    a = {'id': uid, 'nivel': nivel, 'unidade': n, 'titulo': titulo, 'subtitulo': subtitulo,
         'pdf': 'livro/pdf/%s-%s.pdf' % (uid, slug), 'revisar': revisar, 'exercicios': exercicios,
         'missao': {'falar': missao[0], 'frases': missao[1], 'exemplo': missao[2]}, 'ebook': ebook}
    js = ('/* Livro da aula · Unit %d · %s — gerado por livro/gerar (conteúdo do e-book "Inglês Inteligente"). */\n'
          "(window.LIVRO_AULAS = window.LIVRO_AULAS || {})['%s'] = %s;\n") % (n, titulo, uid, json.dumps(a, ensure_ascii=False, indent=1))
    with open(os.path.join(PASTA, uid + '.js'), 'w', encoding='utf-8') as f:
        f.write(js)
    print('ok', uid, titulo)
