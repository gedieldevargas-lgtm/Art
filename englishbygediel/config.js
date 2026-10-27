// Tudo o que você precisa trocar fica aqui.
window.EBG_CONFIG = {
  // Supabase → Project Settings → API. A chave "anon public" pode ficar no site.
  supabaseUrl: 'https://iwivldvubmsqyzkkdxoy.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aXZsZHZ1Ym1zcXl6a2tkeG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1OTE1MDgsImV4cCI6MjEwODE2NzUwOH0.eyoyRBBp4NAfLhG-ops6cj2-xck61Oalsj3d7h3h360',

  // WhatsApp com país + DDD, só números. Na landing antiga estava 55999895429
  // (faltava o 55 do Brasil antes do DDD 55). Confirme.
  whatsapp: '5555999895429',

  checkoutMentoria: 'https://pay.hotmart.com/Y101022807Y',
  videoApresentacao: 'eXfovCYxdZw',

  // testes gratuitos: cole aqui o link de cada um
  bussola: 'https://nivelamentogediel.netlify.app/',   // teste de nível (CEFR). Vazio = usa o teste rápido de 5 perguntas da própria página
  prisma: 'https://testedeinteligencia1.netlify.app/',  // teste de múltiplas inteligências. Vazio = o botão pede o link pelo WhatsApp

  // links abertos ao público
  toronto: 'https://forms.gle/V2dDVBXotN1XUmS1A',
  vlogs: 'https://www.youtube.com/@oficialinfly/videos',

  // ícones pequenos no topo da página. Confirme o TikTok.
  redes: {
    youtube: 'https://www.youtube.com/@teachergediel',
    tiktok: 'https://www.tiktok.com/@englishbygediel',
    metodo: 'https://instagram.com/metodoinglesinteligente'
  },

  instagram: {
    ebg: 'https://instagram.com/englishbygediel',
    eom: 'https://instagram.com/englishonmission',
    ingi: 'https://instagram.com/metodoinglesinteligente',
    escola: 'https://instagram.com/escolainfly',
    viagens: 'https://instagram.com/inflyviagens',
    depoimentos: 'https://www.instagram.com/stories/highlights/17976442123983837/',
    bastidores: 'https://www.instagram.com/stories/highlights/18047529878029312/'
  }
};
