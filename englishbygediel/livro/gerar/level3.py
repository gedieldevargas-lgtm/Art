import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from base import *
L = 'Level 3'

# ---------------- Unit 20 · There is / There are ----------------
aula(20, L, 'There is / There are', 'Tem, há, existe', [
  V('Regras', [('There is a book on the desk.', 'Tem um livro na mesa.'), ('There are books on the desk.', 'Tem livros na mesa.'), ('There is some milk in the fridge.', 'Tem leite na geladeira.'),
     ("There isn't a pen on the table.", 'Não tem caneta na mesa.'), ("There aren't pens here.", 'Não tem canetas aqui.'), ('Is there a cat on the chair?', 'Tem um gato na cadeira?'),
     ('How many students are there in your class?', 'Quantos alunos tem na sua sala?')]),
  V('A casa', [('single bed', 'cama de solteiro'), ('double bed', 'cama de casal'), ('mirror', 'espelho'), ('toilet', 'vaso sanitário'), ('bathtub', 'banheira'), ('cradle', 'berço'),
     ('lamp', 'abajur'), ('shelves', 'prateleiras'), ('sofa', 'sofá'), ('curtain', 'cortina'), ('refrigerator', 'geladeira'), ('stove', 'fogão'), ('washing machine', 'máquina de lavar'), ('fireplace', 'lareira')]),
  DICA('HAVE é ter (posse). Para "tem / há / existe" use THERE IS (singular) e THERE ARE (plural).'),
 ], [
  esc('ex1', 'There is ou there are?', 'Escolha.', [('___ a cat on the chair.', '🐱', ['There is', 'There are'], 0), ('___ cats on the sofa.', '🐱🐱', ['There is', 'There are'], 1),
    ('___ some milk in the fridge.', '🥛', ['There is', 'There are'], 0), ('How many days ___ in February?', '📅', ['is there', 'are there'], 1)]),
  conv('ex2', 'Traduza', 'Em inglês.', [('a', 'Tem uma TV na sala.', ['There is a TV in the living room.', "There's a TV in the living room."]),
    ('b', 'Tem cortinas na sala.', ['There are curtains in the living room.']), ('c', 'Não tem abajur.', ["There isn't a lamp.", 'There is not a lamp.', "There's no lamp."])]),
 ], ('What is there in your bedroom?', 12, 'In my bedroom there is a bed and there are two shelves.'),
 ['There is + singular / incontável.', 'There are + plural.', "Negar: there isn't / there aren't.", 'Perguntar: Is there…? / Are there…? / How many… are there?', 'Vocabulário da casa.'],
 ('There is / are', [('Singular', ['There is a book']), ('Plural', ['There are books']), ('Negar', ["There isn't", "There aren't"]), ('Perguntar', ['Is there…?', 'How many… are there?']),
   ('Casa', ['bed · sofa · mirror', 'stove · fridge'])]),
 [lac('Complete com is / are', [('a', 'There ___ a book on the desk.', ['is']), ('b', 'There ___ books on the desk.', ['are']), ('c', 'There ___ any juice in the fridge.', ["isn't"]),
    ('d', 'How many students ___ there in your class?', ['are'])]), cref('Traduza', 'ex2')], 'there-is-there-are')

