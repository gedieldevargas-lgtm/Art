import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from base import *
L = 'Level 2'

# ---------------- Unit 11 · Articles ----------------
aula(11, L, 'Articles', 'A, an, the · this, that, these, those', [
  V('Articles', [('a', 'um / uma (antes de consoante)'), ('an', 'um / uma (antes de vogal)'), ('the', 'o / a / os / as'), ('(no article)', 'nomes próprios, plurais, idiomas')]),
  V('Exemplos', [('a book', 'um livro'), ('an apple', 'uma maçã'), ('the book', 'o livro'), ('the moon', 'a lua'), ('Spanish', 'espanhol (sem artigo)')]),
  V('This, that, these, those', [('This is a pen', 'Essa é uma caneta (perto, singular)'), ('These are pens', 'Essas são canetas (perto, plural)'),
     ('That is a pen', 'Aquela é uma caneta (longe, singular)'), ('Those are pens', 'Aquelas são canetas (longe, plural)'),
     ('This pen is blue', 'Essa caneta é azul'), ('Those pens are red', 'Aquelas canetas são vermelhas')]),
  DICA('Use "the" quando você quer especificar ou quando só existe um: the sun, the moon.'),
 ], [
  esc('ex1', 'A, an ou the?', 'Escolha o artigo certo.', [('___ apple', '🍎', ['a', 'an', 'the'], 1), ('___ book', '📘', ['a', 'an'], 0), ('___ moon (só existe uma)', '🌙', ['a', 'an', 'the'], 2),
    ('___ house', '🏠', ['a', 'an'], 0), ("___ sun", '☀️', ['a', 'an', 'the'], 2)]),
  esc('ex2', 'This, that, these ou those?', 'Perto ou longe? Singular ou plural?', [('___ is a pen. (perto, 1)', '🖊️', ['This', 'These', 'Those'], 0),
    ('___ are pens. (perto, várias)', '🖊️🖊️', ['That', 'These', 'This'], 1), ('___ pen is green. (longe, 1)', '👉', ['That', 'Those', 'These'], 0),
    ('___ pens are red. (longe, várias)', '👉👉', ['This', 'That', 'Those'], 2)]),
  conv('ex3', 'Descreva as imagens', 'Escreva em inglês.', [('🏠', 'É uma casa', ["It's a house", 'It is a house', 'This is a house']), ('☀️', 'É o sol', ["It's the sun", 'It is the sun']),
    ('👨‍⚕️', 'Ele é um médico', ["He's a doctor", 'He is a doctor'])]),
 ], ('Point to things around you: This is a…, That is a…', 15, 'This is a book. Those are chairs.'),
 ['a = antes de consoante, an = antes de vogal.', 'the = algo específico ou único.', 'Sem artigo: nomes próprios, plurais e idiomas.', 'this / these (perto) e that / those (longe).'],
 ('Articles', [('a', ['a book', 'a house']), ('an', ['an apple']), ('the', ['the moon', 'the book']), ('Perto', ['this (1)', 'these (+)']), ('Longe', ['that (1)', 'those (+)']),
   ('Sem artigo', ['Spanish', 'John'])]),
 [lig('Ligue', [('This', 'esse (perto)'), ('These', 'esses (perto)'), ('That', 'aquele (longe)'), ('Those', 'aqueles (longe)'), ('An', 'antes de vogal'), ('The', 'o / a / os / as')]),
  cref('Descreva as imagens', 'ex3')], 'articles')

