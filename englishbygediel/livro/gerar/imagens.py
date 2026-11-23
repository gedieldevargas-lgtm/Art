"""Escolhe uma ilustração (OpenMoji, licença CC BY-SA 4.0) para cada palavra do vocabulário das aulas.
Gera livro/imagens.js ({ "palavra em inglês": "img/om/XXXX.svg" }) e copia só os SVGs usados para livro/img/om/.
Uso: python3 livro/gerar/imagens.py <pasta do pacote openmoji> <pasta do pacote emojilib>"""
import json, os, re, shutil, subprocess, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
LIVRO = os.path.join(AQUI, '..')
OM, EL = sys.argv[1], sys.argv[2]
SVG = os.path.join(OM, 'color', 'svg')
palavras = json.load(open(os.path.join(EL, 'dist', 'emoji-en-US.json'), encoding='utf-8'))  # emoji -> [palavras-chave]

def hexdo(e):
    return '-'.join('%04X' % ord(c) for c in e if ord(c) != 0xFE0F)

# índice palavra-chave -> emoji (a 1ª palavra-chave é o nome do emoji e vale mais)
idx = {}
for e, kws in palavras.items():
    if not os.path.exists(os.path.join(SVG, hexdo(e) + '.svg')):
        continue
    for i, k in enumerate(kws):
        k = k.replace('_', ' ').lower()
        peso = 0 if i == 0 else 1
        if k not in idx or idx[k][1] > peso:
            idx[k] = (e, peso)

# correções à mão para palavras comuns do curso
MAO = {'hi': '👋', 'hello': '👋', 'hey': '🙋', 'bye': '👋', 'thanks': '🙏', 'thank': '🙏', 'please': '🙏', 'sorry': '😔', 'yes': '👍', 'no': '👎',
       'weather': '⛅', 'weekend': '🎉', 'work': '💼', 'job': '💼', 'meeting': '🤝', 'deadline': '⏰', 'boss': '🧑‍💼', 'coworker': '🧑‍🤝‍🧑',
       'family': '👨‍👩‍👧', 'siblings': '👫', 'kitchen': '🍳', 'bedroom': '🛏️', 'commute': '🚌', 'menu': '📋', 'tip': '💵', 'check': '🧾', 'bill': '🧾',
       'gate': '🛫', 'boarding': '🛫', 'layover': '🛬', 'passport': '🛂', 'reservation': '📅', 'key': '🔑', 'subway': '🚇', 'receipt': '🧾',
       'happy': '😊', 'sad': '😢', 'tired': '🥱', 'excited': '🤩', 'angry': '😠', 'grateful': '🙏', 'relieved': '😌', 'overwhelmed': '😵',
       'music': '🎵', 'song': '🎵', 'lyrics': '📝', 'chorus': '🎤', 'movie': '🎬', 'series': '📺', 'episode': '📺', 'scene': '🎬', 'subtitles': '💬',
       'podcast': '🎧', 'accent': '🗣️', 'sound': '🔊', 'think': '🤔', 'listen': '👂', 'speak': '🗣️', 'read': '📖', 'write': '✍️', 'email': '📧',
       'phone': '📱', 'camera': '📷', 'mute': '🔇', 'call': '📞', 'faith': '✝️', 'worship': '🙌', 'praise': '🙌', 'holy': '✨', 'glory': '✨',
       'doctor': '🧑‍⚕️', 'nurse': '🧑‍⚕️', 'teacher': '🧑‍🏫', 'engineer': '🧑‍🔧', 'mechanic': '🧑‍🔧', 'chef': '🧑‍🍳', 'cook': '🧑‍🍳', 'singer': '🧑‍🎤',
       'pilot': '🧑‍✈️', 'police': '👮', 'firefighter': '🧑‍🚒', 'lawyer': '⚖️', 'waiter': '🍽️', 'student': '🧑‍🎓', 'beach': '🏖️', 'apple': '🍎',
       'left': '⬅️', 'right': '➡️', 'straight': '⬆️', 'go up': '⬆️', 'go down': '⬇️', 'corner': '↩️', 'cross': '🚸', 'between': '↔️', 'house': '🏠', 'home': '🏠',
       'car': '🚗', 'bus': '🚌', 'train': '🚆', 'plane': '✈️', 'airport': '🛫', 'hotel': '🏨', 'restaurant': '🍽️', 'bank': '🏦', 'school': '🏫',
       'book': '📖', 'pen': '🖊️', 'dog': '🐶', 'cat': '🐱', 'children': '👧', 'child': '👧', 'people': '👥', 'man': '👨', 'woman': '👩', 'baby': '👶',
       'sun': '☀️', 'rain': '🌧️', 'snow': '❄️', 'wind': '💨', 'cloud': '☁️', 'hot': '🔥', 'cold': '🥶', 'summer': '☀️', 'winter': '❄️', 'spring': '🌸', 'fall': '🍂',
       'coffee': '☕', 'water': '💧', 'food': '🍽️', 'pizza': '🍕', 'breakfast': '🍳', 'lunch': '🥗', 'dinner': '🍝', 'shower': '🚿', 'bed': '🛏️', 'sleep': '😴',
       'run': '🏃', 'walk': '🚶', 'swim': '🏊', 'drive': '🚗', 'dance': '💃', 'sing': '🎤', 'cry': '😢', 'eat': '🍽️', 'drink': '🥤', 'study': '📚',
       'goal': '🎯', 'plan': '🗺️', 'routine': '🔁', 'habit': '🔁', 'level': '📶', 'question': '❓', 'answer': '💡', 'idea': '💡', 'money': '💰',
       'price': '🏷️', 'time': '🕐', 'today': '📅', 'tomorrow': '📅', 'yesterday': '📅', 'morning': '🌅', 'afternoon': '🌤️', 'evening': '🌙', 'night': '🌙'}