# ---------------- Unit 21 · Directions / prepositions of place ----------------
aula(21, L, 'Directions and Prepositions of Place', 'Dar direções e dizer onde as coisas estão', [
  V('Dando direções', [('turn left', 'vire à esquerda'), ('turn right', 'vire à direita'), ('go straight ahead', 'siga reto'), ('go past', 'passe por'), ('cross', 'atravesse')]),
  V('Posição na cidade', [('at / on the corner of', 'na esquina de'), ('next to', 'ao lado de'), ('opposite', 'em frente / do outro lado'), ('between', 'entre')]),
  V('Preposições de lugar', [('in', 'dentro'), ('on', 'sobre (em cima, encostado)'), ('under', 'embaixo'), ('above', 'acima'), ('behind', 'atrás'), ('in front of', 'na frente de'),
     ('next to', 'ao lado'), ('between', 'entre'), ('on the left', 'à esquerda'), ('on the right', 'à direita')]),
  D('Onde fica?', [('A', 'Where is the Chinese restaurant?', 'Onde fica o restaurante chinês?'), ('B', "It's next to the bookstore. It's between the bank and the bookstore.", 'Fica ao lado da livraria, entre o banco e a livraria.'),
     ('A', 'How can I get to the Chinese restaurant?', 'Como chego lá?'), ('B', "Turn left, go past the bookstore. It's on your right.", 'Vire à esquerda, passe a livraria. Fica à sua direita.')]),
 ], [
  conv('ex1', 'Complete (vídeo do e-book)', 'Use as expressões da unidade.', [('a', "Yeah, it's ___ of Lincoln and Seco.", ['on the corner']), ('b', 'Take the elevator to the fifth floor then ___.', ['turn left']),
    ('c', 'You see a city ___ the buildings.', ['between']), ('d', "You'll ___ the first station.", ['go past'])]),
  esc('ex2', 'Onde está a bola?', 'Escolha a preposição.', [('The ball is ___ the box. (dentro)', '📦', ['in', 'on', 'under'], 0), ('The ball is ___ the box. (embaixo)', '📦', ['above', 'under', 'behind'], 1),
    ('The ball is ___ the box. (atrás)', '📦', ['behind', 'next to', 'in'], 0), ('The ball is ___ the box. (acima)', '📦', ['above', 'on', 'between'], 0)]),
 ], ('Where is your phone right now?', 10, 'My phone is on the table, next to the lamp.'),
 ['Pedir e dar direções.', 'turn left / right, go straight ahead, go past, cross.', 'Preposições de lugar: in, on, under, above, behind…', 'Where is…? / How can I get to…?'],
 ('Directions', [('Verbos', ['turn left / right', 'go straight ahead']), ('Cidade', ['on the corner of', 'opposite · between']), ('Lugar', ['in · on · under', 'above · behind']),
   ('Perguntas', ['Where is…?', 'How can I get to…?'])]),
 [lig('Ligue', [('turn left', 'vire à esquerda'), ('go straight ahead', 'siga reto'), ('cross', 'atravesse'), ('next to', 'ao lado'), ('behind', 'atrás'), ('under', 'embaixo')]),
  cref('Complete', 'ex1')], 'directions')

# ---------------- Unit 22 · The seasons ----------------
aula(22, L, 'The Seasons', 'Estações e o clima', [
  V('Seasons', [('spring', 'primavera'), ('summer', 'verão'), ('autumn / fall', 'outono'), ('winter', 'inverno')]),
  V('Weather', [('sun → sunny', 'sol → ensolarado'), ('rain → rainy', 'chuva → chuvoso'), ('wind → windy', 'vento → ventoso'), ('cloud → cloudy', 'nuvem → nublado'),
     ('snow → snowy', 'neve → nevado'), ('storm → stormy', 'tempestade → tempestuoso'), ('partly cloudy', 'parcialmente nublado'), ('freezing', 'congelando'), ('hot · warm · cool · cold', 'quente · morno · fresco · frio')]),
  V('Vocabulário', [('beach', 'praia'), ('vacation', 'férias'), ('sunscreen', 'protetor solar'), ('ice cream', 'sorvete'), ('flowers', 'flores'), ('butterflies', 'borboletas'),
     ('leaves', 'folhas'), ('umbrella', 'guarda-chuva'), ('gloves', 'luvas'), ('scarf', 'cachecol')]),
  V('Verbos', [('It rains a lot in the fall.', 'Chove muito no outono.'), ('It snows a lot in the winter.', 'Neva muito no inverno.'), ('The sun shines a lot in the summer.', 'O sol brilha muito no verão.'),
     ('Brazil gets hot in the summer.', 'O Brasil fica quente no verão.')]),
  DICA("What's the weather like? → It's sunny / It's cloudy / It's freezing."),
 ], [
  conv('ex1', 'Do substantivo ao clima', 'Escreva o adjetivo do clima.', [('a', 'sun', 'sunny'), ('b', 'rain', 'rainy'), ('c', 'wind', 'windy'), ('d', 'cloud', 'cloudy'), ('e', 'snow', 'snowy'), ('f', 'storm', 'stormy')]),
  esc('ex2', 'Qual estação?', 'Escolha.', [('flowers, butterflies, gardening', '🌸', ['spring', 'summer', 'winter'], 0), ('beach, ice cream, sunscreen', '🏖️', ['fall', 'summer', 'winter'], 1),
    ('leaves, umbrella, clouds', '🍂', ['fall', 'spring', 'summer'], 0), ('snow, gloves, scarf', '❄️', ['summer', 'winter', 'spring'], 1)]),
 ], ("What's the weather like today?", 10, "It's sunny today. In the summer, I go to the beach."),
 ['As 4 estações.', "Perguntar o clima: What's the weather like?", 'sun → sunny, rain → rainy…', 'Verbos do clima: rain, snow, shine, get hot.'],
 ('Seasons', [('Spring', ['flowers · butterflies']), ('Summer', ['beach · ice cream']), ('Fall', ['leaves · umbrella']), ('Winter', ['snow · gloves']),
   ('Weather', ["It's sunny / cloudy", "It's freezing"])]),
 [lig('Ligue', [('spring', 'primavera'), ('summer', 'verão'), ('fall', 'outono'), ('winter', 'inverno'), ('umbrella', 'guarda-chuva'), ('sunscreen', 'protetor solar')]),
  cref('Do substantivo ao clima', 'ex1')], 'seasons')

