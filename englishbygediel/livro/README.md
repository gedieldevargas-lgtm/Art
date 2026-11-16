# Livro da aula

O livro interativo aparece ao lado do vídeo no PC e embaixo do vídeo no celular. Junto vem um e-book em PDF para baixar.

## Arquivos
- `livro.js` e `livro.css`: o motor. É o mesmo para todas as aulas.
- `aulas/unit-XX.js`: o conteúdo de uma aula (revisão, exercícios, missão e e-book).
- `ebook.html?u=unit-XX`: monta o e-book em A4. Também dá para imprimir ou salvar em PDF pelo navegador.
- `pdf/unit-XX-....pdf`: o PDF pronto que o aluno baixa.
- `index.html?u=unit-XX`: prévia sem login.

## Como ligar o livro a uma aula (automático)
Coloque o número da unidade no **título** da aula, por exemplo "Unit 16 - Prepositions of time".
A área de membros acha `aulas/unit-16.js` sozinha e mostra o livro e o botão do PDF. Se a aula não tiver livro, só o vídeo aparece.
Também dá para forçar pela descrição com uma linha `livro: unit-16`.

## Gerar ou atualizar as aulas
- O conteúdo das 31 unidades está em `gerar/level1.py`, `gerar/level2.py` e `gerar/level3.py`. Para gerar, rode `python3 livro/gerar/level1.py` (e os outros).
- Para os PDFs, deixe o servidor rodando dentro de `englishbygediel` com `python3 -m http.server 8792` e rode `node livro/gerar/pdfs.mjs`. Para gerar só algumas, passe os ids: `node livro/gerar/pdfs.mjs unit-16`.

## Nova aula (fluxo)
1. Gediel grava a aula e manda a transcrição e o número da unidade.
2. Criar `aulas/unit-XX.js` copiando o `unit-01.js`. O conteúdo vem só do e-book, da transcrição ou da internet, quando autorizado.
3. Gerar o PDF a partir de `ebook.html?u=unit-XX&pdf=1`, usando o Playwright com `page.pdf` em A4 e `printBackground`.
4. Escrever `livro: unit-XX` na descrição da aula.

## Tipos de exercício
- `ditado`: ouve e escreve.
- `escolha`: múltipla escolha, com emoji opcional.
- `montar`: ouve a pergunta e monta a resposta com as palavras.
- `conversa`: passa as falas do português para o inglês, aceitando várias respostas certas.

A correção ignora maiúsculas e pontuação e aceita formas contraídas (I'm = I am). Se a resposta tiver um pequeno erro de escrita, o aluno vê "Quase!".