PARE = set('a an the to of in on at for with and or but is are am be i you he she it we they my your his her our their me him us them this that these those do does did not'.split())

def escolher(en):
    t = re.sub(r'\([^)]*\)', '', en.lower()).replace('’', "'")
    t = t.split(' / ')[0].split('→')[-1]
    ws = [w for w in re.findall(r"[a-z']+", t) if w not in PARE]
    if ' '.join(ws) in MAO: return MAO[' '.join(ws)]
    for w in ws:                       # 1º: correções à mão
        if w in MAO: return MAO[w]
    frase = ' '.join(ws)
    if frase in idx: return idx[frase][0]
    melhor = None
    for w in ws:                       # 2º: palavra exata no nome/palavra-chave do emoji
        for v in (w, w.rstrip('s'), re.sub(r'(ing|ed)$', '', w)):
            if len(v) >= 3 and v in idx and idx[v][1] == 0 and (melhor is None or idx[v][1] < melhor[1]):
                melhor = idx[v]
    return melhor[0] if melhor else None

JS = "global.window={};const fs=require('fs');for(const f of fs.readdirSync(process.argv[1]))if(f.endsWith('.js'))eval(fs.readFileSync(process.argv[1]+'/'+f,'utf8'));console.log(JSON.stringify(Object.values(window.LIVRO_AULAS)))"
aulas = json.loads(subprocess.check_output(['node', '-e', JS, os.path.join(LIVRO, 'aulas')]))
dest = os.path.join(LIVRO, 'img', 'om'); os.makedirs(dest, exist_ok=True)
mapa, total, com = {}, 0, 0
for a in aulas:
    for b in a.get('revisar', []):
        if b.get('tipo') != 'vocab': continue
        for it in b['itens']:
            total += 1
            e = it[2] if len(it) > 2 and it[2] else escolher(it[0])
            if not e: continue
            h = hexdo(e); src = os.path.join(SVG, h + '.svg')
            if not os.path.exists(src):
                h = '-'.join('%04X' % ord(c) for c in e); src = os.path.join(SVG, h + '.svg')
            if not os.path.exists(src): continue
            shutil.copyfile(src, os.path.join(dest, h + '.svg'))
            k = re.sub(r"[^a-z0-9' ]+", ' ', it[0].lower().replace('’', "'")).strip()
            k = re.sub(r'\s+', ' ', k)
            mapa[k] = 'img/om/' + h + '.svg'; com += 1
with open(os.path.join(LIVRO, 'imagens.js'), 'w', encoding='utf-8') as f:
    f.write('/* Ilustrações OpenMoji (openmoji.org, CC BY-SA 4.0) para o vocabulário. Gerado por livro/gerar/imagens.py */\nwindow.LIVRO_IMAGENS = ' + json.dumps(mapa, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('itens', total, 'com imagem', com, 'arquivos', len(os.listdir(dest)))