# ---------------- Unit 23 · Present continuous ----------------
aula(23, L, 'Present Continuous', 'O que está acontecendo agora', [
  V('Estrutura', [('I am working', 'Eu estou trabalhando'), ('You are working', 'Você está trabalhando'), ('He / She / It is working', 'Ele / ela está trabalhando'),
     ('We are working', 'Nós estamos trabalhando'), ('They are working', 'Eles estão trabalhando'), ('I am not working', 'Eu não estou trabalhando'), ('Are you working?', 'Você está trabalhando?')]),
  DICA('Present continuous = to be + verbo com -ing. Descreve ações acontecendo neste momento.'),
 ], [
  conv('ex1', 'Complete (vídeo do e-book)', 'Use o verbo com -ing.', [('a', "He's ___ business. (study)", 'studying'), ('b', 'You wake up in the morning, and it is ___. (rain)', 'raining'),
    ('c', "She's ___ to the doctor now. (talk)", 'talking'), ('d', "She's ___ with me. (dance)", 'dancing'), ('e', 'What are they ___ in Europe? (do)', 'doing'), ('f', 'We are ___ to Italy! (go)', 'going')]),
  esc('ex2', 'Escolha a forma certa', '', [('', '', ['They are working.', 'They working.', 'They is working.'], 0), ('', '', ['Is he working?', 'He is working?', 'Does he working?'], 0),
    ('', '', ["I'm not working.", "I don't working.", 'I not working.'], 0)]),
 ], ('What are you doing right now?', 10, "I'm studying English now."),
 ['to be + verbo-ing.', 'Afirmar, negar (not) e perguntar (inverte o to be).', 'Ações acontecendo agora.'],
 ('Continuous', [('Afirmar', ["I'm working", "She's working"]), ('Negar', ["I'm not working"]), ('Perguntar', ['Are you working?']), ('Quando', ['now · right now'])]),
 [cref('Complete com -ing', 'ex1')], 'present-continuous')

# ---------------- Unit 24 · Present continuous x Simple present ----------------
aula(24, L, 'Present Continuous x Simple Present', 'Agora ou sempre?', [
  V('Simple present', [('I work.', 'Eu trabalho.'), ('He works.', 'Ele trabalha.'), ("I don't work.", 'Não trabalho.'), ('Do you work?', 'Você trabalha?'), ('She always works on the computer.', 'Ela sempre trabalha no computador.')]),
  V('Present continuous', [("I'm working.", 'Estou trabalhando.'), ("He's working.", 'Ele está trabalhando.'), ("I'm not working.", 'Não estou trabalhando.'), ('Are you working?', 'Você está trabalhando?'),
     ('She is working now.', 'Ela está trabalhando agora.')]),
  DICA('I am working now, I work every day. Use always, usually, never com o simple present e now com o present continuous.'),
 ], [
  esc('ex1', 'Qual tempo?', 'Escolha a frase certa.', [('Agora', '⏱️', ['She is cooking now.', 'She cooks now.'], 0), ('Todo dia', '📅', ['He drives every day.', 'He is driving every day.'], 0),
    ('Sempre', '🔁', ['They always sing.', 'They are always sing.'], 0), ('Neste momento', '🎸', ['He is playing the guitar.', 'He plays the guitar now.'], 0)]),
  conv('ex2', 'Descreva o que estão fazendo', 'Use o present continuous.', [('😴', 'Ele / dormir', ["He's sleeping", 'He is sleeping']), ('🏃', 'Eles / correr', ["They're running", 'They are running']),
    ('🍳', 'Ela / cozinhar', ["She's cooking", 'She is cooking']), ('🚗', 'Ela / dirigir', ["She's driving", 'She is driving']), ('📖', 'Ele / ler um livro', ["He's reading a book", 'He is reading a book'])]),
 ], ('What are you doing now? What do you do every day?', 12, "I'm studying now. I usually study at night."),
 ['Simple present = rotina, hábitos.', 'Present continuous = agora.', 'Pistas: always, usually × now.'],
 ('Present', [('Simple', ['I work every day', 'She always works']), ('Continuous', ["I'm working now"]), ('Pistas', ['always · usually', 'now · right now'])]),
 [cref('Descreva o que estão fazendo', 'ex2')], 'continuous-vs-simple')

