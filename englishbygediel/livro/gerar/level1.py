import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from base import *
L = 'Level 1'

# ---------------- Unit 2 · Verb to be ----------------
aula(2, L, 'Verb to be', 'Ser e estar', [
  V('To be = ser, estar', [('I am', 'Eu sou / estou'), ('You are', 'Você é / está'), ('He is', 'Ele é / está'), ('She is', 'Ela é / está'),
     ('It is', 'Ele / ela é (coisa, animal)'), ('We are', 'Nós somos / estamos'), ('You are', 'Vocês são / estão'), ('They are', 'Eles / elas são')]),
  V('Abreviando', [("I'm", 'I am'), ("You're", 'You are'), ("He's", 'He is'), ("She's", 'She is'), ("It's", 'It is'), ("We're", 'We are'), ("They're", 'They are')]),
  V('Exemplos do e-book', [("It's cold", 'Está frio'), ("She's happy", 'Ela está feliz'), ("They're sad", 'Eles estão tristes'), ("I'm tired", 'Estou cansado'), ("He's 25 years old", 'Ele tem 25 anos')]),
  D('Apresentação', [('A', "Hi, I'm Jonah.", 'Oi, eu sou o Jonah.'), ('B', "I'm Mady.", 'Eu sou a Mady.'), ('A', 'Nice to meet you.', 'Prazer em te conhecer.')]),
  DICA('Para idade use o verbo to be: "I am 25 years old" (e não "I have 25 years").'),
 ], [
  conv('ex1', 'Complete a tabela abreviando', 'Escreva a forma curta com o verbo to be.', [
    ('Cold', 'It + is + cold', "It's cold"), ('Happy', 'She + is + happy', "She's happy"), ('Sad', 'They + are + sad', "They're sad"),
    ('Tired', 'I + am + tired', "I'm tired"), ('Amazing', 'You + are + amazing', "You're amazing"), ('Sleepy', 'We + are + sleepy', "We're sleepy"),
    ('Furious', 'He + is + furious', "He's furious")]),
  esc('ex2', 'Am, is ou are?', 'Escolha a forma certa do verbo to be.', [
    ('My name ___ Emily.', '', ['am', 'is', 'are'], 1), ('I ___ from California.', '', ['am', 'is', 'are'], 0),
    ('We ___ very close.', '', ['am', 'is', 'are'], 2), ('She ___ a graphic designer.', '', ['am', 'is', 'are'], 1),
    ('They ___ my friends too.', '', ['am', 'is', 'are'], 2), ('My family ___ very important to me.', '', ['am', 'is', 'are'], 1)]),
  esc('ex3', 'Leia e responda', 'Texto: "John is a young man. He is 25 years old. He is from Brazil, and he is a student at a big university. John is very dedicated to his studies… In his free time, John is very active."', [
    ('Is John dedicated to his studies?', '', ['Yes, he is.', "No, he isn't."], 0), ('How old is John?', '', ['He is 25 years old.', 'He is a student.'], 0),
    ('Where is he from?', '', ['He is from Brazil.', 'He is from the US.'], 0), ('Is John a student at a school?', '', ["No, he is a student at a university.", 'Yes, he is.'], 0),
    ('Is John lazy?', '', ['Yes, he is.', "No, he isn't; he is very active."], 1)]),
  dit('ex4', 'Escreva o que você ouve', 'Ouça e escreva a frase.', ["I'm from Brazil.", "She's very happy.", "They're my friends.", "It's cold today.", "We are a family."]),
 ], ('Who are you? Where are you from?', 10, "I'm Gediel. I'm from Brazil."),
 ['Conjugar o verbo to be: I am, you are, he/she/it is, we/they are.', 'Abreviar: I\'m, you\'re, he\'s, she\'s, it\'s, we\'re, they\'re.',
  'Se apresentar e dizer de onde é.', 'Falar idade com to be: I am 25 years old.', 'Perguntar invertendo: Is he…? / Are they…?'],
 ('Verb to be', [('I', ['I am → I\'m']), ('He / She / It', ['is → he\'s, she\'s, it\'s']), ('You / We / They', ['are → you\'re, we\'re, they\'re']),
   ('Pergunta', ['Is John from Brazil?', 'Are they Spanish?']), ('Resposta curta', ['Yes, he is.', "No, they aren't."]), ('Usos', ['nome · idade', 'origem · sentimentos'])]),
 [lac('Complete com o verbo to be', [('Emily', 'Hey there! My name ___ Emily, and I ___ from California.', ['is', 'am']),
    ('Emily', 'I ___ a student at the local university.', ['am']), ('Emily', 'My family ___ very important to me.', ['is']),
    ('Emily', 'We ___ very close.', ['are']), ('Emily', 'She ___ from New York City.', ['is'])]),
  cref('Escreva a forma curta', 'ex1')], 'verb-to-be')

