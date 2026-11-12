// Cadastra sozinho os devocionais/aulas da playlist do YouTube na área de membros.
// Roda de hora em hora (agendamento no netlify.toml). Funções agendadas não aceitam chamada por endereço:
// o botão "Buscar agora" usa a devocionais-agora.js.
const { sincronizar } = require('./devocionais-agora.js');
exports.handler = async () => {
  const KEY = process.env.MEMBROS_SERVICE_KEY;
  if (!KEY) { console.log('Falta MEMBROS_SERVICE_KEY'); return { statusCode: 500 }; }
  try { console.log(JSON.stringify(await sincronizar(KEY))); return { statusCode: 200 }; }
  catch (e) { console.log('Erro: ' + (e.message || e)); return { statusCode: 500 }; }
};