# ---------------- Unit 25 · Simple past (to be) ----------------
aula(25, L, 'Simple Past (verb to be)', 'Was e were', [
  V('Presente → passado', [('I am → I was', 'eu sou/estou → eu era/estava'), ('you are → you were', ''), ('he / she / it is → was', ''), ('we are → we were', ''), ('they are → they were', '')]),
  V('Exemplos', [('I was rich but today I am poor.', 'Eu era rico, mas hoje sou pobre.'), ('We were rich, but today we are poor.', 'Nós éramos ricos, mas hoje somos pobres.'),
     ('Was Thomas at the party?', 'O Thomas estava na festa?'), ('How old was your aunt?', 'Quantos anos sua tia tinha?')]),
  DICA('I / he / she / it → was. You / we / they → were. Se a pessoa já faleceu, descreva no passado.'),
 ], [
  esc('ex1', 'Was ou were?', 'Escolha.', [('He ___ angry.', '😠', ['was', 'were'], 0), ('She ___ hungry.', '🍽️', ['was', 'were'], 0), ('He ___ lost.', '🧭', ['was', 'were'], 0), ('She ___ sleepy.', '😪', ['was', 'were'], 0),
    ('They ___ happy.', '😄', ['was', 'were'], 1), ('He ___ confused.', '😕', ['was', 'were'], 0), ('She ___ sad.', '😢', ['was', 'were'], 0), ('They ___ dirty.', '🧽', ['was', 'were'], 1),
    ('She ___ fast.', '🏃‍♀️', ['was', 'were'], 0), ('They ___ friendly.', '🤝', ['was', 'were'], 1)]),
  conv('ex2', 'Passe para o passado', 'Troque o to be.', [('a', 'I am rich.', 'I was rich.'), ('b', 'We are poor.', 'We were poor.'), ('c', 'He is a famous singer.', 'He was a famous singer.')]),
 ], ('Where were you yesterday?', 10, 'I was at home yesterday.'),
 ['was para I, he, she, it.', 'were para you, we, they.', 'Perguntas: Was he…? Were they…?', 'Descrever pessoas no passado.'],
 ('Was / Were', [('Was', ['I · he · she · it']), ('Were', ['you · we · they']), ('Pergunta', ['Was he at the party?']), ('Exemplo', ['I was rich, today I am poor'])]),
 [lac('Complete com was / were', [('1', 'He ___ angry.', ['was']), ('5', 'They ___ happy.', ['were']), ('8', 'They ___ dirty.', ['were']), ('9', 'She ___ fast.', ['was'])]),
  cref('Passe para o passado', 'ex2')], 'simple-past-to-be')

