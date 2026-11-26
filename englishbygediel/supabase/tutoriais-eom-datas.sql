-- englishbygediel · TUTORIAIS + MINI CURSO EOM + DATAS DE LIBERAÇÃO (do Tracker de Gravações)
-- Rode DEPOIS do modulos-conteudo-2026-11.sql. Pode rodar mais de uma vez (não duplica).
-- 2) Módulo "English On Mission — Mini Curso Bíblico" (5 aulas) + card dele no universo EOM.
-- 3) Datas de liberação (seg e qui, 9h) das aulas M2–M15, iguais às do tracker.
-- As aulas novas ficam NÃO publicadas: quando gravar e colocar o vídeo, é só marcar "publicada" no admin.
-- Botões nas descrições: linha "ir: area | Texto" abre uma área do app; "link: https://... | Texto" abre o link.

do $eom$ declare m uuid; begin
  select id into m from public.mi_modules where name = $t$English On Mission — Mini Curso Bíblico$t$ order by created_at limit 1;
  if m is null then
    insert into public.mi_modules (ord,name,sub,emoji,trilha,produto,checkout) values (90,$t$English On Mission — Mini Curso Bíblico$t$,$t$5 aulas · Gramática com a Bíblia$t$,$t$🙏$t$,'mini',$t$English on Mission$t$,$t$https://pay.kiwify.com.br/oIjfTK8$t$) returning id into m;
  end if;
  if not exists (select 1 from public.mi_lessons where module_id=m) then
    insert into public.mi_lessons (module_id,ord,title,description,published) values
    (m,1,$t$Verbo to be com Jeremias 29:11$t$,$t$🎯 Verbo to be (am, is, are) aprendido com Jeremias 29:11: "For I know the plans I have for you".

✅ Prática: escreva 3 frases sobre você com am / is / are.$t$,false),
    (m,2,$t$Simple Present com Provérbios 3:5$t$,$t$🎯 Simple Present (rotinas, verdades e hábitos) com Provérbios 3:5: "Trust in the Lord with all your heart".

✅ Prática: conte 3 coisas que você faz todo dia.$t$,false),
    (m,3,$t$There is e There are com Salmos 107:1$t$,$t$🎯 There is / There are (existir, haver) com Salmos 107:1: "Give thanks to the Lord, for he is good".

✅ Prática: descreva o seu quarto com there is / there are.$t$,false),
    (m,4,$t$Como fazer perguntas com Mateus 7:7$t$,$t$🎯 Como montar perguntas em inglês com Mateus 7:7: "Ask and it will be given to you".

✅ Prática: faça 5 perguntas sobre a vida de um amigo.$t$,false),
    (m,5,$t$A, AN ou THE com Hebreus 4:12$t$,$t$🎯 Artigos a, an e the com Hebreus 4:12: "For the word of God is alive and active".

✅ Prática: complete 5 frases com a / an / the.$t$,false);
  end if;
  if not exists (select 1 from public.mi_uni_cards where universo='eom' and acao='curso' and valor=m::text) then
    insert into public.mi_uni_cards (universo,ord,secao,titulo,descricao,tag,emoji,acao,valor,destaque,em_breve,ativo)
    values ('eom',3,'Assistir',$t$Mini Curso Bíblico$t$,$t$5 aulas de gramática com versículos: to be, Simple Present, there is/are, perguntas e artigos.$t$,'Assinatura',$t$🙏$t$,'curso',m::text,false,false,true);
  end if;
end $eom$;

-- datas de liberação das aulas M2–M15 (segunda e quinta, 9h de Brasília), iguais ao tracker
update public.mi_lessons l set release_at = (v.d::date)::timestamp + interval '12 hours'
from (values
  ($t$Diagnóstico & Personalização$t$,$t$Você Aprende Diferente — E Isso É Um Dom$t$,'2026-11-16'),
  ($t$Diagnóstico & Personalização$t$,$t$Seu Plano, Sua Velocidade$t$,'2026-11-19'),
  ($t$Sons & Pronúncia$t$,$t$Sons Que Sua Boca Nunca Fez$t$,'2026-11-23'),
  ($t$Sons & Pronúncia$t$,$t$Os Três Sons Que Mais Envergonham Brasileiros$t$,'2026-11-26'),
  ($t$Sons & Pronúncia$t$,$t$A, E, I — Mas Não Do Jeito Que Você Pensa$t$,'2026-11-30'),
  ($t$Sons & Pronúncia$t$,$t$Errou a Sílaba? A Frase Virou Outra$t$,'2026-12-03'),
  ($t$Sons & Pronúncia$t$,$t$Fala Com Ritmo, Não Com Palavras$t$,'2026-12-07'),
  ($t$Sons & Pronúncia$t$,$t$O Nativo Não Come Palavras — Ele Conecta$t$,'2026-12-10'),
  ($t$Sons & Pronúncia$t$,$t$Mesmo Frase, Tom Diferente — Significado Diferente$t$,'2026-12-14'),
  ($t$Sons & Pronúncia$t$,$t$Imite Até Virar: O Método do Espelho$t$,'2026-12-17'),
  ($t$Vocabulário Essencial$t$,$t$100 Palavras Que Resolvem Metade das Conversas$t$,'2026-12-21'),
  ($t$Vocabulário Essencial$t$,$t$Olá, Nice to Meet You — Sem Travar$t$,'2026-12-24'),
  ($t$Vocabulário Essencial$t$,$t$Quanto Custa? Que Horas São? Sem Hesitar$t$,'2026-12-28'),
  ($t$Vocabulário Essencial$t$,$t$My Family, My Home, My Day — O Inglês de Dentro$t$,'2026-12-31'),
  ($t$Vocabulário Essencial$t$,$t$Can I Have the Menu? — Peça, Escolha, Pague$t$,'2027-01-04'),
  ($t$Vocabulário Essencial$t$,$t$Where Is It? Como Chegar em Qualquer Lugar$t$,'2027-01-07'),
  ($t$Vocabulário Essencial$t$,$t$What Do You Do? — O Inglês Que Paga as Contas$t$,'2027-01-11'),
  ($t$Vocabulário Essencial$t$,$t$How Do You Feel? — Sentimentos Sem Rodeio$t$,'2027-01-14'),
  ($t$Gramática A1$t$,$t$SER BOM E ESTAR BEM — Afirmar e Negar$t$,'2027-01-18'),
  ($t$Gramática A1$t$,$t$SER BOM E ESTAR BEM — Perguntar, Responder e Praticar$t$,'2027-01-21'),
  ($t$Gramática A1$t$,$t$Todo Dia Aprendo Inglês$t$,'2027-01-25'),
  ($t$Gramática A1$t$,$t$Estou Fazendo, Estou Falando — O Que Acontece Agora$t$,'2027-01-28'),
  ($t$Gramática A1$t$,$t$O, A, Um, Uma — Em Inglês Também Tem Isso$t$,'2027-02-01'),
  ($t$Gramática A1$t$,$t$Um, Dois, Vários — O Plural Que Muda Tudo$t$,'2027-02-04'),
  ($t$Gramática A1$t$,$t$Consigo, Não Consigo, Pode Fazer?$t$,'2027-02-08'),
  ($t$Gramática A1$t$,$t$Meu, Seu, Dele — Sem Confusão$t$,'2027-02-11'),
  ($t$Gramática A1$t$,$t$O Quê? Onde? Por Quê? — Perguntas de Verdade$t$,'2027-02-15'),
  ($t$Gramática A2–B1$t$,$t$Aconteceu — Verbos Que Seguem as Regras$t$,'2027-02-18'),
  ($t$Gramática A2–B1$t$,$t$Aconteceu — Mas Não Seguiu as Regras (Verbos Irregulares)$t$,'2027-02-22'),
  ($t$Gramática A2–B1$t$,$t$Estava Acontecendo — O Passado Em Movimento$t$,'2027-02-25'),
  ($t$Gramática A2–B1$t$,$t$Vai Ser Assim? Vai Acontecer? — Sim ou Não$t$,'2027-03-01'),
  ($t$Gramática A2–B1$t$,$t$Já Fez Isso? Já Foi Lá? — Parte 1: Forma e Uso$t$,'2027-03-04'),
  ($t$Gramática A2–B1$t$,$t$Já Fez Isso? Já Foi Lá? — Parte 2: For, Since e Quando Usar$t$,'2027-03-08'),
  ($t$Gramática A2–B1$t$,$t$Maior, Menor, O Melhor De Todos$t$,'2027-03-11'),
  ($t$Gramática A2–B1$t$,$t$Precisa? Deve? Talvez? Pode Ser...$t$,'2027-03-15'),
  ($t$Gramática A2–B1$t$,$t$E Se Acontecer? — Planos e Condições Em Inglês$t$,'2027-03-18'),
  ($t$Gramática A2–B1$t$,$t$Mas, Por Isso, Mesmo Assim — O Inglês Que Flui$t$,'2027-03-22'),
  ($t$Conversação A1–A2$t$,$t$30 Frases Que Destravam Qualquer Conversa$t$,'2027-03-25'),
  ($t$Conversação A1–A2$t$,$t$Perdido? Como Pedir Ajuda Em Inglês$t$,'2027-03-29'),
  ($t$Conversação A1–A2$t$,$t$Fale Sobre Você Sem Travar$t$,'2027-04-01'),
  ($t$Conversação A1–A2$t$,$t$Ring Ring — Inglês Por Telefone e Vídeo$t$,'2027-04-05'),
  ($t$Conversação A1–A2$t$,$t$Um Dia Viajando Só Em Inglês$t$,'2027-04-08'),
  ($t$Conversação B1$t$,$t$Conta Bem — Como Prender Atenção Em Inglês$t$,'2027-04-12'),
  ($t$Conversação B1$t$,$t$Discordo, Mas Com Elegância$t$,'2027-04-15'),
  ($t$Conversação B1$t$,$t$Fé, Propósito e Valores — Em Inglês$t$,'2027-04-19'),
  ($t$Conversação B1$t$,$t$Sem Travar Sob Pressão — Entrevistas e Imprevistos$t$,'2027-04-22'),
  ($t$Listening & Compreensão$t$,$t$Por Que Você Não Entende — E Como Mudar$t$,'2027-04-26'),
  ($t$Listening & Compreensão$t$,$t$Aprenda Ouvindo Música — Do Jeito Certo$t$,'2027-04-29'),
  ($t$Listening & Compreensão$t$,$t$Séries e Filmes Como Sala de Aula$t$,'2027-05-03'),
  ($t$Listening & Compreensão$t$,$t$Podcasts Na Velocidade Real$t$,'2027-05-06'),
  ($t$Listening & Compreensão$t$,$t$Inglês Britânico, Americano e Mais — Qual Dá Pra Entender?$t$,'2027-05-10'),
  ($t$Phrasal Verbs$t$,$t$Por Que Phrasal Verbs Parecem Impossíveis — E Como Parar De Sofrer$t$,'2027-05-13'),
  ($t$Phrasal Verbs$t$,$t$Get Up, Wake Up, Work Out — O Inglês Da Sua Manhã$t$,'2027-05-17'),
  ($t$Phrasal Verbs$t$,$t$Get Along, Break Up, Hang Out — Inglês Dos Relacionamentos$t$,'2027-05-20'),
  ($t$Phrasal Verbs$t$,$t$Set Up, Carry Out, Put Off — O Inglês Do Trabalho$t$,'2027-05-24'),
  ($t$Phrasal Verbs$t$,$t$Separa ou Não? A Regra Que Ninguém Conta$t$,'2027-05-27'),
  ($t$Phrasal Verbs$t$,$t$Os 25 Que Todo Mundo Usa — Revisão Final$t$,'2027-05-31'),
  ($t$Idioms & Expressões$t$,$t$Fala Como Nativo — Expressões Do Dia a Dia$t$,'2027-06-03'),
  ($t$Idioms & Expressões$t$,$t$Money Talks — Idioms De Negócios E Dinheiro$t$,'2027-06-07'),
  ($t$Idioms & Expressões$t$,$t$Coração Cheio, Coração Partido — Idioms De Sentimento$t$,'2027-06-10'),
  ($t$Idioms & Expressões$t$,$t$Que É Isso? As Gírias Que Você Precisa Conhecer$t$,'2027-06-14'),
  ($t$Idioms & Expressões$t$,$t$A Bíblia Em Inglês — Provérbios Que Sobreviveram$t$,'2027-06-17'),
  ($t$Inglês pela Música$t$,$t$Música Não É Karaokê — O Método Que Funciona$t$,'2027-06-21'),
  ($t$Inglês pela Música$t$,$t$Canta, Mas Presta Atenção — Pronúncia Pela Música$t$,'2027-06-24'),
  ($t$Inglês pela Música$t$,$t$O Que a Letra Esconde — Gramática Na Música$t$,'2027-06-28'),
  ($t$Inglês pela Música$t$,$t$Worship Em Inglês — Adorar Sem Barreira de Idioma$t$,'2027-07-01'),
  ($t$Inglês por Séries$t$,$t$Legenda Sim ou Não? A Estratégia Certa$t$,'2027-07-05'),
  ($t$Inglês por Séries$t$,$t$Repete a Cena — A Técnica Que Muda Tudo$t$,'2027-07-08'),
  ($t$Inglês por Séries$t$,$t$Anota Sem Parar o Episódio$t$,'2027-07-12'),
  ($t$Inglês por Séries$t$,$t$Do Ouvido Pra Boca — Ativar O Que Você Já Entende$t$,'2027-07-15'),
  ($t$Business English$t$,$t$Tô Na Reunião E Agora? Como Participar Em Inglês$t$,'2027-07-19'),
  ($t$Business English$t$,$t$Manda Bem No E-mail — Profissional, Claro, Sem Erro$t$,'2027-07-22'),
  ($t$Business English$t$,$t$Vende, Apresenta, Convence — Em Inglês$t$,'2027-07-26'),
  ($t$Business English$t$,$t$Me Contrata — A Entrevista Em Inglês$t$,'2027-07-29'),
  ($t$Business English$t$,$t$Fecha o Negócio — Negociação e Networking$t$,'2027-08-02'),
  ($t$Escrita em Inglês$t$,$t$Posta Sem Medo — Inglês Nas Redes Sociais$t$,'2027-08-05'),
  ($t$Escrita em Inglês$t$,$t$Escreve Claro — Do Parágrafo Ao Texto$t$,'2027-08-09'),
  ($t$Escrita em Inglês$t$,$t$IA Corrige, Mas Você Decide$t$,'2027-08-12')
) as v(modulo,titulo,d), public.mi_modules mo
where mo.name = v.modulo and l.module_id = mo.id and l.title = v.titulo;
