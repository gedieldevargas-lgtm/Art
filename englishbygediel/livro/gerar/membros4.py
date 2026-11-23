import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from base import aula_m as A

# Aulas novas do documento "Conteúdo das Aulas — Método Inteligente" (23/11/2026)
M = 'Gramática A1'
A(M, 2, 'SER BOM E ESTAR BEM — Perguntar, Responder e Praticar', 'Verb to be: perguntas e short answers',
  [('Are you…?', 'Você é / está…?'), ('Is she…?', 'Ela é / está…?'), ('Am I…?', 'Eu sou / estou…?'), ('Yes, I am.', 'Sim (eu sou/estou).'),
   ("No, she isn't.", 'Não (ela não é/está).'), ('Yes, they are.', 'Sim (eles são/estão).'), ("No, I'm not.", 'Não (eu não sou/estou).'), ('short answer', 'resposta curta')],
  [('Are you tired?', 'Você está cansado?'), ('Yes, I am.', 'Sim, estou.'), ('Is she from Brazil?', 'Ela é do Brasil?'), ("No, she isn't.", 'Não, ela não é.'),
   ('Are they at home?', 'Eles estão em casa?'), ('Is it cold today?', 'Está frio hoje?'), ("No, he isn't. He's at work.", 'Não, ele não está. Ele está no trabalho.')],
  [('Como perguntar "Você está cansado?"', ['Are you tired?', 'You are tired?', 'Do you tired?'], 0),
   ('Resposta curta certa para "Is he a doctor?"', ["Yes, he is.", 'Yes.', "Yes, he's."], 0),
   ('Na pergunta com to be, o verbo vai…', ['antes do sujeito', 'depois do sujeito', 'no fim'], 0),
   ('"No, they aren\'t" responde…', ['Are they…?', 'Is he…?', 'Am I…?'], 0)],
  ('To be: perguntas', [('Perguntar', ['Are you…?', 'Is she…?', 'Am I…?']), ('Sim', ['Yes, I am.', 'Yes, they are.']), ('Não', ["No, she isn't.", "No, I'm not."]), ('Atenção', ['nunca "Yes, he\'s."'])]),
  'faça 5 perguntas com to be e responda com short answers.',
  ['Fazer perguntas com to be invertendo o verbo.', 'Responder com short answers: Yes, I am / No, she isn\'t.', 'Praticar com diálogos do dia a dia.'],
  dica='Short answers: "Yes, he is." Nunca termine com a contração: "Yes, he\'s." está errado.')

M = 'Gramática A2–B1'
A(M, 2, 'Aconteceu — Mas Não Seguiu as Regras (Verbos Irregulares)', 'Simple Past irregular em grupos',
  [('go → went', 'ir → foi'), ('have → had', 'ter → teve'), ('see → saw', 'ver → viu'), ('buy → bought', 'comprar → comprou'), ('come → came', 'vir → veio'),
   ('cut → cut', 'cortar (mesma forma)'), ('ride → rode', 'andar (de bike) → andou'), ('make → made', 'fazer → fez'), ('take → took', 'pegar → pegou'), ('say → said', 'dizer → disse')],
  [('I went to church on Sunday.', 'Fui à igreja no domingo.'), ('She had a great day.', 'Ela teve um ótimo dia.'), ('We saw a movie.', 'Nós vimos um filme.'),
   ('He bought a new phone.', 'Ele comprou um celular novo.'), ('They came home late.', 'Eles chegaram tarde em casa.'), ('I cut my finger.', 'Cortei meu dedo.'), ("I didn't go out.", 'Eu não saí.')],
  [('Passado de "buy":', ['bought', 'buyed', 'brought'], 0), ('Em "I didn\'t ___ out", o verbo fica…', ['go (forma normal)', 'went', 'gone'], 0),
   ('"cut → cut" é do grupo…', ['mesma forma', 'muda a vogal', 'totalmente diferente'], 0), ('"go → went" é do grupo…', ['totalmente diferente', 'mesma forma', 'regular'], 0)],
  ('Irregulares', [('Mesma forma', ['cut → cut', 'put → put']), ('Muda a vogal', ['ride → rode', 'come → came']), ('Totalmente diferente', ['go → went', 'buy → bought']), ('Negar', ["didn't + verbo normal"])]),
  'conte seu fim de semana em 6 frases usando irregulares.',
  ['Os irregulares mais usados agrupados por padrão de som.', 'Estratégia de memorização por grupos.', "Negar e perguntar com did / didn't."],
  dica='Com did / didn\'t o verbo volta ao normal: "Did you go?" (e não "Did you went?").')
A(M, 6, 'Já Fez Isso? Já Foi Lá? — Parte 2: For, Since e Quando Usar', 'Present Perfect × Simple Past',
  [('for', 'por / há (duração)'), ('since', 'desde (ponto de início)'), ('for 3 years', 'há 3 anos'), ('since 2020', 'desde 2020'), ('How long…?', 'Há quanto tempo…?'),
   ('yesterday', 'ontem'), ('last year', 'ano passado'), ('ago', 'atrás')],
  [("I've lived here for five years.", 'Moro aqui há cinco anos.'), ("She's worked here since 2020.", 'Ela trabalha aqui desde 2020.'), ('How long have you studied English?', 'Há quanto tempo você estuda inglês?'),
   ('I lived there in 2018.', 'Morei lá em 2018.'), ('I saw her yesterday.', 'Eu a vi ontem.'), ("We've known each other for years.", 'Nós nos conhecemos há anos.'), ('He moved here two years ago.', 'Ele se mudou pra cá há dois anos.')],
  [('"Desde 2020":', ['since 2020', 'for 2020', 'ago 2020'], 0), ('"Há 3 anos" (duração até hoje):', ['for 3 years', 'since 3 years', '3 years since'], 0),
   ('Com "yesterday" usamos…', ['Simple Past: I saw her yesterday.', "Present Perfect: I've seen her yesterday.", 'qualquer um'], 0),
   ('"How long have you…?" pergunta…', ['há quanto tempo', 'quando exatamente', 'com que frequência'], 0)],
  ('For × Since', [('For', ['duração', 'for 3 years']), ('Since', ['ponto de início', 'since 2020']), ('Present Perfect', ['até agora', "I've lived here…"]), ('Simple Past', ['tempo terminado', 'yesterday · in 2018'])]),
  'escreva 3 frases com for, 3 com since e 2 no Simple Past.',
  ['For = duração, since = ponto de início.', 'Present Perfect × Simple Past: quando usar cada um.', 'Com tempo terminado (yesterday, in 2018) use o Simple Past.'],
  dica='Com tempo específico no passado, use Simple Past: "I saw her yesterday" (nunca "I\'ve seen her yesterday").')
