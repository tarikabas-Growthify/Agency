// Inscription à la newsletter : ajoute le contact à la liste Brevo (BREVO_LIST_ID).
// Si aucune liste n'est configurée, l'inscription est envoyée par e-mail à Tarik.
import { type Ctx, reply, clean, escapeHtml, isEmail, verifyTurnstile, sendEmail } from './shared';

export async function handleNewsletter({ request, env }: Ctx) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(request, false, 'Formulaire invalide.');
  }

  if (clean(form.get('website'))) return reply(request, true, 'Merci, vous êtes inscrit !');

  const email = clean(form.get('email'), 160).toLowerCase();
  if (!isEmail(email)) return reply(request, false, "L'adresse e-mail semble invalide.");
  if (!(await verifyTurnstile(form, request, env))) return reply(request, false, 'La vérification anti-robot a échoué. Réessayez.');

  try {
    const listId = Number(env.BREVO_LIST_ID);
    if (env.BREVO_API_KEY && listId) {
      const res = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
      });
      // 201 = créé, 204 = déjà présent et mis à jour
      if (!res.ok) throw new Error(`Brevo ${res.status}: ${await res.text()}`);
    } else {
      await sendEmail(env, {
        subject: `Nouvelle inscription newsletter : ${email}`,
        html: `<p>Nouvelle inscription à la newsletter depuis growthify.fr : <strong>${escapeHtml(email)}</strong></p>`,
        text: `Nouvelle inscription à la newsletter : ${email}`,
      });
    }
  } catch (err) {
    console.error(err);
    return reply(request, false, "L'inscription a échoué. Réessayez dans un instant.", 502);
  }

  return reply(request, true, 'Merci, vous êtes inscrit !');
}
