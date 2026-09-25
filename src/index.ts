import { buildServer } from './Presentation/Server.js';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = buildServer();

async function start() {
  try {
    const address = await server.listen({ port: PORT, host: HOST });
    console.log(`\n======================================================`);
    console.log(`  PLATAFORMA ENLACE — SERVIDOR HTTP EM OPERAÇÃO`);
    console.log(`  Endereço: ${address}`);
    console.log(`  Healthcheck: ${address}/api/v1/health`);
    console.log(`  Busca Catálogo: ${address}/api/v1/providers/search?state_uf=AC&city=Rio+Branco`);
    console.log(`======================================================\n`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
