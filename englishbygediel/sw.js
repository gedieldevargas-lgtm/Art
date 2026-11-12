/* Necessário pra instalar a área de membros como app no celular.
   Não guarda nada em cache: tudo continua vindo da internet, sempre atualizado. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function () {});
