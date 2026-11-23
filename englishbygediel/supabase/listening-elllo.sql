-- Aulas de LISTENING (catálogo elllo.org), cada uma no módulo do conteúdo certo.
-- Vídeo: embed do YouTube. Áudio: MP3 tocando do elllo.org (não hospedado). Transcrição: só o link.
-- Cole no SQL Editor do Supabase (projeto dos membros) e clique Run. Pode rodar mais de uma vez.
do $blk$
declare m uuid;
begin
  select id into m from public.mi_modules where name = $t$Gramática A1$t$ order by created_at limit 1;
  if m is not null then
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Be Verbs - Introductions$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,200,$t$🎧 Listening (A1): Be Verbs - Introductions$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Be Verbs - Introductions.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-01-AimeeTodd-Intros-BeVerb.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-001$t$,$t$https://www.youtube.com/watch?v=3ielOb6ztVY$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Likes and Favorites$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,201,$t$🎧 Listening (A1): Likes and Favorites$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Likes and Favorites.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-02-NatTodd-Farorites.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-002$t$,$t$https://www.youtube.com/watch?v=7STtfJar73c$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Basic Verbs$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,202,$t$🎧 Listening (A1): Basic Verbs$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Basic Verbs.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-03-ShantelTodd-Weekend-BasicVerbs.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-003$t$,$t$https://www.youtube.com/watch?v=xBYASXpstjs$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Subject Pronouns$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,203,$t$🎧 Listening (A1): Subject Pronouns$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Subject Pronouns.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-09-ShantelTodd-Celebrities-SubjectPronoun.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-008$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Object Pronouns$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,204,$t$🎧 Listening (A1): Object Pronouns$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Object Pronouns.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-10-ShantelTodd-Family-ObjectPronouns.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-009$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Demonstrative Pronouns$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,205,$t$🎧 Listening (A1): Demonstrative Pronouns$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Demonstrative Pronouns.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-11-NatTodd-This-That-3.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-010$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Adjectives and Adverbs of Intensity$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,206,$t$🎧 Listening (A1): Adjectives and Adverbs of Intensity$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Adjectives and Adverbs of Intensity.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-12-NatTodd-Adjectives.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-011$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Present Simple - Be Verbs$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,207,$t$🎧 Listening (A1): Present Simple - Be Verbs$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Present Simple - Be Verbs.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L2-01-AimeeTodd-Intros-BeVerb.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-014$t$,$t$https://www.youtube.com/watch?v=RM4AsIawZ9E$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Articles$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,208,$t$🎧 Listening (A1): Articles$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Articles.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L2-04-AimeeTodd-House-HowMuch-many.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-015$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Present Continuous - Where is everyone?$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,209,$t$🎧 Listening (A2): Present Continuous - Where is everyone?$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Foco de gramática: Present Continuous - Where is everyone?.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L3-03-present-continuous.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-016$t$,null,'[]'::jsonb,true);
    end if;
  end if;
  select id into m from public.mi_modules where name = $t$Vocabulário Essencial$t$ order by created_at limit 1;
  if m is not null then
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Colors$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,200,$t$🎧 Listening (A1): Colors$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Colors.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-04-MegTodd-Colors.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-004$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Adjectives$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,201,$t$🎧 Listening (A1): Adjectives$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Adjectives.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-05-MegTodd-Cities-Adjective.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-005$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Days of the Week$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,202,$t$🎧 Listening (A1): Days of the Week$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Days of the Week.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-06-MegTodd-Days-of-Week-Busy.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-006$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Languages, Nationalities and Countries$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,203,$t$🎧 Listening (A1): Languages, Nationalities and Countries$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Languages, Nationalities and Countries.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-07-AbidemiTodd-Languages.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-007$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Months and Time Prepositions$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,204,$t$🎧 Listening (A1): Months and Time Prepositions$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Months and Time Prepositions.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-13-MegTodd-Holidays.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-012$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A1): Ordinals$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,205,$t$🎧 Listening (A1): Ordinals$t$,$t$🎯 Prática de listening (A1) com uma conversa real de falantes nativos.

