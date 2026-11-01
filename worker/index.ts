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

  // Tâche planifiée (une fois par mois, voir « triggers » dans wrangler.jsonc).
  // Une clé API Brevo restreinte expire après 90 jours sans utilisation ; comme le formulaire
  // peut rester plusieurs mois sans message, on la sollicite par une lecture sans effet.
  async scheduled(_event: unknown, env: Env): Promise<void> {
    if (!env.BREVO_API_KEY) return;
    const res = await fetch('https://api.brevo.com/v3/smtp/statistics/aggregatedReport?days=1', {
      headers: { 'api-key': env.BREVO_API_KEY, accept: 'application/json' },
    });
    if (!res.ok) console.error(`Brevo keep-alive ${res.status}: ${await res.text()}`);
  },
};