# ---------------- Unit 26 · There was / there were ----------------
aula(26, L, 'There was / There were', 'Tinha, havia, existia', [
  V('Exemplos', [('There was a pen on the table.', 'Tinha uma caneta na mesa.'), ('There was some water in the cup.', 'Tinha um pouco de água no copo.'), ('There was a lot of money in my wallet.', 'Tinha muito dinheiro na carteira.'),
     ('There were some books in the bag.', 'Tinha alguns livros na bolsa.'), ('There were two cats on the floor.', 'Tinha dois gatos no chão.'), ('There were a lot of kids in the garden.', 'Tinha muitas crianças no jardim.')]),
  V('Objetos da sala de aula', [('clock', 'relógio'), ('door', 'porta'), ('desk', 'mesa'), ('bulletin board', 'mural'), ('calendar', 'calendário'), ('board', 'quadro'), ('books', 'livros'),
     ('screen', 'tela'), ('printer', 'impressora'), ('world globe', 'globo'), ('drawer', 'gaveta'), ('cellphone', 'celular'), ('scanner', 'scanner'), ('stereo', 'aparelho de som'), ('keyboard', 'teclado')]),
  DICA('Mesma regra do there is / there are, só que no passado: is → was, are → were.'),
 ], [
  esc('ex1', 'There was ou there were?', 'Escolha.', [('___ a stereo in the classroom.', '📻', ['There was', 'There were'], 0), ('___ books on the desk.', '📚', ['There was', 'There were'], 1),
    ('___ some water in the cup.', '🥤', ['There was', 'There were'], 0), ('___ two cats on the floor.', '🐈', ['There was', 'There were'], 1)]),
  dit('ex2', 'Ouça e escreva o objeto', 'Escreva o objeto da sala de aula.', ['clock', 'calendar', 'keyboard', 'drawer', 'world globe']),
 ], ('What was there in your old classroom?', 10, 'In the classroom there was a stereo and there were books.'),
 ['There was + singular / incontável.', 'There were + plural.', 'Descrever um lugar no passado.', 'Objetos da sala de aula.'],
 ('There was / were', [('Singular', ['There was a pen']), ('Plural', ['There were two cats']), ('Sala de aula', ['clock · board · desk', 'keyboard · drawer'])]),
 [lig('Ligue', [('clock', 'relógio'), ('drawer', 'gaveta'), ('board', 'quadro'), ('keyboard', 'teclado'), ('screen', 'tela'), ('door', 'porta')])], 'there-was-there-were')

# ---------------- Unit 27 · Position and movement ----------------
aula(27, L, 'Prepositions of Movement', 'Para onde vai?', [
  V('Movimento', [('up', 'para cima'), ('down', 'para baixo'), ('through', 'através'), ('over', 'sobre / por cima'), ('around', 'ao redor'), ('past', 'passar por'), ('away from', 'longe de'),
     ('to', 'para'), ('off', 'fora / desligado'), ('onto', 'para cima de'), ('out of', 'para fora de'), ('into', 'para dentro de'), ('across', 'através de / atravessando'), ('along', 'ao longo de')]),
  V('Com o verbo go', [('go up', 'subir'), ('go down', 'descer'), ('go through', 'atravessar'), ('go into', 'entrar'), ('I go up the mountain.', 'Eu subo a montanha.'), ('He is going up the stairs.', 'Ele está subindo a escada.')]),
 ], [
  esc('ex1', 'Escolha a preposição', 'Qual é o movimento?', [('subir', '⬆️', ['go up', 'go down', 'go off'], 0), ('entrar', '🚪', ['go into', 'go out of', 'go past'], 0),
    ('sair', '🏃', ['go into', 'go out of', 'go onto'], 1), ('dar a volta', '🔄', ['go around', 'go along', 'go to'], 0)]),
  conv('ex2', 'Crie frases', 'Traduza.', [('a', 'Eu subo a montanha.', 'I go up the mountain.'), ('b', 'Ele está subindo a escada.', ['He is going up the stairs.', "He's going up the stairs."]),
    ('c', 'Ela entra na casa.', ['She goes into the house.'])]),
 ], ('How do you go to work or school?', 14, 'I go across the street and into the building.'),
 ['14 preposições de movimento.', 'Verbo go + preposição: go up, go down, go into.', 'Frases no simple present e no present continuous.'],
 ('Movement', [('Vertical', ['up · down', 'onto · off']), ('Dentro / fora', ['into · out of']), ('Passar', ['through · across', 'past · along']), ('Direção', ['to · away from · around'])]),
 [lig('Ligue', [('up', 'para cima'), ('down', 'para baixo'), ('into', 'para dentro'), ('out of', 'para fora'), ('around', 'ao redor'), ('along', 'ao longo de')]),
  cref('Crie frases', 'ex2')], 'prepositions-movement')