# ---------------- Unit 3 · Adjectives ----------------
OP = [('Hot', 'Quente'), ('Cold', 'Frio'), ('Long', 'Longo'), ('Short', 'Curto'), ('Near', 'Perto'), ('Far', 'Longe'), ('Rich', 'Rico'), ('Poor', 'Pobre'),
      ('Small', 'Pequeno'), ('Big', 'Grande'), ('Full', 'Cheio'), ('Empty', 'Vazio'), ('Good', 'Bom'), ('Bad', 'Ruim'), ('Beautiful', 'Bonito(a)'), ('Ugly', 'Feio(a)'),
      ('Expensive', 'Caro'), ('Cheap', 'Barato'), ('Right', 'Certo'), ('Wrong', 'Errado'), ('Clean', 'Limpo'), ('Dirty', 'Sujo'), ('Old', 'Velho'), ('New', 'Novo'),
      ('Weak', 'Fraco'), ('Strong', 'Forte'), ('High', 'Alto'), ('Low', 'Baixo'), ('Fast', 'Rápido'), ('Slow', 'Lento'), ('Short', 'Baixo'), ('Tall', 'Alto')]
aula(3, L, 'Adjectives', 'Adjetivos e seus opostos', [
  V('Opostos (1 a 16)', OP[:16]), V('Opostos (17 a 32)', OP[16:]),
  DICA('Descreva uma mesma coisa com mais de um adjetivo. Ex: Justin Bieber is tall. He\'s not poor, he\'s very rich.'),
 ], [
  conv('ex1', 'Qual é o oposto?', 'Escreva o adjetivo oposto em inglês.', [
    ('Hot', 'quente ↔ ?', 'cold'), ('Long', 'longo ↔ ?', 'short'), ('Near', 'perto ↔ ?', 'far'), ('Rich', 'rico ↔ ?', 'poor'), ('Small', 'pequeno ↔ ?', 'big'),
    ('Full', 'cheio ↔ ?', 'empty'), ('Expensive', 'caro ↔ ?', 'cheap'), ('Clean', 'limpo ↔ ?', 'dirty'), ('Weak', 'fraco ↔ ?', 'strong'), ('Fast', 'rápido ↔ ?', 'slow')]),
  esc('ex2', 'Escolha a tradução', 'Qual é o adjetivo certo?', [
    ('Caro', '💰', ['Cheap', 'Expensive', 'Empty'], 1), ('Sujo', '🧦', ['Dirty', 'Clean', 'Wrong'], 0), ('Errado', '❌', ['Right', 'Low', 'Wrong'], 2),
    ('Velho', '👴', ['New', 'Old', 'Ugly'], 1), ('Alto (pessoa)', '🧍', ['Tall', 'High', 'Big'], 0)]),
  mon('ex3', 'Monte a frase', 'Ouça e monte a frase.', [('Justin Bieber is tall.', 'Justin Bieber is tall.'), ("He's not poor, he's very rich.", "He's not poor, he's very rich."),
    ('The car is new and fast.', 'The car is new and fast.')]),
 ], ('Describe your house with three adjectives.', 15, 'My house is small, clean and beautiful.'),
 ['32 adjetivos com seus opostos.', 'Usar adjetivo com to be: The car is fast.', 'Juntar adjetivos: tall and strong.', 'Usar very para intensificar: very rich.'],
 ('Adjectives', [('Tamanho', ['small ↔ big', 'short ↔ tall', 'long ↔ short']), ('Qualidade', ['good ↔ bad', 'right ↔ wrong', 'beautiful ↔ ugly']),
   ('Preço / dinheiro', ['expensive ↔ cheap', 'rich ↔ poor']), ('Estado', ['clean ↔ dirty', 'full ↔ empty', 'old ↔ new']),
   ('Força / velocidade', ['weak ↔ strong', 'fast ↔ slow']), ('Lugar / temperatura', ['near ↔ far', 'high ↔ low', 'hot ↔ cold'])]),
 [lig('Ligue os opostos', [('Hot', 'Cold'), ('Rich', 'Poor'), ('Full', 'Empty'), ('Clean', 'Dirty'), ('Fast', 'Slow'), ('Old', 'New'), ('Weak', 'Strong')]),
  cref('Escreva o oposto', 'ex1')], 'adjectives')

