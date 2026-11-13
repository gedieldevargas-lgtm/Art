# Livro da aula

O livro interativo aparece ao lado do vídeo no PC e embaixo do vídeo no celular. Junto vem um e-book em PDF para baixar.

## Arquivos
- `livro.js` e `livro.css`: o motor. É o mesmo para todas as aulas.
- `aulas/unit-XX.js`: o conteúdo de uma aula (revisão, exercícios, missão e e-book).
- `ebook.html?u=unit-XX`: monta o e-book em A4. Também dá para imprimir ou salvar em PDF pelo navegador.
- `pdf/unit-XX-....pdf`: o PDF pronto que o aluno baixa.
- `index.html?u=unit-XX`: prévia sem login.

## Como ligar o livro a uma aula
No admin da área de membros, na **Descrição da aula**, escreva uma linha assim:

```
livro: unit-01
```

O aluno não vê essa linha.

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