# ---------------- Unit 12 · Nouns ----------------
aula(12, L, 'Nouns', 'Substantivos: plural regular, irregular e abstratos', [
  V('Plural regular (+s)', [('book → books', 'livro'), ('cat → cats', 'gato'), ('chair → chairs', 'cadeira'), ('dog → dogs', 'cachorro'), ('tree → trees', 'árvore'),
     ('house → houses', 'casa'), ('car → cars', 'carro'), ('shoe → shoes', 'sapato'), ('pencil → pencils', 'lápis')]),
  V('Plural irregular', [('man → men', 'homem'), ('woman → women', 'mulher'), ('child → children', 'criança'), ('person → people', 'pessoa'), ('foot → feet', 'pé'),
     ('tooth → teeth', 'dente'), ('mouse → mice', 'rato'), ('goose → geese', 'ganso'), ('ox → oxen', 'boi')]),
  V('Abstract nouns', [('love', 'amor'), ('happiness', 'felicidade'), ('anger', 'raiva'), ('justice', 'justiça'), ('freedom', 'liberdade'), ('beauty', 'beleza'),
     ('courage', 'coragem'), ('kindness', 'bondade'), ('imagination', 'imaginação')]),
  DICA('Os irregulares não seguem padrão: não pergunte o porquê, só memorize. Pratique dizendo o plural sem ler.'),
 ], [
  conv('ex1', 'Escreva o plural', 'Plural em inglês.', [('a', 'child', 'children'), ('b', 'woman', 'women'), ('c', 'tooth', 'teeth'), ('d', 'person', 'people'),
    ('e', 'foot', 'feet'), ('f', 'mouse', 'mice'), ('g', 'chair', 'chairs'), ('h', 'man', 'men')]),
  esc('ex2', 'Regular ou irregular?', 'Escolha.', [('dog → dogs', '🐶', ['Regular', 'Irregular'], 0), ('goose → geese', '🪿', ['Regular', 'Irregular'], 1),
    ('pencil → pencils', '✏️', ['Regular', 'Irregular'], 0), ('ox → oxen', '🐂', ['Regular', 'Irregular'], 1)]),
  dit('ex3', 'Ouça e escreva', 'Escreva a palavra.', ['children', 'people', 'teeth', 'happiness']),
 ], ('Name ten things around you in the plural.', 10, 'There are two chairs and three books.'),
 ['Nouns = substantivos.', 'Plural regular: acrescente -s.', 'Plurais irregulares: men, women, children, people, feet, teeth.', 'Substantivos abstratos: love, freedom, kindness.'],
 ('Nouns', [('Regular +s', ['book → books', 'car → cars']), ('Irregular', ['man → men', 'child → children', 'tooth → teeth']), ('Abstratos', ['love · happiness', 'freedom · courage'])]),
 [lig('Ligue singular e plural', [('man', 'men'), ('woman', 'women'), ('child', 'children'), ('person', 'people'), ('foot', 'feet'), ('tooth', 'teeth'), ('mouse', 'mice')]),
  cref('Escreva o plural', 'ex1')], 'nouns')