# ---------------- Unit 4 · Possessive adjectives ----------------
aula(4, L, 'Possessive adjectives', 'Meu, seu, dele, dela…', [
  V('Possessive adjectives', [('my', 'meu / minha / meus / minhas'), ('your', 'seu / sua (singular)'), ('his', 'dele'), ('her', 'dela'),
     ('its', 'dele / dela (coisas, animais)'), ('our', 'nosso(a)(s)'), ('your', 'seus / suas (plural)'), ('their', 'deles / delas')]),
  V('Exemplos', [("My name's John", 'Meu nome é João'), ('Your car is blue', 'Seu carro é azul'), ("His name's Martin", 'O nome dele é Martin'),
     ('Her last name is Santos', 'O sobrenome dela é Santos'), ('Its name is Infly school', 'O nome dela é Escola Infly'),
     ('Our passports are Brazilian', 'Nossos passaportes são brasileiros'), ('Your houses are big', 'Suas casas são grandes'),
     ('Their names are Ellen and Jim', 'Os nomes deles são Ellen e Jim')]),
 ], [
  esc('ex1', 'Complete com o possessivo', 'Texto do John: escolha a palavra certa.', [
    ("Hi, my name's John, ___ last name is Borges.", '', ['my', 'his', 'their'], 0), ("I live with ___ brother and sister.", '', ['my', 'her', 'its'], 0),
    ("___ sister is a lawyer, her name is Hailey.", '', ['Her', 'My', 'Our'], 1), ("My sister is a lawyer, ___ name is Hailey.", '', ['his', 'her', 'its'], 1),
    ("My brother is a doctor, ___ name is Lenny.", '', ['her', 'his', 'your'], 1)]),
  esc('ex2', 'Tom e Emma', 'Complete: "I\'m Tom, my nickname is Tommy…"', [
    ("I was born in Australia and ___ city is amazing.", '', ['my', 'his', 'their'], 0), ("___ name is Sydney.", '', ['Its', 'Her', 'His'], 0),
    ("I live with my girlfriend, ___ name is Emma.", '', ['his', 'her', 'its'], 1), ("…and our dear dog, ___ name is Max.", '', ['its', 'her', 'their'], 0)]),
  conv('ex3', 'Traduza as frases', 'Do inglês para o português e do português para o inglês.', [
    ('a', 'My favorite food is pizza', ['Minha comida favorita é pizza']), ('b', "Her name's Mary, and she's my friend", ['O nome dela é Mary e ela é minha amiga', 'O nome dela é Mary, e ela é minha amiga']),
    ('c', 'O seu pai é famoso, o nome dele é Messi', ['Your father is famous, his name is Messi', "Your father is famous, his name's Messi"]),
    ('d', 'Minha mãe é americana, o nome dela é Jane', ['My mother is American, her name is Jane', "My mother is American, her name's Jane", 'My mom is American, her name is Jane'])]),
 ], ('What is your name? What is your mother\'s name?', 15, "My name is Ana. Her name is Maria."),
 ['Usar my, your, his, her, its, our, their.', 'his = dele, her = dela, its = coisas e animais.', 'Their = deles / delas.', 'Descrever família e amigos.'],
 ('Possessives', [('Eu / você', ['I → my', 'you → your']), ('Ele / ela', ['he → his', 'she → her']), ('Coisas / animais', ['it → its']),
   ('Nós / eles', ['we → our', 'they → their']), ('Exemplos', ["Her name's Mary", 'Their names are Ellen and Jim'])]),
 [lig('Ligue o sujeito ao possessivo', [('I', 'my'), ('You', 'your'), ('He', 'his'), ('She', 'her'), ('It', 'its'), ('We', 'our'), ('They', 'their')]),
  lac('Complete', [('Mia', 'I share it with my husband, ___ name is Antonio.', ['his']), ('Mia', 'Our two children, ___ names are Sophia and Lucas.', ['their']),
    ('Jake', 'I share ___ house with my wife, ___ name is Lisa.', ['my', 'her']), ('Jake', 'I love cars, ___ car is a classic Mustang.', ['my'])]),
  cref('Traduza', 'ex3')], 'possessive-adjectives')