# ---------------- Unit 28 · Simple past (regular and irregular) ----------------
aula(28, L, 'Simple Past', 'Verbos regulares e irregulares', [
  V('Regulares', [('work → worked', '+ed'), ('play → played', '+ed'), ('cry → cried', 'consoante + y → ied'), ('study → studied', '→ ied'), ('dance → danced', 'termina em e → +d'),
     ('love → loved', '+d'), ('stop → stopped', 'dobra a consoante'), ('plan → planned', 'dobra a consoante')]),
  V('Irregulares', [('go → went', 'ir'), ('eat → ate', 'comer'), ('have → had', 'ter'), ('buy → bought', 'comprar'), ('see → saw', 'ver'), ('make → made', 'fazer'), ('get → got', 'conseguir'),
     ('find → found', 'achar'), ('forget → forgot', 'esquecer'), ('drink → drank', 'beber'), ('run → ran', 'correr'), ('sit → sat', 'sentar'), ('speak → spoke', 'falar'), ('pay → paid', 'pagar')]),
  V('Negar e perguntar', [("I didn't work.", 'did + not + verbo normal'), ('Did you work?', 'Did + sujeito + verbo normal'), ("I didn't eat.", ''), ('Did you eat?', '')]),
  DICA('Com did / didn\'t o verbo volta para a forma normal: I ate → I didn\'t eat → Did you eat?'),
 ], [
  conv('ex1', 'Passado regular', 'Escreva no passado.', [('a', 'play', 'played'), ('b', 'study', 'studied'), ('c', 'dance', 'danced'), ('d', 'stop', 'stopped'), ('e', 'carry', 'carried'), ('f', 'chat', 'chatted')]),
  conv('ex2', 'Complete o texto', 'Yesterday… (verbos irregulares)', [('a', 'Yesterday ___ (be) a very interesting day.', 'was'), ('b', 'I ___ (go) to the park with my friends.', 'went'),
    ('c', 'I ___ (buy) an ice cream.', 'bought'), ('d', 'We ___ (sit) on a bench.', 'sat'), ('e', 'One of my friends ___ (bring) his dog.', 'brought'), ('f', 'I ___ (lose) my phone!', 'lost'),
    ('g', 'I finally ___ (find) it.', 'found')]),
  esc('ex3', 'Qual está certa?', '', [('', '', ["I didn't eat.", "I didn't ate."], 0), ('', '', ['Did you work?', 'Did you worked?'], 0), ('', '', ['We drove to the airport.', 'We drived to the airport.'], 0)]),
 ], ('What did you do yesterday?', 12, 'Yesterday I went to work and I ate pizza.'),
 ['Regulares: +ed, +d, +ied, dobrar a consoante.', 'Irregulares: memorizar (went, ate, had…).', "Negar com didn't, perguntar com Did.", 'Falar do que fez ontem.'],
 ('Simple Past', [('+ed', ['worked · played']), ('+ied / +d', ['studied · danced']), ('Irregular', ['go → went', 'eat → ate']), ('Negar', ["didn't + verbo"]), ('Perguntar', ['Did you…?'])]),
 [lig('Ligue o passado', [('go', 'went'), ('eat', 'ate'), ('buy', 'bought'), ('see', 'saw'), ('make', 'made'), ('drink', 'drank'), ('run', 'ran')]),
  cref('Complete o texto', 'ex2')], 'simple-past')

# ---------------- Unit 29 · Simple past vs Simple present ----------------
aula(29, L, 'Simple Past vs Simple Present', 'Ontem ou sempre?', [
  V('Pistas de passado', [('yesterday', 'ontem'), ('last month', 'mês passado'), ('two years ago', 'dois anos atrás'), ('last Sunday', 'domingo passado'), ('in 2012', 'em 2012'), ('last Christmas', 'Natal passado')]),
  V('Pistas de presente', [('usually', 'geralmente'), ('always', 'sempre'), ('often', 'frequentemente'), ('every day', 'todo dia'), ('every weekend', 'todo fim de semana'), ('every morning', 'toda manhã')]),
  V('Exemplos', [('He usually plays.', 'Ele geralmente joga.'), ('She walked last week.', 'Ela caminhou semana passada.')]),
 ], [
  esc('ex1', 'Presente ou passado?', 'Escolha a frase certa.', [('yesterday', '', ['I worked yesterday.', 'I work yesterday.'], 0), ('every day', '', ['She walks every day.', 'She walked every day.'], 0),
    ('two days ago', '', ['We played two days ago.', 'We play two days ago.'], 0), ('always', '', ['He always studies.', 'He always studied.'], 0)]),
  conv('ex2', 'Escreva no tempo certo', 'Use a pista.', [('a', 'He ___ (play) soccer every weekend.', 'plays'), ('b', 'She ___ (walk) last week.', 'walked'), ('c', 'I ___ (go) to church last Sunday.', 'went')]),
 ], ('What do you usually do on Sundays? What did you do last Sunday?', 10, 'I usually rest on Sundays. Last Sunday I went to the beach.'),
 ['Pistas de passado: yesterday, last, ago.', 'Pistas de presente: always, usually, every day.', 'Escolher o tempo certo pela pista.'],
 ('Past x Present', [('Past', ['yesterday · last week', 'two years ago']), ('Present', ['always · usually', 'every day']), ('Verbos', ['walked · went', 'walks · goes'])]),
 [cref('Escreva no tempo certo', 'ex2')], 'past-vs-present')

