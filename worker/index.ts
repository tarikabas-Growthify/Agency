// Point d'entrée du Worker Cloudflare.
// Les pages et images (dossier dist) sont servies directement par Cloudflare ;
// seules les adresses /api/* arrivent ici (voir « run_worker_first » dans wrangler.jsonc).
import type { Env } from './shared';
import { handleContact } from './contact';
import { handleNewsletter } from './newsletter';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/contact' || pathname === '/api/newsletter') {
      if (request.method !== 'POST') {
        return new Response('Méthode non autorisée', { status: 405, headers: { allow: 'POST' } });
      }
      return pathname === '/api/contact' ? handleContact({ request, env }) : handleNewsletter({ request, env });
    }

    return env.ASSETS.fetch(request);
  },
};