# ---------------- Unit 5 · Countries and Nationalities ----------------
PA = [('England', 'English / British'), ('Portugal', 'Portuguese'), ('Ireland', 'Irish'), ('Turkey', 'Turkish'), ('Chile', 'Chilean'), ('Germany', 'German'),
      ('Mexico', 'Mexican'), ('United States', 'American'), ('South Korea', 'South Korean'), ('Canada', 'Canadian'), ('Thailand', 'Thai'), ('Brazil', 'Brazilian'),
      ('China', 'Chinese'), ('Iran', 'Iranian'), ('Japan', 'Japanese'), ('Peru', 'Peruvian'), ('France', 'French'), ('Italy', 'Italian'), ('Vietnam', 'Vietnamese'),
      ('Russia', 'Russian'), ('Australia', 'Australian')]
aula(5, L, 'Countries and Nationalities', 'Países, nacionalidades e continentes', [
  V('Continentes', [('Africa', 'African'), ('North America', 'North American'), ('South America', 'South American'), ('Asia', 'Asian'), ('Europe', 'European'), ('Australia', 'Australian')]),
  V('Países e nacionalidades', PA), V('Pontos cardeais', [('North', 'Norte'), ('South', 'Sul'), ('East', 'Leste'), ('West', 'Oeste')]),
  D('Diálogo', [('A', 'Are you Korean?', 'Você é coreano?'), ('B', "No, I'm not. I'm from Peru.", 'Não. Eu sou do Peru.'), ('B', 'What about you? Where are you from?', 'E você? De onde você é?'),
     ('A', "I'm American, I'm from the US.", 'Sou americano, sou dos EUA.')]),
 ], [
  conv('ex1', 'Qual é a nacionalidade?', 'Escreva a nacionalidade em inglês.', [(c, 'País: ' + c, n.split(' / ')) for c, n in
     [('Brazil', 'Brazilian'), ('Japan', 'Japanese'), ('France', 'French'), ('Germany', 'German'), ('Mexico', 'Mexican'), ('Italy', 'Italian'), ('China', 'Chinese'), ('England', 'English / British')]]),
  esc('ex2', 'Escolha a resposta', 'Leia a pergunta e escolha.', [('Where are you from?', '🇧🇷', ["I'm from Brazil.", "I'm Brazil.", 'I from Brazil.'], 0),
    ('Are you Korean?', '🇵🇪', ["No, I'm not. I'm Peruvian.", 'Yes, I am Peru.', "No, I'm Peru."], 0), ('Is he Canadian?', '🇨🇦', ['Yes, he is.', 'Yes, he are.', 'Yes, is he.'], 0)]),
  mon('ex3', 'Monte o diálogo', 'Ouça e monte.', [('Where are you from?', "I'm American, I'm from the US."), ('What about you?', "I'm from Peru.")]),
 ], ('Where are you from? What is your nationality?', 10, "I'm Brazilian. My friend is from Canada, she is Canadian."),
 ['Dizer de onde você é: I\'m from Brazil.', 'Dizer a nacionalidade: I\'m Brazilian.', 'Continentes e seus adjetivos.', 'Perguntar: Where are you from? / Are you…?'],
 ('Countries', [('Pergunta', ['Where are you from?', 'Are you Korean?']), ('Resposta', ["I'm from Brazil.", "I'm Brazilian."]),
   ('Continentes', ['Africa · Asia · Europe', 'North / South America']), ('-an / -ian', ['Brazilian · Mexican', 'Italian · Canadian']),
   ('-ese / -ish', ['Japanese · Chinese', 'English · Turkish']), ('Pontos', ['North · South', 'East · West'])]),
 [lig('Ligue o país à nacionalidade', [('Brazil', 'Brazilian'), ('Japan', 'Japanese'), ('France', 'French'), ('Ireland', 'Irish'), ('Thailand', 'Thai'), ('Russia', 'Russian'), ('Chile', 'Chilean')]),
  cref('Escreva a nacionalidade', 'ex1')], 'countries-nationalities')