# ---------------- Unit 13 · Simple Present ----------------
aula(13, L, 'Simple Present', 'Presente simples: afirmar, negar e perguntar', [
  V('Sujeitos', [('I', 'eu'), ('You', 'você'), ('He', 'ele'), ('She', 'ela'), ('It', 'ele/ela (coisa)'), ('We', 'nós'), ('You', 'vocês'), ('They', 'eles/elas')]),
  V('He / she / it: + s, es, ies', [('dance → dances', '+s'), ('work → works', '+s'), ('watch → watches', '+es'), ('fix → fixes', '+es'), ('study → studies', 'consoante + y → ies'),
     ('fly → flies', 'consoante + y → ies'), ('play → plays', 'vogal + y → s'), ('go → goes', 'exceção'), ('have → has', 'exceção'), ('do → does', 'exceção')]),
  V('To live', [('I live', 'Eu moro'), ('He lives', 'Ele mora'), ("I don't live", 'Eu não moro'), ("He doesn't live", 'Ele não mora'), ('Do you live…?', 'Você mora…?'), ('Does she live…?', 'Ela mora…?')]),
  DICA('Com does / doesn\'t o verbo volta ao normal: He lives → He doesn\'t live → Does he live?'),
 ], [
  conv('ex1', 'Conjugue com he / she / it', 'Escreva o verbo com he / she.', [('a', 'She ___ (study) Karate.', ['studies']), ('b', 'He ___ (watch) you.', ['watches']),
    ('c', 'He ___ (have) my e-mail address.', ['has']), ('d', 'She ___ (dance) with Darnley.', ['dances']), ('e', 'He ___ (go) to work.', ['goes']), ('f', 'She ___ (play) the guitar.', ['plays'])]),
  esc('ex2', 'Do ou does?', 'Escolha o auxiliar.', [('___ you live in Brazil?', '', ['Do', 'Does'], 0), ('___ she live with her mother?', '', ['Do', 'Does'], 1),
    ("He ___ live alone.", '', ["don't", "doesn't"], 1), ("They ___ like washing dishes.", '', ["don't", "doesn't"], 0)]),
  conv('ex3', 'Reescreva mudando o sujeito', 'Troque I por He (texto do Mark).', [('a', 'I am Mark.', ['He is Mark.', "He's Mark."]), ('b', 'I love my family.', 'He loves his family.'),
    ('c', 'I live with my wife and two kids.', 'He lives with his wife and two kids.'), ('d', 'I enjoy outdoor activities.', 'He enjoys outdoor activities.'),
    ('e', "I don't like washing dishes.", ["He doesn't like washing dishes.", 'He does not like washing dishes.'])]),
 ], ('What do you do every day?', 15, 'I study English. She works at home.'),
 ['Presente simples: hábitos, fatos e verdades.', 'He / she / it: verbo + s, es ou ies.', "Negar com don't / doesn't.", 'Perguntar com Do / Does.', 'Exceções: goes, has, does.'],
 ('Simple Present', [('Afirmar', ['I live', 'He lives']), ('Negar', ["I don't live", "He doesn't live"]), ('Perguntar', ['Do you live?', 'Does she live?']),
   ('+es', ['watches · fixes']), ('+ies', ['studies · flies']), ('Exceções', ['go → goes', 'have → has'])]),
 [lac('Complete', [('Mark', 'He ___ (run) and he sometimes ___ (play) tennis.', ['runs', 'plays']), ('Mark', 'He ___ (like) practicing yoga daily.', ['likes']),
    ('Mark', "He ___ (not / meet) the clients.", ["doesn't meet"])]), cref('Reescreva mudando o sujeito', 'ex3')], 'simple-present')

# ---------------- Unit 14 · Question words + daily activities ----------------
aula(14, L, 'Question words', 'Palavras de pergunta e atividades diárias', [
  V('Question words', [('What', 'o que / qual'), ('Where', 'onde'), ('Which', 'qual (opções)'), ('When', 'quando'), ('Why', 'por que'), ('Who', 'quem'), ('How', 'como')]),
  V('Exemplos', [("What's your mother's name?", 'Qual é o nome da sua mãe?'), ('Where are you from?', 'De onde você é?'), ('Which do you prefer, pink or blue?', 'Qual você prefere?'),
     ('When do you work?', 'Quando você trabalha?'), ('Why are you here?', 'Por que você está aqui?'), ('Who is he?', 'Quem é ele?'), ('How are you?', 'Como você está?')]),
  V('Daily activities', [('wake up / get up', 'acordar / levantar'), ('brush teeth', 'escovar os dentes'), ('take a shower', 'tomar banho'), ('have breakfast', 'tomar café'),
     ('go to work', 'ir trabalhar'), ('have lunch', 'almoçar'), ('have a snack', 'lanchar'), ('take out the garbage', 'levar o lixo'), ('watch a movie', 'ver um filme'),
     ('read a book', 'ler um livro'), ('have dinner', 'jantar'), ('go to bed', 'ir dormir')]),
 ], [
  esc('ex1', 'Escolha a question word', 'Qual palavra completa?', [('___ are you from?', '', ['Where', 'Who', 'When'], 0), ('___ is he?', '', ['Who', 'Where', 'Which'], 0),
    ('___ do you work?', '', ['When', 'Who', 'What'], 0), ('___ are you here?', '', ['Why', 'Which', 'Who'], 0), ('___ do you prefer, pink or blue?', '', ['Which', 'Where', 'How'], 0)]),
  mon('ex2', 'Monte a rotina', 'Ouça e monte a frase.', [('On Monday…', 'On Monday, I wake up and have breakfast.'), ('Then…', 'I take a shower and go to work.')]),
  conv('ex3', 'Traduza a atividade', 'Escreva em inglês.', [('a', 'escovar os dentes', ['brush teeth', 'brush my teeth']), ('b', 'tomar banho', ['take a shower', 'take a bath']),
    ('c', 'almoçar', ['have lunch', 'eat lunch']), ('d', 'ir dormir', ['go to bed', 'sleep']), ('e', 'acordar', ['wake up', 'get up'])]),
 ], ('What do you do on Monday?', 15, 'On Monday, I wake up, have breakfast and go to work.'),
 ['As 7 question words: what, where, which, when, why, who, how.', 'Montar perguntas sobre a rotina.', 'Atividades diárias para falar do seu dia.'],
 ('Questions', [('What / Which', ['o que / qual']), ('Where / When', ['onde / quando']), ('Who / Why / How', ['quem / por que / como']), ('Manhã', ['wake up · brush teeth', 'have breakfast']),
   ('Tarde', ['go to work · have lunch']), ('Noite', ['have dinner · go to bed'])]),
 [lig('Ligue', [('What', 'o que'), ('Where', 'onde'), ('When', 'quando'), ('Why', 'por que'), ('Who', 'quem'), ('How', 'como'), ('Which', 'qual (opções)')]),
  cref('Traduza a atividade', 'ex3')], 'question-words')