# ---------------- Unit 30 · Simple future ----------------
aula(30, L, 'Simple Future', 'Will', [
  V('Will', [('I will come.', 'Eu virei.'), ("I'll come.", 'abreviação'), ("He won't come.", 'Ele não virá. (won\'t = will not)'), ('Will you come in?', 'Você vai entrar?'), ("Won't you come in?", 'Você não vai entrar?')]),
  V('Present · Past · Future', [('I have', 'presente'), ('I had', 'passado'), ('I will have', 'futuro'), ('He has', 'presente'), ('He had', 'passado'), ('He will have', 'futuro')]),
  DICA("Tomorrow I will wake up at 7:00, I won't have breakfast, I'll take a shower and we will go to work at 8:30."),
 ], [
  conv('ex1', 'Passe para o futuro', 'Use will.', [('a', 'I wake up at 7.', ['I will wake up at 7.', "I'll wake up at 7."]), ('b', "I don't have breakfast.", ["I won't have breakfast.", 'I will not have breakfast.']),
    ('c', 'We go to work.', ['We will go to work.', "We'll go to work."])]),
  esc('ex2', 'Present, past ou future?', 'Complete com o verbo to have.', [('Yesterday I ___ a cold.', '', ['have', 'had', 'will have'], 1), ('Tomorrow she ___ a meeting.', '', ['has', 'had', 'will have'], 2),
    ('He usually ___ lunch at noon.', '', ['has', 'had', 'will have'], 0)]),
 ], ('What will you do tomorrow?', 10, "Tomorrow I'll wake up early and I'll study."),
 ['will + verbo para o futuro.', "won't = will not.", "Abreviar: I'll, he'll.", 'Comparar presente, passado e futuro.'],
 ('Future', [('Afirmar', ['I will come', "I'll come"]), ('Negar', ["I won't come"]), ('Perguntar', ['Will you come in?']), ('3 tempos', ['have · had', 'will have'])]),
 [cref('Passe para o futuro', 'ex1')], 'simple-future')

# ---------------- Unit 31 · Last challenge ----------------
aula(31, L, 'Last Challenge', 'Parabéns! Hora do depoimento', [
  V('Revise os tempos', [('I work.', 'presente'), ("I'm working.", 'presente contínuo'), ('I worked.', 'passado'), ('I will work.', 'futuro'), ('There is / There was', 'tem / tinha'), ('Did you…? / Will you…?', 'perguntas')]),
  DICA('Grave um depoimento se apresentando e falando da sua experiência até aqui. Marque @teachergediel.'),
 ], [
  esc('ex1', 'Revisão final', 'Escolha a frase certa.', [('', '', ['Yesterday I went to the park.', 'Yesterday I go to the park.'], 0), ('', '', ["I'm studying now.", 'I study now.'], 0),
    ('', '', ["Tomorrow I'll travel.", 'Tomorrow I traveled.'], 0), ('', '', ['There were two cats.', 'There was two cats.'], 0), ('', '', ['She always works on Saturday.', 'She always working on Saturday.'], 0)]),
 ], ('Who are you? What did you learn? What will you do next?', 10, "I'm Ana. I learned the past tense. I will keep studying."),
 ['Revisar todos os tempos verbais simples.', 'Gravar o depoimento final.', 'Continuar estudando!'],
 ('Final', [('Presente', ['I work', "I'm working"]), ('Passado', ['I worked', 'I was']), ('Futuro', ['I will work']), ('Desafio', ['grave o depoimento'])]),
 [linhas('Roteiro do seu depoimento', 10)], 'last-challenge')