# ---------------- Unit 6 · The alphabet ----------------
aula(6, L, 'The alphabet', 'Alfabeto, siglas e soletrar', [
  V('Siglas', [('PDF', 'Portable Document Format'), ('UK', 'The United Kingdom'), ('DJ', 'Disk Jockey'), ('US', 'The United States'), ('SUV', 'Sport Utility Vehicle'),
     ('PC', 'Personal Computer'), ('VIP', 'Very Important Person'), ('NBA', 'National Basketball Association')]),
  V('Palavras pelo som das letras', [('C U', 'See you (até mais)'), ('Y', 'Why (por quê)'), ('R U', 'Are you'), ('SK8', 'Skate'), ('How R u?', 'How are you?'), ('n u?', 'and you?')]),
  D('Soletrando', [('A', 'How do you spell your name?', 'Como você soletra seu nome?'), ('B', 'G-E-D-I-E-L.', 'G-E-D-I-E-L.')]),
  DICA('Ouça, repita e soletre TUDO ao seu redor.'),
 ], [
  conv('ex1', 'Escreva as siglas', 'Escreva a sigla de cada nome.', [('a', 'Portable Document Format', 'PDF'), ('b', 'The United Kingdom', 'UK'), ('c', 'Disk Jockey', 'DJ'),
    ('d', 'The United States', ['US', 'USA']), ('e', 'Sport Utility Vehicle', 'SUV'), ('f', 'Personal Computer', 'PC'), ('g', 'Very Important Person', 'VIP'), ('h', 'National Basketball Association', 'NBA')]),
  conv('ex2', 'Reescreva sem abreviar', 'Escreva a frase completa.', [('A', 'Hello, How R u?', 'Hello, how are you?'), ('B', 'Fine, Thanks, n u?', 'Fine, thanks, and you?'), ('B', 'OK, CU.', 'OK, see you.')]),
  dit('ex3', 'Ouça a soletração', 'Ouça as letras e escreva a palavra.', [['B-R-A-Z-I-L', 'Brazil'], ['H-E-L-L-O', 'hello'], ['F-R-I-E-N-D', 'friend']]),
 ], ('How do you spell your name?', 10, 'My name is Ana: A-N-A.'),
 ['As letras do alfabeto em inglês.', 'Soletrar o nome: How do you spell your name?', 'Siglas famosas: PDF, UK, VIP, NBA.', 'Abreviações pelo som das letras: C U, R U, Y.'],
 ('Alphabet', [('Perguntar', ['How do you spell your name?']), ('Siglas', ['PDF · UK · DJ', 'SUV · PC · VIP · NBA']), ('Som das letras', ['C U = see you', 'R U = are you', 'Y = why']),
   ('Pratique', ['soletre objetos', 'soletre nomes'])]),
 [lig('Ligue a sigla ao nome', [('PDF', 'Portable Document Format'), ('UK', 'The United Kingdom'), ('VIP', 'Very Important Person'), ('PC', 'Personal Computer'), ('DJ', 'Disk Jockey')]),
  cref('Reescreva sem abreviar', 'ex2')], 'alphabet')
# soletração: o ditado fala as letras
import json
p = os.path.join(PASTA, 'unit-06.js'); s = open(p, encoding='utf-8').read(); open(p, 'w', encoding='utf-8').write(s)

