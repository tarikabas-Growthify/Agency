// Outils communs aux formulaires traités par le Worker Cloudflare (dossier /worker).
// Ces fichiers tournent sur les serveurs de Cloudflare, pas dans le navigateur.

export interface Env {
  BREVO_API_KEY?: string; // clé API Brevo (secret)
  TURNSTILE_SECRET_KEY?: string; // clé secrète Turnstile (secret)
  CONTACT_TO?: string; // destinataire des messages (par défaut tarik.abas@growthify.fr)
  BREVO_SENDER_EMAIL?: string; // expéditeur vérifié dans Brevo (par défaut contact@growthify.fr)
  BREVO_LIST_ID?: string; // identifiant de la liste « Newsletter » dans Brevo
  ASSETS: { fetch: (request: Request) => Promise<Response> }; // fichiers du site (dossier dist)
}

export interface Ctx {
  request: Request;
  env: Env;
}

export const DEFAULT_TO = 'tarik.abas@growthify.fr';
export const DEFAULT_SENDER = 'contact@growthify.fr';

export function reply(request: Request, ok: boolean, message: string, status = ok ? 200 : 400) {
  // Les formulaires envoient en JavaScript (réponse JSON). Sans JavaScript, on renvoie vers la page.
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  if (wantsJson) {
    return new Response(JSON.stringify({ ok, message }), {
      status,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }
  const back = new URL(request.headers.get('referer') || '/', request.url);
  back.searchParams.set(ok ? 'envoye' : 'erreur', '1');
  return Response.redirect(back.toString(), 303);
}

export function clean(value: FormDataEntryValue | null, max = 5000) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max);
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

export async function verifyTurnstile(form: FormData, request: Request, env: Env) {
  // Sans clé secrète configurée (développement local), la vérification est ignorée.
  if (!env.TURNSTILE_SECRET_KEY) return true;
  const token = clean(form.get('cf-turnstile-response'), 2048);
  if (!token) return false;
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token);
  const ip = request.headers.get('cf-connecting-ip');
  if (ip) body.append('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const data = (await res.json()) as { success?: boolean };
  return !!data.success;
}

export async function sendEmail(
  env: Env,
  opts: { subject: string; html: string; text: string; replyTo?: { email: string; name?: string } },
) {
  if (!env.BREVO_API_KEY) throw new Error('BREVO_API_KEY manquante');
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Site Growthify', email: env.BREVO_SENDER_EMAIL || DEFAULT_SENDER },
      to: [{ email: env.CONTACT_TO || DEFAULT_TO, name: 'Tarik Abas' }],
      replyTo: opts.replyTo,
      subject: opts.subject,
      htmlContent: opts.html,
      textContent: opts.text,
    }),
  });
  if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
}