Foco de gramática: Ordinals.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L1-14Todd-Nat-Ordinals.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-013$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Adjectives$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,206,$t$🎧 Listening (A2): Adjectives$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Foco de gramática: Adjectives.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L3-08-Adjectives.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-018$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Love it / Hate it$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,207,$t$🎧 Listening (A2): Love it / Hate it$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Foco de gramática: Gerunds.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1504-MegTodd-FreeTime-Gerunds.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-020$t$,$t$https://www.youtube.com/watch?v=FW0henUS1p4$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Saving and Wasting Money$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,208,$t$🎧 Listening (A2): Saving and Wasting Money$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: dinheiro.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1503-Abidemi-SavingMoney.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-021$t$,$t$https://www.youtube.com/watch?v=0ZaQUdS7sCU$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Pack Rat$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,209,$t$🎧 Listening (A2): Pack Rat$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Foco de gramática: Much / Many.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1502-Meg-PackRat-Many-Much.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-022$t$,$t$https://www.youtube.com/watch?v=REH2n_jZV1I$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): At the Mall$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,210,$t$🎧 Listening (A2): At the Mall$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: compras.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1501-KatieTodd-MallShops-Places.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-023$t$,$t$https://www.youtube.com/watch?v=BrN9S84DQWs$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): A Typical Day$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,211,$t$🎧 Listening (A2): A Typical Day$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Foco de gramática: Adverbs of frequency.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1452-AimeeTodd-Routines.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-025$t$,$t$https://www.youtube.com/watch?v=6m0dN_muOP4$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): My English Family$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,212,$t$🎧 Listening (A2): My English Family$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: família.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1467-Katie-Family.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-026$t$,$t$https://www.youtube.com/watch?v=Zzg2d0AG1Kk$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): House on Loan$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,213,$t$🎧 Listening (A2): House on Loan$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: casa.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1460-Katie-RentHouse.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-029$t$,$t$https://www.youtube.com/watch?v=Ge6NCLMkJ5E$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Farm Animals$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,214,$t$🎧 Listening (A2): Farm Animals$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: animais.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1401/1425-MegTodd-Animals-Farm.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-032$t$,$t$https://www.youtube.com/watch?v=o5oSo3o0fjM$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Disc Golf$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,215,$t$🎧 Listening (A2): Disc Golf$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: esportes.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1401/1402-John-Golf.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-034$t$,$t$https://www.youtube.com/watch?v=7i7NmC2daac$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Mari's Favorite Foods$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,216,$t$🎧 Listening (A2): Mari's Favorite Foods$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: comida.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/0901/T939-Mari-Food.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-038$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Middle School$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,217,$t$🎧 Listening (A2): Middle School$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: escola.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/0901/T931-Naomi-School.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-039$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Mari's Abilities$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,218,$t$🎧 Listening (A2): Mari's Abilities$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: habilidades.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/0901/T916-Mari-Ability.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-040$t$,null,'[]'::jsonb,true);
    end if;
  end if;
  select id into m from public.mi_modules where name = $t$Gramática A2–B1$t$ order by created_at limit 1;
  if m is not null then
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Going To$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,200,$t$🎧 Listening (A2): Going To$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Foco de gramática: Going To.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L3-05-GoingTo-Spain.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-017$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Comparatives$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,201,$t$🎧 Listening (A2): Comparatives$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Foco de gramática: Comparatives.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L3-09-Comparatives.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-019$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Do for Emphasis$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,202,$t$🎧 Listening (B1): Do for Emphasis$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Foco de gramática: Do for Emphasis.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L4-01-Do-Emphasis.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-041$t$,$t$https://www.youtube.com/watch?v=qhmqF4o5jeQ$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Causative Verbs$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,203,$t$🎧 Listening (B1): Causative Verbs$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Foco de gramática: Causative Verbs.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L4-02-Causative-Verbs.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-042$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Used to$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,204,$t$🎧 Listening (B1): Used to$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Foco de gramática: Used to.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L4-03-Used-To.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-043$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Would for Past Tense$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,205,$t$🎧 Listening (B1): Would for Past Tense$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Foco de gramática: Would for Past Tense.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L4-04-Would-Past.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-044$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Should for Suggestions$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,206,$t$🎧 Listening (B1): Should for Suggestions$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Foco de gramática: Should for Suggestions.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L4-05-Should-Suggestions.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-045$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Zero Conditionals$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,207,$t$🎧 Listening (B1): Zero Conditionals$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Foco de gramática: Zero Conditionals.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L4-09-Zero-Conditionals.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-046$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Second Conditional$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,208,$t$🎧 Listening (B2): Second Conditional$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Foco de gramática: Second Conditional.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/grammar/L5-05-Second-Conditional.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-062$t$,null,'[]'::jsonb,true);
    end if;
  end if;
  select id into m from public.mi_modules where name = $t$Conversação A1–A2$t$ order by created_at limit 1;
  if m is not null then
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): My English Town$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,200,$t$🎧 Listening (A2): My English Town$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: cidades.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1468-Katie-Torquay.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-024$t$,$t$https://www.youtube.com/watch?v=4vl7AajOQP4$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): SEA Travels - Vietnam and Myanmar$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,201,$t$🎧 Listening (A2): SEA Travels - Vietnam and Myanmar$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: viagem.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1464-AbidemiTodd-SEA2.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-027$t$,$t$https://www.youtube.com/watch?v=4VY8joQbj5I$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): SEA Travels - Thailand and Laos$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,202,$t$🎧 Listening (A2): SEA Travels - Thailand and Laos$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: viagem.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1463-Abidemi-Todd-SEA1.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-028$t$,$t$https://www.youtube.com/watch?v=C28jVkRm36A$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Meg has to move$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,203,$t$🎧 Listening (A2): Meg has to move$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: mudança.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1459-MegTodd-HaveToMove.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-030$t$,$t$https://www.youtube.com/watch?v=-zLlRlr4yhs$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): How International are you?$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,204,$t$🎧 Listening (A2): How International are you?$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: cultura.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1457-KatieTodd-InternationalTest.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-031$t$,$t$https://www.youtube.com/watch?v=xap64D9PAyc$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): 20 Years Abroad$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,205,$t$🎧 Listening (A2): 20 Years Abroad$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: viver fora.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1401/1406-MegTodd-Travel-Thailand.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-033$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Super City$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,206,$t$🎧 Listening (A2): Super City$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Foco de gramática: Superlatives.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1351/T1353-TS-SanFranciscoSuperlatives.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-035$t$,$t$https://www.youtube.com/watch?v=AFofVdat3M0$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): City Down Under$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,207,$t$🎧 Listening (A2): City Down Under$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: cidades.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1301/T1346-Shirley-Melbourne.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-036$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (A2): Travel Tips For Portugal$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,208,$t$🎧 Listening (A2): Travel Tips For Portugal$t$,$t$🎯 Prática de listening (A2) com uma conversa real de falantes nativos.