# ---------------- Unit 7 · Numbers and days ----------------
aula(7, L, 'Numbers and Days of the week', 'Números, contas e dias da semana', [
  V('1 a 12', [('one', '1'), ('two', '2'), ('three', '3'), ('four', '4'), ('five', '5'), ('six', '6'), ('seven', '7'), ('eight', '8'), ('nine', '9'), ('ten', '10'), ('eleven', '11'), ('twelve', '12')]),
  V('13 a 19 (terminam em -teen)', [('thirteen', '13'), ('fourteen', '14'), ('fifteen', '15'), ('sixteen', '16'), ('seventeen', '17'), ('eighteen', '18'), ('nineteen', '19')]),
  V('Dezenas (terminam em -ty)', [('twenty', '20'), ('thirty', '30'), ('forty', '40'), ('fifty', '50'), ('sixty', '60'), ('seventy', '70'), ('eighty', '80'), ('ninety', '90')]),
  V('Números grandes', [('one hundred', '100'), ('two hundred', '200'), ('one thousand', '1.000'), ('two thousand', '2.000'), ('one hundred twenty-five thousand', '125.000'),
     ('one million', '1.000.000'), ('ten million', '10.000.000')]),
  V('Contas', [('plus', '+ (mais)'), ('minus', '− (menos)'), ('times', '× (vezes)'), ('divided by', '÷ (dividido por)'), ('equals', '= (igual)')]),
  V('Days of the week', [('Monday', 'segunda'), ('Tuesday', 'terça'), ('Wednesday', 'quarta'), ('Thursday', 'quinta'), ('Friday', 'sexta'), ('Saturday', 'sábado'), ('Sunday', 'domingo')]),
  DICA('Hundred = centena, thousand = milhar, million = milhão. Conte quantas centenas: 300 = three hundred.'),
 ], [
  conv('ex1', 'Escreva por extenso', 'Escreva o número em inglês.', [('25', '25', ['twenty-five', 'twenty five']), ('99', '99', ['ninety-nine', 'ninety nine']),
    ('150', '150', ['one hundred and fifty', 'one hundred fifty']), ('32', '32', ['thirty-two', 'thirty two']), ('210', '210', ['two hundred and ten', 'two hundred ten']),
    ('45', '45', ['forty-five', 'forty five']), ('123', '123', ['one hundred and twenty-three', 'one hundred twenty-three', 'one hundred twenty three'])]),
  esc('ex2', 'Escolha a opção correta', 'Qual é o número em inglês?', [('76', '', ['Sixty-six', 'Seventy-six', 'Seventy-five'], 1),
    ('304', '', ['Three hundred and four', 'Thirty-four', 'Three thousand and four'], 0), ('58', '', ['Fifty-eight', 'Sixty-eight', 'Forty-eight'], 0)]),
  conv('ex3', 'Resolva a conta', 'Escreva o resultado em inglês.', [('a', 'Fifty + fifty =', ['one hundred', 'a hundred']), ('b', 'One hundred − twenty =', 'eighty'),
    ('c', 'Thirty-three + ten =', ['forty-three', 'forty three']), ('d', 'Seventy-five − twenty-five =', 'fifty')]),
  dit('ex4', 'Ouça o dia da semana', 'Escreva o dia que você ouvir.', ['Monday', 'Wednesday', 'Thursday', 'Saturday']),
 ], ('What is your phone number? How old are you?', 10, 'Fifteen times three equals forty-five.'),
 ['Números de 1 a 1 milhão.', '13–19 terminam em -teen, dezenas em -ty.', 'Contas: plus, minus, times, divided by, equals.', 'Os dias da semana.'],
 ('Numbers', [('1–12', ['one … twelve']), ('-teen', ['thirteen … nineteen']), ('-ty', ['twenty … ninety']), ('Grandes', ['hundred · thousand', 'million']),
   ('Contas', ['plus · minus', 'times · divided by']), ('Days', ['Monday … Sunday'])]),
 [lig('Ligue o número', [('13', 'thirteen'), ('30', 'thirty'), ('15', 'fifteen'), ('50', 'fifty'), ('19', 'nineteen'), ('90', 'ninety'), ('40', 'forty')]),
  lac('Transforme em números', [('a', 'Eighty-five plus fifteen equals ___', ['100']), ('b', 'One hundred and twenty divided by four equals ___', ['30']),
    ('c', 'Fifty-six times two equals ___', ['112']), ('d', 'Nine hundred minus three hundred equals ___', ['600'])]),
  cref('Escreva por extenso', 'ex1')], 'numbers-days')