# ---------------- Unit 15 · Adverbs of frequency ----------------
aula(15, L, 'Adverbs of Frequency', 'Com que frequência?', [
  V('Advérbios', [('always', 'sempre · 100%'), ('usually', 'geralmente · 90%'), ('often', 'frequentemente · 70%'), ('sometimes', 'às vezes · 50%'),
     ('hardly ever / rarely', 'quase nunca · 10%'), ('never', 'nunca · 0%')]),
  V('Exemplos', [('You are always late.', 'Você está sempre atrasado.'), ('He often cooks pasta.', 'Ele frequentemente cozinha massa.'),
     ('We usually go to the cinema on Sunday.', 'Geralmente vamos ao cinema no domingo.'), ('She hardly ever smiles.', 'Ela quase nunca sorri.'),
     ('They are never at home.', 'Eles nunca estão em casa.')]),
  V('Mais específico', [('once a week', 'uma vez por semana'), ('twice a year', 'duas vezes por ano'), ('three times a month', 'três vezes por mês'), ('every day', 'todo dia'),
     ('every two weeks', 'a cada duas semanas'), ('daily · weekly · monthly', 'diariamente · semanalmente · mensalmente')]),
  DICA('Com to be o advérbio vem depois (You are always late). Com outros verbos vem antes (He often cooks). Never e hardly ever já são negativos: "He is never late".'),
 ], [
  conv('ex1', 'Ouça e complete', 'Complete com o advérbio do gabarito.', [('a', "Because guys don't ___ pay attention to details like that.", 'usually'), ('b', 'Why am I ___ the monster?', 'always'),
    ('c', 'I have an apartment I ___ use.', 'rarely'), ('d', 'And he ___ watches Oliver.', 'sometimes'), ('e', "I'm ___ home.", 'hardly ever'), ('f', 'They are ___ very strong.', 'often')]),
  esc('ex2', 'Ordem certa', 'Qual frase está certa?', [('', '', ['He is never late.', "He isn't never late."], 0), ('', '', ['They hardly ever go to the library.', "They don't hardly ever go to the library."], 0),
    ('', '', ['He often cooks pasta.', 'He cooks often pasta.'], 0)]),
  conv('ex3', 'Traduza', 'Em inglês.', [('a', 'Ela visita o dentista 2x por ano.', 'She visits the dentist twice a year.'), ('b', 'Ele vai à academia três vezes por semana.', 'He goes to the gym three times a week.'),
    ('c', 'Nós pagamos o financiamento todo mês.', 'We pay our mortgage every month.')]),
 ], ('How often do you study English?', 12, 'I always study English. I sometimes go to the beach.'),
 ['Advérbios de 100% a 0%: always → never.', 'Posição: depois do to be, antes dos outros verbos.', 'How often…? para perguntar.', 'once, twice, three times + a + período.'],
 ('Frequency', [('100–70%', ['always · usually · often']), ('50–0%', ['sometimes · rarely · never']), ('Posição', ['You are always…', 'He often cooks…']),
   ('Pergunta', ['How often do you…?']), ('Vezes', ['once · twice', 'three times a week'])]),
 [lig('Ligue', [('always', 'sempre'), ('usually', 'geralmente'), ('often', 'frequentemente'), ('sometimes', 'às vezes'), ('rarely', 'raramente'), ('never', 'nunca')]),
  lac('Responda usando os advérbios', [('1', 'How often do you read a book? I ___ read a book.', ['always / sometimes / never']), ('2', 'How often does Helen go to the cinema? She ___ goes.', ['sometimes']),
    ('3', 'How often does João go to bed late? He ___ goes to bed late.', ['never'])]), cref('Traduza', 'ex3')], 'adverbs-frequency')