Tema: viagem.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1301/T1304-Ana-PortugalTips.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-037$t$,null,'[]'::jsonb,true);
    end if;
  end if;
  select id into m from public.mi_modules where name = $t$Conversação B1$t$ order by created_at limit 1;
  if m is not null then
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Media - Then and Now$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,200,$t$🎧 Listening (B1): Media - Then and Now$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: mídia.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1470-MegTodd-CompareMedia.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-047$t$,$t$https://www.youtube.com/watch?v=EIIUO_HY7jA$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Nepal Travel Tips$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,201,$t$🎧 Listening (B1): Nepal Travel Tips$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: viagem.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1462-Jin-Nepal-Tips.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-048$t$,$t$https://www.youtube.com/watch?v=i7CIm-LHxgQ$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Nepal by Region$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,202,$t$🎧 Listening (B1): Nepal by Region$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: geografia.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1461-Jin-Nepal.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-049$t$,$t$https://www.youtube.com/watch?v=-wR7pYOXB0o$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Life in the Arctic$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,203,$t$🎧 Listening (B1): Life in the Arctic$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: cultura.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1454-AbidemiTodd-Innuits.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-050$t$,$t$https://www.youtube.com/watch?v=CRHoPdASwdI$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Life Happens Up North$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,204,$t$🎧 Listening (B1): Life Happens Up North$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: cultura.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1453-Abidemi-Todd-Innuits.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-051$t$,$t$https://www.youtube.com/watch?v=wchp3Xm6KlI$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): The Right Age$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,205,$t$🎧 Listening (B1): The Right Age$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: tecnologia e filhos.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1401/1448-Katie-Phone.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-052$t$,$t$https://www.youtube.com/watch?v=n3SeZ441PjQ$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Food We Hate$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,206,$t$🎧 Listening (B1): Food We Hate$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: comida.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1401/1424-KatieGilda-FoodWeHate.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-053$t$,$t$https://www.youtube.com/watch?v=gtIvnXkGTkE$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Hotel for Her$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,207,$t$🎧 Listening (B1): Hotel for Her$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: hotel.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1201/1236-Erina-Hotel.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-054$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Hotel for Him$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,208,$t$🎧 Listening (B1): Hotel for Him$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: hotel.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1201/1235-Mike-Hotel.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-055$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): New Gym$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,209,$t$🎧 Listening (B1): New Gym$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: academia.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1201/1230-Rebecca-Gym.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-056$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Teen Host$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,210,$t$🎧 Listening (B1): Teen Host$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: rádio.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1101/1121-Shifani-Radio.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-057$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): His Dreams$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,211,$t$🎧 Listening (B1): His Dreams$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: sonhos e carreira.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1101/1118-Dream-Warren.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-058$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Her Dreams$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,212,$t$🎧 Listening (B1): Her Dreams$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: sonhos e carreira.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1101/1117-Dream-Lindsay.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-059$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): Paul Bunyan$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,213,$t$🎧 Listening (B1): Paul Bunyan$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: folclore.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1001/1017-Jake-Bunyan.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-060$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B1): The Break Up$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,214,$t$🎧 Listening (B1): The Break Up$t$,$t$🎯 Prática de listening (B1) com uma conversa real de falantes nativos.