# ---------------- Unit 8 · Months and dates ----------------
aula(8, L, 'Months and Dates', 'Meses, anos, ordinais e datas', [
  V('Months', [('January', 'janeiro'), ('February', 'fevereiro'), ('March', 'março'), ('April', 'abril'), ('May', 'maio'), ('June', 'junho'), ('July', 'julho'),
     ('August', 'agosto'), ('September', 'setembro'), ('October', 'outubro'), ('November', 'novembro'), ('December', 'dezembro')]),
  V('Ordinais', [('1st first', 'primeiro'), ('2nd second', 'segundo'), ('3rd third', 'terceiro'), ('4th fourth', 'quarto'), ('5th fifth', 'quinto'), ('8th eighth', 'oitavo'),
     ('9th ninth', 'nono'), ('12th twelfth', 'décimo segundo'), ('20th twentieth', 'vigésimo'), ('100th one hundredth', 'centésimo')]),
  V('Anos', [('1500', 'fifteen hundred'), ('1995', 'nineteen ninety-five'), ('2001', 'two thousand one'), ('2012', 'two thousand twelve'), ('2024', 'twenty twenty-four')]),
  D('Datas', [('A', 'When were you born?', 'Quando você nasceu?'), ('B', 'I was born on August 22nd in 1996.', 'Nasci em 22 de agosto de 1996.'),
     ('A', 'When is your birthday?', 'Quando é seu aniversário?'), ('B', 'My birthday is on December 25th.', 'Meu aniversário é em 25 de dezembro.')]),
  DICA('Datas usam número ordinal e a ordem Mês + ordinal: January 1st. Para dizer "em" uma data use on.'),
 ], [
  conv('ex1', 'Escreva o ordinal', 'Escreva por extenso.', [('1st', '1º', 'first'), ('2nd', '2º', 'second'), ('3rd', '3º', 'third'), ('5th', '5º', 'fifth'), ('12th', '12º', 'twelfth'), ('20th', '20º', 'twentieth')]),
  esc('ex2', 'Escolha a data certa', 'Como se diz?', [('25 de dezembro (Natal)', '🎄', ['December 25th', '25 December th', 'December twenty-five'], 0),
    ('4 de julho (EUA)', '🇺🇸', ['July 4th', 'July four', 'Four July'], 0), ('Meu aniversário é em…', '🎂', ['My birthday is on May 3rd.', 'My birthday is in May 3.', 'My birthday is at May third.'], 0)]),
  dit('ex3', 'Ouça e escreva o mês', 'Escreva o mês.', ['January', 'April', 'August', 'December']),
 ], ('When is your birthday?', 10, 'My birthday is on March 10th.'),
 ['Os 12 meses do ano.', 'Números ordinais: first, second, third…', 'Falar datas: Month + ordinal (January 1st).', 'Falar anos: nineteen ninety-five, two thousand one.', 'Usar on para datas.'],
 ('Dates', [('Months', ['January … December']), ('Ordinais', ['1st first · 2nd second', '3rd third · 4th fourth']), ('Ordem', ['Mês + ordinal', 'January 1st']),
   ('Anos', ['1995: nineteen ninety-five', '2001: two thousand one']), ('Perguntas', ['When is your birthday?', 'When were you born?'])]),
 [lig('Ligue o mês', [('January', 'janeiro'), ('March', 'março'), ('May', 'maio'), ('July', 'julho'), ('September', 'setembro'), ('October', 'outubro'), ('December', 'dezembro')]),
  cref('Escreva o ordinal', 'ex1')], 'months-dates')

# ---------------- Unit 9 · Professions ----------------
PR = [('Soccer player', 'jogador de futebol'), ('Journalist', 'jornalista'), ('Dancer', 'dançarino'), ('Engineer', 'engenheiro'), ('Architect', 'arquiteto'), ('Lawyer', 'advogado'),
      ('Doctor', 'médico'), ('Nurse', 'enfermeiro'), ('Driver', 'motorista'), ('Teacher', 'professor'), ('Salesperson', 'vendedor'), ('Designer', 'designer'), ('Model', 'modelo'),
      ('Firefighter', 'bombeiro'), ('Chef / cook', 'chef / cozinheiro'), ('Musician', 'músico'), ('Pharmacist', 'farmacêutico'), ('Singer', 'cantor'), ('Waiter', 'garçom'),
      ('Receptionist', 'recepcionista'), ('Veterinarian', 'veterinário'), ('Mechanic', 'mecânico'), ('Flight attendant', 'comissário de bordo'), ('Hairdresser', 'cabeleireiro'), ('Police officer', 'policial')]