# ---------------- Unit 16 · Prepositions of time ----------------
aula(16, L, 'Prepositions of time', 'At, in, on e as horas', [
  V('AT', [('at 4 o\'clock', 'horas'), ('at noon / midnight', 'meio-dia / meia-noite'), ('at night', 'à noite'), ('at lunchtime', 'horário de refeição'), ('at Christmas', 'feriados'), ('at the weekend', 'fim de semana')]),
  V('IN', [('in April', 'meses'), ('in 1990', 'anos'), ('in the 80s', 'décadas'), ('in the 20th century', 'séculos'), ('in the morning', 'partes do dia'), ('in the summer', 'estações')]),
  V('ON', [('on Tuesday', 'dias'), ('on June 15th', 'datas'), ('on my birthday', 'aniversário'), ('on Monday morning', 'dia + parte do dia')]),
  V('As horas', [("eight o'clock", '8:00'), ('five past eight', '8:05'), ('quarter past eight', '8:15'), ('half past eight', '8:30'), ('twenty to nine', '8:40'),
     ('quarter to nine', '8:45'), ('five to nine', '8:55')]),
  DICA('past = minutos depois da hora (até 30). to = minutos antes da próxima hora. Com last / next não use preposição: "Call me next weekend".'),
 ], [
  esc('ex1', 'At, in ou on?', 'Escolha a preposição.', [('___ 10:30', '🕥', ['at', 'in', 'on'], 0), ('___ June', '📅', ['at', 'in', 'on'], 1), ('___ Tuesday', '📆', ['at', 'in', 'on'], 2),
    ('___ the morning', '🌅', ['at', 'in', 'on'], 1), ('___ night', '🌙', ['at', 'in', 'on'], 0), ('___ my birthday', '🎂', ['at', 'in', 'on'], 2), ('___ the summer', '☀️', ['at', 'in', 'on'], 1)]),
  conv('ex2', 'What time is it?', 'Escreva a hora em inglês.', [('🕗', '8:00', ["eight o'clock", "it's eight o'clock"]), ('🕣', '8:30', ['half past eight', "it's half past eight", 'eight thirty']),
    ('🕗', '8:15', ['quarter past eight', 'a quarter past eight', 'eight fifteen']), ('🕘', '8:45', ['quarter to nine', 'a quarter to nine', 'eight forty-five']),
    ('🕗', '8:10', ['ten past eight', 'eight ten'])]),
  esc('ex3', 'Qual está certa?', 'Last / next.', [('', '', ['I met her last Friday.', 'I met her on the last Friday.'], 0), ('', '', ['Call me next weekend.', 'Call me at the next weekend.'], 0)]),
 ], ('What time do you usually get up in the morning?', 12, 'I get up at 7 in the morning. My birthday is in June.'),
 ['at = horas, noite, refeições, feriados.', 'in = meses, anos, estações, partes do dia.', 'on = dias e datas.', "Dizer as horas: o'clock, past, to, quarter, half."],
 ('Time', [('AT', ['at 4 o\'clock', 'at night']), ('IN', ['in April · in 1990', 'in the morning']), ('ON', ['on Tuesday', 'on June 15th']), ('Past', ['ten past eight', 'half past eight']),
   ('To', ['twenty to nine', 'quarter to nine']), ('Sem preposição', ['last Friday', 'next weekend'])]),
 [lac('Complete com at / in / on', [('a', 'I get up ___ 7 o\'clock.', ['at']), ('b', 'My birthday is ___ June.', ['in']), ('c', 'We go to church ___ Sunday.', ['on']), ('d', 'I watch TV ___ night.', ['at']),
    ('e', 'It snows ___ the winter.', ['in'])]), cref('What time is it?', 'ex2')], 'prepositions-time')

