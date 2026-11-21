/* Filmes cristãos pra praticar inglês (aba "Cristãos" em Filmes). Nível = sugestão de dificuldade do inglês falado. */
(function(){
  var L=[
    ['prince-of-egypt-1998','A2','The Prince of Egypt',1998,'animação','fala clara, vocabulário bíblico e canções'],
    ['facing-the-giants-2006','B1','Facing the Giants',2006,'drama','inglês do dia a dia, fé e esporte'],
    ['fireproof-2008','B1','Fireproof',2008,'drama','diálogos de casal e trabalho, fala natural'],
    ['courageous-2011','B1','Courageous',2011,'drama','família e paternidade, frases curtas'],
    ['soul-surfer-2011','B1','Soul Surfer',2011,'drama','inglês jovem e surfe, história real'],
    ['war-room-2015','B1','War Room',2015,'drama','oração em inglês e conversas simples'],
    ['miracles-from-heaven-2016','B1','Miracles from Heaven',2016,'drama','família, hospital e fé'],
    ['i-can-only-imagine-2018','B1','I Can Only Imagine',2018,'drama','música e perdão, sotaque do Texas'],
    ['overcomer-2019','B1','Overcomer',2019,'drama','escola e esporte, fala do dia a dia'],
    ['heaven-is-for-real-2014','B1','Heaven Is for Real',2014,'drama','cidade pequena, linguagem de igreja'],
    ['do-you-believe-2015','B2','Do You Believe?',2015,'drama','várias histórias cruzadas, vocabulário variado'],
    ['risen-2016','B2','Risen',2016,'drama histórico','inglês formal de época'],
    ['the-case-for-christ-2017','B2','The Case for Christ',2017,'drama','jornalismo e argumentação'],
    ['the-shack-2017','B2','The Shack',2017,'drama','conversas profundas sobre fé e dor'],
    ['i-still-believe-2020','B2','I Still Believe',2020,'drama','música, doença e esperança'],
    ['jesus-revolution-2023','B2','Jesus Revolution',2023,'drama','gírias dos anos 70 e pregação'],
    ['chariots-of-fire-1981','C1','Chariots of Fire',1981,'drama histórico','sotaque britânico e vocabulário formal'],
    ['amazing-grace-2006','C1','Amazing Grace',2006,'drama histórico','debates políticos e linguagem de época'],
    ['the-hiding-place-1975','C1','The Hiding Place',1975,'drama histórico','sotaques e vocabulário da Segunda Guerra']
  ];
  var F=window.EBG_FILMES=window.EBG_FILMES||[];
  L.forEach(function(x){F.push({id:x[0],n:'CR',lv:x[1],t:x[2],y:x[3],g:x[4],d:'Nível '+x[1]+' · '+x[5]});});
})();