aula(9, L, 'Professions and Occupations', 'Profissões', [
  V('Profissões', PR),
  DICA("Descreva pessoas usando o que já aprendeu: His name is Cristiano Ronaldo, he's 39, his birthday is on February 5th, he's from Portugal, he's a soccer player."),
 ], [
  conv('ex1', 'Complete com a profissão', 'Qual é a profissão?', [('a', 'The ___ works in a hospital and takes care of patients.', ['doctor', 'nurse']),
    ('b', 'The ___ builds bridges and roads.', 'engineer'), ('c', 'A ___ teaches students in a classroom.', ['teacher', 'professor']),
    ('d', 'If you have legal problems, you should talk to a ___.', 'lawyer'), ('e', 'The ___ makes delicious meals in a restaurant.', ['chef', 'cook']),
    ('f', 'The ___ flies the plane across the sky.', ['pilot', 'flight attendant'])]),
  esc('ex2', 'Complete os textos', 'Escolha a profissão certa.', [("My brother Erik is a software ___.", '💻', ['engineer', 'nurse', 'waiter'], 0),
    ("I'm Maria, a graphic ___ from Spain.", '🎨', ['designer', 'driver', 'singer'], 0), ("I'm Emily, I love reporting on current events. I'm a ___.", '📰', ['journalist', 'mechanic', 'model'], 0),
    ("I'm Sarah, a marketing ___ from the United States.", '📊', ['manager', 'dancer', 'cook'], 0)]),
  mon('ex3', 'Monte a frase', 'Ouça e monte.', [("What do you do?", "I'm a teacher."), ('Is he a doctor?', "No, he's a nurse.")]),
 ], ('What do you do? What does your mother do?', 15, "I'm a teacher. My father is a mechanic."),
 ['Nome de 25+ profissões.', 'Dizer a profissão: I\'m a teacher / She\'s an engineer.', 'Usar a / an antes da profissão.', 'Descrever pessoas: nome, idade, origem e profissão.'],
 ('Professions', [('Saúde', ['doctor · nurse', 'pharmacist · veterinarian']), ('Escritório', ['lawyer · designer', 'engineer · architect']), ('Serviços', ['waiter · driver', 'mechanic · receptionist']),
   ('Arte', ['singer · dancer', 'musician · model']), ('Segurança', ['police officer', 'firefighter']), ('Pergunta', ['What do you do?', "I'm a/an …"])]),
 [lig('Ligue a profissão', [('Doctor', 'médico'), ('Lawyer', 'advogado'), ('Waiter', 'garçom'), ('Firefighter', 'bombeiro'), ('Nurse', 'enfermeiro'), ('Mechanic', 'mecânico'), ('Singer', 'cantor')]),
  cref('Complete com a profissão', 'ex1')], 'professions')

# ---------------- Unit 10 · Challenge Level 1 ----------------
aula(10, L, 'Challenge · Level 1', 'Revisão do Level 1 e desafio', [
  V('Revise o Level 1', [('Greetings', "Hi! How are you?"), ('Verb to be', "He's 33 years old."), ('Adjectives', "He's very good."), ('Possessives', "His wife's name is Brittany."),
     ('Countries', "He's from Texas, in the USA."), ('Professions', 'He is a songwriter and pastor.')]),
  DICA('Exemplo do desafio: "This is Brandon Lake. He\'s from Texas in the USA. He is a songwriter and pastor. He\'s 33 years old. He plays the guitar and sings, he\'s very good. He is married, his wife\'s name is Brittany Lake. They have 3 children."'),
 ], [
  esc('ex1', 'Verdadeiro ou falso (contas)', 'A conta está certa?', [('Nine plus eight is sixteen.', '', ['True', 'False'], 1), ('Fifteen plus seven is thirty-two.', '', ['True', 'False'], 1),
    ('Fifty-seven plus one hundred thirty-six is one hundred and ninety-three.', '', ['True', 'False'], 0)]),
  conv('ex2', 'Corrija a frase', 'Escreva a frase certa.', [('a', 'Nine plus eight is sixteen.', ['Nine plus eight is seventeen.', 'Nine plus eight is seventeen']),
    ('b', 'I have 25 years.', ["I'm 25 years old.", 'I am 25 years old.']), ('c', 'She are from Australia.', ["She's from Australia.", 'She is from Australia.'])]),
  esc('ex3', 'Responda (use a informação entre parênteses)', 'Escolha a melhor resposta.', [('Is Rachel sad? (surprised)', '😮', ["No, she isn't. She's surprised.", "Yes, she is."], 0),
    ('Is Joey tired? (surprised)', '😲', ["No, he isn't. He's surprised.", 'Yes, he is tired.'], 0), ('Where are they? (at home)', '🏠', ["They're at home.", "They're home is."], 0)]),
 ], ('Describe a celebrity you admire.', 10, "This is … He's from … He's a …"),
 ['Revisar todo o Level 1.', 'Descrever uma pessoa: nome, idade, origem, profissão e família.', 'Gravar o desafio e postar marcando o perfil.'],
 ('Challenge', [('Quem é', ['This is …', 'His / Her name is …']), ('De onde', ["He's from …"]), ('O que faz', ["She's a singer"]), ('Família', ["He's married", 'They have 3 children']),
   ('Como é', ["He's very good", 'beautiful family'])]),
 [cref('Corrija a frase', 'ex2'), linhas('Desafio: descreva uma celebridade que você admira', 8)], 'challenge-level-1')