# ---------------- Unit 17 · Questions ----------------
aula(17, L, 'Questions', 'A ordem das palavras nas perguntas', [
  V('Com to be', [('How old is Sharon?', 'palavra + is/are + sujeito'), ('Where are you from?', 'Onde + are + você'), ('Is he busy?', 'is + sujeito + extra'), ('Are you from the US?', 'are + sujeito + extra')]),
  V('Com outros verbos', [('Do you like pizza?', 'Do + sujeito + verbo'), ('What time does he get up?', 'palavra + does + sujeito + verbo'), ('How much do you pay for it?', 'palavra + do + sujeito + verbo')]),
  DICA('Ordem: (palavra de pergunta) + auxiliar (am/is/are ou do/does) + sujeito + verbo + resto.'),
 ], [
  mon('ex1', 'Coloque em ordem', 'Monte a pergunta.', [('What time does the nurse come?', 'What time does the nurse come?'), ('How are they doing?', 'How are they doing?'),
    ('Where do you need the bag?', 'Where do you need the bag?'), ('Alex, which car do you have?', 'Alex, which car do you have?')]),
  esc('ex2', 'Do, does, is ou are?', 'Escolha o auxiliar.', [('___ you like pizza?', '', ['Do', 'Does', 'Are'], 0), ('What time ___ he get up?', '', ['do', 'does', 'is'], 1),
    ('How old ___ Sharon?', '', ['does', 'is', 'are'], 1), ('Where ___ you from?', '', ['do', 'is', 'are'], 2)]),
 ], ('Ask five questions to a friend.', 10, 'Where do you live? What time do you get up?'),
 ['Perguntas com to be: inverte (Is he…?).', 'Perguntas com outros verbos: do / does antes do sujeito.', 'Question word sempre no começo.'],
 ('Questions', [('To be', ['Is he busy?', 'Where are you from?']), ('Do / Does', ['Do you like pizza?', 'What time does he get up?']),
   ('Ordem', ['palavra · auxiliar', 'sujeito · verbo · resto'])]),
 [lac('Complete o auxiliar', [('a', '___ you like pizza?', ['Do']), ('b', 'What time ___ he get up?', ['does']), ('c', 'How old ___ Sharon?', ['is']), ('d', '___ he busy now?', ['Is'])])], 'questions')