Tema: relacionamentos.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/0951/T988-George-BreakUp.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-061$t$,null,'[]'::jsonb,true);
    end if;
  end if;
  select id into m from public.mi_modules where name = $t$Listening & Compreensão$t$ order by created_at limit 1;
  if m is not null then
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Bangkok Shopping$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,200,$t$🎧 Listening (B2): Bangkok Shopping$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: compras.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1520-Jerri-Fashion.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-063$t$,$t$https://www.youtube.com/watch?v=AmP4F7eovpo$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Bangkok Transportation - Part 2$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,201,$t$🎧 Listening (B2): Bangkok Transportation - Part 2$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: transporte.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1519-Jerri-Transportation.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-064$t$,$t$https://www.youtube.com/watch?v=vibWXv3mivU$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Bangkok Transportation - Part 1$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,202,$t$🎧 Listening (B2): Bangkok Transportation - Part 1$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: transporte.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1518-Jerri-Transportation.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-065$t$,$t$https://www.youtube.com/watch?v=HXjnFKfN-wQ$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Island Stress$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,203,$t$🎧 Listening (B2): Island Stress$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: turismo.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1517-Jerri-Island-Stress.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-066$t$,$t$https://www.youtube.com/watch?v=TlNOp06SVOA$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Tourism in Thailand$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,204,$t$🎧 Listening (B2): Tourism in Thailand$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: turismo.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1516-Jerri-Islands.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-067$t$,$t$https://www.youtube.com/watch?v=gZPY8EVKpJo$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Kids and Boredom$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,205,$t$🎧 Listening (B2): Kids and Boredom$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: filhos.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1515-Angela-Kids-and-Boredom.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-068$t$,$t$https://www.youtube.com/watch?v=e3zxMrrt6tM$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Empty Nest$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,206,$t$🎧 Listening (B2): Empty Nest$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: família.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1513-Angela-Families.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-070$t$,$t$https://www.youtube.com/watch?v=Kvla_DXTEB8$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Student Life in China Part 2$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,207,$t$🎧 Listening (B2): Student Life in China Part 2$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: educação.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1510-Rufei-ChinaStudents.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-071$t$,$t$https://www.youtube.com/watch?v=YUtH2o1dceU$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Alternative Education$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,208,$t$🎧 Listening (B2): Alternative Education$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: educação.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1508-Gyri-Viyasan-School-Norway.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-072$t$,$t$https://www.youtube.com/watch?v=Mw68vkBfoq4$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Student Life in China Part 1$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,209,$t$🎧 Listening (B2): Student Life in China Part 1$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: educação.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1509-Rufei-ChinaStudents.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-073$t$,$t$https://www.youtube.com/watch?v=lB9o4RUFYdI$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Favorite Celebrities$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,210,$t$🎧 Listening (B2): Favorite Celebrities$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: celebridades.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1506-Ben-Hanna-Celebrity.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-074$t$,$t$https://www.youtube.com/watch?v=-du_sfUhO4k$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Soccer Moms$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,211,$t$🎧 Listening (B2): Soccer Moms$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: família.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1201/1223-Todd-SoccerMom.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-079$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Born to Run$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,212,$t$🎧 Listening (B2): Born to Run$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: esportes.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1151/T1200-Julia-Sport.html

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-080$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Character Changes$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,213,$t$🎧 Listening (B2): Character Changes$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: personalidade.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1151/T1184-Maria-Peronsality.html

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-081$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Eggplant Curry$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,214,$t$🎧 Listening (B2): Eggplant Curry$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: comida.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1001/1043-Nabil-Curry.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-082$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Countries United$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,215,$t$🎧 Listening (B2): Countries United$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: países.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1001/1027-Shirley-UK.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-083$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): The Big Mix$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,216,$t$🎧 Listening (B2): The Big Mix$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: história e cultura.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1001/1015-MixPop.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-084$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Winning$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,217,$t$🎧 Listening (B2): Winning$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: esportes.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1001/1006-Winning.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-085$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Street Food$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,218,$t$🎧 Listening (C1): Street Food$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: comida.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1512-Natalie-StreetFood.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-086$t$,$t$https://www.youtube.com/watch?v=kudBR4JBMzw$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Bustling Bangkok$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,219,$t$🎧 Listening (C1): Bustling Bangkok$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: cidades.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1511-Natalie-Bangkok.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-087$t$,$t$https://www.youtube.com/watch?v=j8ozpyhpmbs$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Giving Gifts$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,220,$t$🎧 Listening (C1): Giving Gifts$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: presentes.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1472-Aimee-Give-Gifts.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-088$t$,$t$https://www.youtube.com/watch?v=F6UvLi81gvA$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Black Friday$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,221,$t$🎧 Listening (C1): Black Friday$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: compras.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1471-Aimee-BlackFriday.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-089$t$,$t$https://www.youtube.com/watch?v=FnAfnnDgd0g$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Brain Drain$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,222,$t$🎧 Listening (C1): Brain Drain$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: migração.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1456-Pernais-BrainDrain.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-092$t$,$t$https://www.youtube.com/watch?v=Z6QZGe0KlQQ$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Out of Country$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,223,$t$🎧 Listening (C1): Out of Country$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: migração.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1455-Pernais-OutOfCountry.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-093$t$,$t$https://www.youtube.com/watch?v=onoiAcgxY2c$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Sleeping Patterns$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,224,$t$🎧 Listening (C1): Sleeping Patterns$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: sono e sonhos.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1351/T1373-SarahTodd-01-Sleep.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-094$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): His Do Over$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,225,$t$🎧 Listening (C1): His Do Over$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: arrependimentos.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1351/T1365-AdamSarah-01-DoOver.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-096$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): New York Tips$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,226,$t$🎧 Listening (C1): New York Tips$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: viagem.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1351/T1363-Warren-NewYork.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-097$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Slow Travel$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,227,$t$🎧 Listening (C1): Slow Travel$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: viagem.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1301/T1325-Dan-Slowtravel.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-098$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Single's Day$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,228,$t$🎧 Listening (C1): Single's Day$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: datas comemorativas.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1301/T1348-Rory-Holidays.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-100$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): E-Mail Habits$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,229,$t$🎧 Listening (C1): E-Mail Habits$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: tecnologia.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1301/T1341-amy-email-habits.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-101$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Pet Peeves on the Bus$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,230,$t$🎧 Listening (C1): Pet Peeves on the Bus$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: transporte.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1301/T1339-Jeremy-Bus.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-102$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): You know a good place?$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,231,$t$🎧 Listening (C1): You know a good place?$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: restaurante.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1301/T1315-Josh-Restaurant.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-103$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Shockingly Different$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,232,$t$🎧 Listening (C1): Shockingly Different$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: choque cultural.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1301/T1320-Abidemi-Differences.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-104$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): First Memories of Canada$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,233,$t$🎧 Listening (C1): First Memories of Canada$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: migração.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1301/T1319-Abidemi-Canada.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-105$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Breaking Bad Habits$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,234,$t$🎧 Listening (C2): Breaking Bad Habits$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: saúde.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1498-Olga-Health-4Habits.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-108$t$,$t$https://www.youtube.com/watch?v=biNWv0gNU_A$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Health Coach$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,235,$t$🎧 Listening (C2): Health Coach$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: saúde.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1491-Olga-Health-3-things.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-109$t$,$t$https://www.youtube.com/watch?v=JAGxAzOZvho$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Change Climate Change$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,236,$t$🎧 Listening (C2): Change Climate Change$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: meio ambiente.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1301/T1302-amy-change-climate.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-110$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Climate Change$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,237,$t$🎧 Listening (C2): Climate Change$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: meio ambiente.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1301/T1301-amy-climate-change.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-111$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Fashion Sense$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,238,$t$🎧 Listening (C2): Fashion Sense$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: roupas.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1251/1299-Spencer-Curtis-ComfortClothing.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-112$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Life on the Road$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,239,$t$🎧 Listening (C2): Life on the Road$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: viagem.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1201/1249-Todd-Life.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-113$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Shipwrecks$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,240,$t$🎧 Listening (C2): Shipwrecks$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: mar e história.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1201/1222-Peter-Ships.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-115$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Road Rage$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,241,$t$🎧 Listening (C2): Road Rage$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: trânsito.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1151/T1171-Nathan-Rage.html

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-116$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Cambodia Road Trip Part 1$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,242,$t$🎧 Listening (C2): Cambodia Road Trip Part 1$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: viagem.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1151/T1167-Julia-Trips1.html

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-117$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Welfare$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,243,$t$🎧 Listening (C2): Welfare$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: sociedade.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1051/1094-Todd-Welfare.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-118$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Banned by Customs$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,244,$t$🎧 Listening (C2): Banned by Customs$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: alfândega.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1051/1053-Ray-CustomBan.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-119$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Organ Donation$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,245,$t$🎧 Listening (C2): Organ Donation$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: ética.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/0951/T985-Greg-Organs.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-120$t$,null,'[]'::jsonb,true);
    end if;
  end if;
  select id into m from public.mi_modules where name = $t$Business English$t$ order by created_at limit 1;
  if m is not null then
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Family Money Flow$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,200,$t$🎧 Listening (B2): Family Money Flow$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: família e dinheiro.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1514-Angela-MoneyFlow.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-069$t$,$t$https://www.youtube.com/watch?v=aYarRwQ5EZM$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Women in Uniform$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,201,$t$🎧 Listening (C1): Women in Uniform$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: carreira militar.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1351/T1369-Meg-01-Military.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-095$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Where to work in Asia$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,202,$t$🎧 Listening (C1): Where to work in Asia$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: trabalho remoto.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1301/T1324-Dan-Location.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-099$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Bitcoin Part 2$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,203,$t$🎧 Listening (C2): Bitcoin Part 2$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: finanças.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1522-Anthony-Bitcoin2.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-106$t$,$t$https://www.youtube.com/watch?v=eyWToFHVFaw$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Bitcoin Part 1$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,204,$t$🎧 Listening (C2): Bitcoin Part 1$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: finanças.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1521-Anthony-Bitcoin.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-107$t$,$t$https://www.youtube.com/watch?v=wjgGvuAT_BM$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Good Company$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,205,$t$🎧 Listening (C2): Good Company$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: empresas.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1251/1259-Spencer-Curtis-1-Company.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-114$t$,null,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C2): Minimum Wage$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,206,$t$🎧 Listening (C2): Minimum Wage$t$,$t$🎯 Prática de listening (C2) com uma conversa real de falantes nativos.

