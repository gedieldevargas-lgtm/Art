"""Gera livro/glossario.js: dicionário inglês → português tirado do vocabulário e das frases de todas as aulas.
Usado quando o aluno toca numa palavra em inglês. Rode depois de gerar as aulas: python3 livro/gerar/glossario.py"""
import json, os, re, glob

AQUI = os.path.dirname(__file__)
G = {}
def chave(t):
    t = t.lower().replace('’', "'")
    t = re.sub(r"\([^)]*\)", '', t)
    return re.sub(r"[^a-z0-9' ]+", ' ', t).strip()
def pt_limpo(p):
    return re.sub(r'\s*\((?:[^)]*)\)\s*$', '', p).strip() if not p.startswith('(') else p

import subprocess
JS = "global.window={};const fs=require('fs');for(const f of fs.readdirSync(process.argv[1]))if(f.endsWith('.js'))eval(fs.readFileSync(process.argv[1]+'/'+f,'utf8'));console.log(JSON.stringify(Object.values(window.LIVRO_AULAS)))"
TODAS = json.loads(subprocess.check_output(['node', '-e', JS, os.path.join(AQUI, '..', 'aulas')]))
for a in TODAS:
    for b in a.get('revisar', []):
        if b.get('tipo') != 'vocab':
            continue
        for it in b['itens']:
            en, pt = it[0], it[1]
            if not pt or '→' in en:
                # "go → went": guarda as duas pontas
                if '→' in en:
                    x, y = [chave(z) for z in en.split('→', 1)]
                    if x and y:
                        G.setdefault(x, pt or y); G.setdefault(y, (pt + ' (passado/plural de ' + x + ')') if pt else x)
                continue
            for parte in en.split(' / '):
                k = chave(parte)
                if k and len(k.split()) <= 8:
                    G.setdefault(k, pt)

# palavras de função muito comuns (para não ficar sem resposta)
BASE = {'i': 'eu', 'you': 'você', 'he': 'ele', 'she': 'ela', 'it': 'isso / ele / ela', 'we': 'nós', 'they': 'eles / elas', 'my': 'meu / minha', 'your': 'seu / sua',
        'his': 'dele', 'her': 'dela / ela', 'our': 'nosso', 'their': 'deles', 'me': 'me / mim', 'the': 'o / a / os / as', 'a': 'um / uma', 'an': 'um / uma',
        'and': 'e', 'or': 'ou', 'but': 'mas', 'to': 'para', 'of': 'de', 'in': 'em / dentro', 'on': 'em / sobre', 'at': 'em / às', 'for': 'para / por', 'with': 'com',
        'is': 'é / está', 'are': 'são / estão / é', 'am': 'sou / estou', 'was': 'era / estava', 'were': 'eram / estavam', 'do': 'fazer / (auxiliar)', 'does': '(auxiliar com he/she/it)',
        "don't": 'não (auxiliar)', "doesn't": 'não (he/she/it)', 'not': 'não', 'what': 'o que / qual', 'where': 'onde', 'when': 'quando', 'why': 'por que', 'who': 'quem',
        'how': 'como', 'which': 'qual', 'this': 'isto / este', 'that': 'isso / aquele / que', 'these': 'estes', 'those': 'aqueles', 'here': 'aqui', 'there': 'lá / ali',
        'very': 'muito', 'so': 'tão / então', 'too': 'também / demais', 'now': 'agora', 'today': 'hoje', 'yes': 'sim', 'no': 'não', 'please': 'por favor',
        'thanks': 'obrigado', 'thank': 'agradecer', 'good': 'bom / bem', 'well': 'bem', 'fine': 'bem / ótimo', 'can': 'pode / consegue', 'will': '(futuro) vai',
        'have': 'ter', 'has': 'tem (he/she/it)', 'go': 'ir', 'going': 'indo', 'get': 'pegar / conseguir', 'like': 'gostar / como', 'love': 'amar', 'want': 'querer',
        'need': 'precisar', 'know': 'saber / conhecer', 'think': 'pensar / achar', 'say': 'dizer', 'see': 'ver', 'come': 'vir', 'back': 'de volta', 'time': 'tempo / hora / vez',
        'day': 'dia', 'name': 'nome', 'home': 'casa / lar', 'always': 'sempre', 'usually': 'geralmente', 'sometimes': 'às vezes', 'never': 'nunca', 'often': 'frequentemente',
        'rarely': 'raramente', "i'm": 'eu sou / eu estou', "it's": 'é / está', "you're": 'você é / está', "he's": 'ele é / está', "she's": 'ela é / está',
        "what's": 'o que é / qual é', "how's": 'como está / como vai', "let's": 'vamos', "i'll": 'eu vou', 'all': 'todos / tudo', 'one': 'um', 'up': 'para cima',
        'out': 'para fora', 'off': 'desligado / fora', 'about': 'sobre / cerca de', 'from': 'de (origem)', 'by': 'por / até', 'more': 'mais', 'much': 'muito',
        'many': 'muitos', 'some': 'alguns / um pouco', 'any': 'algum / nenhum', 'every': 'todo / cada', 'new': 'novo', 'old': 'velho / antigo', 'big': 'grande',
        'small': 'pequeno', 'great': 'ótimo', 'nice': 'legal / agradável', 'sorry': 'desculpa', 'hello': 'olá', 'hi': 'oi', 'hey': 'ei / e aí',
        "i've": 'eu tenho / eu já (have)', "you've": 'você tem / já', "we've": 'nós temos / já', "they've": 'eles têm / já', "can't": 'não pode / não consegue',
        "won't": 'não vai (will not)', "i'd": 'eu gostaria / eu teria', "isn't": 'não é / não está', "aren't": 'não são / não estão', "didn't": 'não (passado)',
        "we're": 'nós somos / estamos', "they're": 'eles são / estão', "that's": 'isso é', "there's": 'há / tem', 'so much': 'tanto / muito', 'dad': 'pai', 'mom': 'mãe'}
for k, v in BASE.items():
    G.setdefault(k, v)

out = os.path.join(AQUI, '..', 'glossario.js')
with open(out, 'w', encoding='utf-8') as f:
    f.write('/* Glossário inglês → português (gerado por livro/gerar/glossario.py a partir das aulas). */\nwindow.LIVRO_GLOSSARIO = ' + json.dumps(G, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(G), 'entradas')
