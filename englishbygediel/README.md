# englishbygediel · catálogo

Landing em formato de catálogo, estilo streaming: a pessoa escolhe um perfil, deixa os dados, assiste a uma abertura em stories e só então entra no catálogo. A Mentoria Inglês Inteligente é a porta principal; os conteúdos gratuitos ficam como bônus.

## A jornada

1. **Entrada.** "Qual é o foco de hoje?" com 5 perfis (fala, trabalho, viagem, fé, do zero). Um toque e a pessoa já está no catálogo. Quem chega por um link de perfil com foco definido (`?de=eom`, `?de=viagens`), por um link direto (`&ir=`) ou já escolheu antes pula a pergunta.
2. **Cadastro na hora do bônus.** Nome, WhatsApp, Instagram e e-mail (os dois últimos opcionais) são pedidos só quando a pessoa quer um bônus grátis: teste de nível, teste Prisma ou grupos do WhatsApp. Depois do cadastro o bônus abre na hora. Compra e "Tirar dúvida" no WhatsApp nunca são travados. O lead vai para a Supabase com o foco e com tudo o que a pessoa já tinha aberto antes.
3. **Catálogo.** A vitrine da Mentoria (com o botão da vaga), a barra "O que você procura?" e as fileiras: *Escolhido pra você* (ordenada pelo perfil), *Programa Inteligente*, *Quem já passou por aqui* (depoimentos em vídeo), *English On Mission*, *Culture English*, *Intercâmbio e Viagens*, *Bônus gratuitos* e *Também do Gediel*. As trilhas da área de membros aparecem trancadas: só abrem para quem entra na mentoria.
4. **Ficha.** Cada card abre uma ficha com o botão certo: checkout da Hotmart, WhatsApp com mensagem pronta, Instagram ou o teste de nível.

A ficha da Mentoria funciona como uma página de venda curta: para quem é, o que está incluído, etapas, depoimentos, objeções, o que acontece depois de entrar, preço com garantia e os botões de vaga e WhatsApp de novo no fim.

Quem volta ao link cai direto no catálogo. A foto do perfil no topo troca o foco. Os stories de abertura estão desligados (o código continua em `app.js`, em `abrirHistoria`).

## Links da bio (um por perfil)

Troque `SEU-LINK` pelo endereço publicado (ex.: `englishbygediel.netlify.app`).

| Perfil | Link | O que muda |
| --- | --- | --- |
| @englishbygediel | `SEU-LINK/?de=ebg` | Fluxo completo: cadastro, foco, stories, catálogo |
| @englishonmission | `SEU-LINK/?de=eom` | Boas-vindas do EOM, foco "Inglês cristão" já escolhido, fileira English On Mission sobe |
| @metodoinglesinteligente | `SEU-LINK/?de=metodo` | Boas-vindas do Método, atalhos começam pelo Prisma e pelo teste de nível |
| @escolainfly | `SEU-LINK/?de=escola` | Boas-vindas da escola, atalhos começam pela Escola Infly |
| @inflyviagens | `SEU-LINK/?de=viagens` | Boas-vindas da Infly Viagens, foco "Viagem", fileira Intercâmbio sobe |

**Links diretos** (stories, posts, anúncios): acrescente `&ir=` para cair direto no que a pessoa veio buscar, sem os stories. Exemplos: `?de=viagens&ir=toronto`, `?de=metodo&ir=prisma`, `?ir=teste`, `?ir=mentoria`, `?de=eom&ir=grupos`. Valores aceitos: `mentoria`, `teste` (ou `bussola`), `prisma`, `toronto`, `vlogs`, `particular`, `escola`, `viagens`, `eom`, `grupos`, `intercambio`, `alunos`, `programa`, `culture`, `extras`.

O `de` e o `ir` ficam salvos no lead (coluna `origem`), então dá pra ver na Supabase qual perfil e qual link trazem mais gente.

## Arquivos

| Arquivo | O que tem |
| --- | --- |
| `config.js` | Chaves da Supabase, WhatsApp, link da Hotmart, vídeo de apresentação e Instagrams. **Comece por aqui.** |
| `content.js` | Todo o texto: perfis, stories, cards, preço, perguntas e o teste de nível. |
| `index.html` · `styles.css` · `app.js` | A página. Sem framework, carrega rápido no 4G. |
| `fonts/` | Coloque aqui a Advercase licenciada como `advercase.woff2` (ou `.otf`). Sem ela, a pergunta usa a Instrument Serif. |
| `img/` | Fotos reais (landing antiga e Central), já em WebP. |
| `supabase/schema.sql` | As tabelas `leads` e `events` e a visão `painel_leads`. |

## Ligar a Supabase (5 minutos)

1. Crie um projeto em supabase.com.
2. **SQL Editor → New query**: cole o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. **Project Settings → API**: copie a *Project URL* e a chave *anon public* para `config.js`.
4. Pronto. Para ver os contatos, abra **Table Editor → painel_leads**: nome, WhatsApp, Instagram, perfil, nível do teste, o que a pessoa abriu e se clicou na mentoria.

O site só consegue **inserir**. Ninguém de fora lê, edita ou apaga os dados. Sem internet, os registros ficam guardados no aparelho da pessoa e sobem na próxima visita.

## Publicar

É um site estático. No Netlify, arraste a pasta `englishbygediel` em *Add new site → Deploy manually*, ou aponte um site para este repositório com a pasta `englishbygediel` como diretório de publicação.

Para testar só o catálogo, sem cadastro: abra o link com `?catalogo` no final.

Links de anúncio podem levar `?utm_source=instagram&utm_campaign=live`; isso fica salvo no lead. O checkout da Hotmart recebe `sck=catalogo_<perfil>`, para você ver na Hotmart de qual perfil veio cada venda.

## Conferir antes de lançar

- **WhatsApp:** na landing antiga estava `55999895429`, sem o 55 do Brasil antes do DDD. Aqui está `5555999895429`. Confirme.
- **Live gratuita de terça:** o botão pede o link pelo WhatsApp. Se houver página ou grupo, troque em `content.js` (`liveterca`).
- **English On Mission, Escola Infly e Infly Viagens:** apontam para os Instagrams. Troque em `config.js` se houver site.
- **Preço e garantia** vieram da landing antiga (6x de R$ 297, 6 meses, 7 dias).