Tema: economia.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/0951/T983-Greg-Wages.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-121$t$,null,'[]'::jsonb,true);
    end if;
  end if;
  select id into m from public.mi_modules where name = $t$Inglês por Séries$t$ order by created_at limit 1;
  if m is not null then
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Movie Take$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,200,$t$🎧 Listening (B2): Movie Take$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: filmes.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1501/1505-Ben-Hanna-Movie.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-075$t$,$t$https://www.youtube.com/watch?v=HcOx9U7kM20$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Tips for Learning on TV$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,201,$t$🎧 Listening (B2): Tips for Learning on TV$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: aprender inglês.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1500-Ben-Hana-TV-Shows.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-076$t$,$t$https://www.youtube.com/watch?v=RS4dnS0PFKQ$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): Tips for Learning English$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,202,$t$🎧 Listening (B2): Tips for Learning English$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: aprender inglês.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1499-Ben-Hana-English-Tips.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-077$t$,$t$https://www.youtube.com/watch?v=cunAND0mBIw$t$,'[]'::jsonb,true);
    end if;
  end if;
  select id into m from public.mi_modules where name = $t$Inglês pela Música$t$ order by created_at limit 1;
  if m is not null then
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (B2): The Music Industry$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,200,$t$🎧 Listening (B2): The Music Industry$t$,$t$🎯 Prática de listening (B2) com uma conversa real de falantes nativos.