# ---------------- Unit 18 · Daily routine ----------------
aula(18, L, 'Daily Routine', 'Rotina com horários e frequência', [
  V('A rotina do Chris (texto fictício do e-book)', [('I usually wake up at 6:00 AM.', 'Geralmente acordo às 6h.'), ('By 6:30 AM, I am out for a run.', 'Às 6h30 estou correndo.'),
     ('At 7:30 AM, I take a quick shower.', 'Às 7h30 tomo um banho rápido.'), ('At 10:00 AM, I head to the gym.', 'Às 10h vou à academia.'), ('At 12:00 PM, I have lunch.', 'Ao meio-dia almoço.'),
     ('At 6:00 PM, I have dinner with my family.', 'Às 18h janto com a família.'), ('At 7:30 PM, we usually watch TV.', 'Às 19h30 geralmente vemos TV.'), ('I go to bed.', 'Vou dormir.')]),
  DICA('Use at + horário, adverbs of frequency (usually, always, often) e muitos detalhes.'),
 ], [
  esc('ex1', 'Leia e responda', 'Sobre o texto do Chris.', [('What time does he wake up?', '⏰', ['At 6:00 AM.', 'At 7:30 AM.', 'At 10:00 AM.'], 0), ('Where does he run?', '🏃', ['On the beach.', 'At the gym.', 'At home.'], 0),
    ('What does he eat for lunch?', '🍗', ['Chicken, rice and vegetables.', 'Eggs and toast.', 'Pizza.'], 0), ('What do they do at 7:30 PM?', '📺', ['They watch TV or a movie.', 'They go to the gym.', 'They sleep.'], 0)]),
  conv('ex2', 'Escreva a sua rotina', 'Responda em inglês com at + horário.', [('8:00', 'O que você faz às 8h?', ["I have breakfast", "I have breakfast at 8", "At 8:00 I have breakfast", 'I take a shower and have breakfast']),
    ('12:00', 'E ao meio-dia?', ['I have lunch', 'I have lunch at noon', 'At 12:00 I have lunch'])]),
 ], ('Tell your daily routine out loud.', 15, 'I usually wake up at 7. At 8, I have breakfast.'),
 ['Falar a rotina com horários (at 6:00 AM).', 'Usar usually, always, often, sometimes.', 'Descrever o dia do começo ao fim.'],
 ('Routine', [('Manhã', ['wake up at 6', 'take a shower']), ('Tarde', ['have lunch at 12', 'go to the gym']), ('Noite', ['have dinner at 6 PM', 'go to bed']),
   ('Frequência', ['usually · always · often'])]),
 [linhas('Escreva sua rotina de segunda a sábado (como no desafio)', 10)], 'daily-routine')

# ---------------- Unit 19 · Challenge Level 2 ----------------
aula(19, L, 'Challenge · Level 2', 'My Daily Routine', [
  V('Exemplo de agenda', [('Monday 8:00', 'I have breakfast early'), ('Monday 10:00', 'I study English'), ('Tuesday 11:00', 'I make videos for Instagram'), ('Thursday 8:00', 'I study the Bible'),
     ('Thursday 10:00', 'I go to church'), ('Friday 8:00', 'I practice Muay Thai'), ('Saturday 8:00', 'I get up late'), ('Saturday 11:00', 'I study marketing and business')]),
  DICA('Crie a sua agenda "My Daily Routine" com horários e tarefas e poste uma foto ou print marcando o perfil.'),
 ], [
  esc('ex1', 'Revisão do Level 2', 'Escolha a frase certa.', [('', '', ['She studies karate.', 'She study karate.'], 0), ('', '', ['I go to church on Thursday.', 'I go to church in Thursday.'], 0),
    ('', '', ['He usually wakes up at 6.', 'He wakes usually up at 6.'], 0), ('', '', ['Does she live alone?', 'Do she lives alone?'], 0), ('', '', ['These are pens.', 'This are pens.'], 0)]),
 ], ('What do you do on Saturday?', 12, 'On Saturday, I get up late and have a tea.'),
 ['Revisar o Level 2.', 'Montar sua agenda semanal em inglês.', 'Postar o desafio My Daily Routine.'],
 ('Level 2', [('Articles', ['a · an · the']), ('Simple Present', ['he works', "doesn't · does"]), ('Frequency', ['always … never']), ('Time', ['at · in · on']), ('Questions', ['What time do you…?'])]),
 [linhas('Desafio: My Daily Routine (dia · hora · tarefa)', 14)], 'challenge-level-2')