Tema: música.
🎧 Áudio no livro da aula · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1490-Ben-Hanna-Music-Business.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-078$t$,null,'[]'::jsonb,true);
    end if;
  end if;
  select id into m from public.mi_modules where name = $t$Idioms & Expressões$t$ order by created_at limit 1;
  if m is not null then
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Body Idioms - Part 2$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,200,$t$🎧 Listening (C1): Body Idioms - Part 2$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: expressões idiomáticas.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1466-MegTodd-BodyIdioms.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-090$t$,$t$https://www.youtube.com/watch?v=SdCOjf0xRF0$t$,'[]'::jsonb,true);
    end if;
    if not exists (select 1 from public.mi_lessons where module_id=m and title=$t$🎧 Listening (C1): Body Idioms - Part 1$t$) then
      insert into public.mi_lessons (module_id,ord,title,description,youtube_url,quiz,published) values (m,201,$t$🎧 Listening (C1): Body Idioms - Part 1$t$,$t$🎯 Prática de listening (C1) com uma conversa real de falantes nativos.

Tema: expressões idiomáticas.
🎬 Vídeo acima · exercícios antes e durante a escuta, flashcards e pronúncia.
📄 Transcrição: https://elllo.org/english/1451/1465-MegTodd-BodyIdioms.htm

Áudio/vídeo: ELLLO.org (Todd Beuckens).
livro: elllo-091$t$,$t$https://www.youtube.com/watch?v=V34Y6Qtznb4$t$,'[]'::jsonb,true);
    end if;
  end if;
end $blk$;
